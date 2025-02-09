// lib/db.ts
import { db } from '@vercel/postgres';
import { OpenAI } from 'openai';
import { createChunks } from './chunking';

// Type definitions
interface DocumentMetadata {
  source: string;
  title?: string;
  chunk_index?: number;
  total_chunks?: number;
  source_file?: string;
  [key: string]: string | number | undefined;
}

interface SearchResult {
  content: string;
  metadata: DocumentMetadata;
  similarity: number;
}

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Format embedding array for pgvector
function formatEmbeddingForPostgres(embedding: number[]): string {
  return `[${embedding.join(',')}]`;
}

// Setup database schema
export async function setupDatabase() {
  try {
    const client = await db.connect();
    // Enable vector extension
    await client.query('CREATE EXTENSION IF NOT EXISTS vector');
    
    // Create documents table with embeddings
    await client.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        metadata JSONB,
        embedding vector(1536)
      );

      -- Create HNSW index for fast similarity search
      CREATE INDEX IF NOT EXISTS documents_embedding_idx 
      ON documents 
      USING hnsw (embedding vector_cosine_ops)
      WITH (m = 16, ef_construction = 64);
    `);

    // Set optimal parameters for indexing
    await client.query(`
      SET maintenance_work_mem = '1GB';
      SET max_parallel_maintenance_workers = 2;
    `);

    console.log('Database setup completed');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}

// Generate embeddings using OpenAI
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

// Store document and its embedding
export async function storeDocument(
  content: string,
  metadata: DocumentMetadata
): Promise<void> {
  try {
    const client = await db.connect();
    const embedding = await generateEmbedding(content);
    const formattedEmbedding = formatEmbeddingForPostgres(embedding);
    
    await client.query(
      `INSERT INTO documents (content, metadata, embedding) 
       VALUES ($1, $2, $3)`,
      [content, metadata, formattedEmbedding]
    );
  } catch (error) {
    console.error('Error storing document:', error);
    throw error;
  }
}

// Search for similar documents
export async function searchSimilarDocuments(
  query: string,
  limit: number = 5
): Promise<SearchResult[]> {
  try {
    const client = await db.connect();
    const queryEmbedding = await generateEmbedding(query);
    const formattedEmbedding = formatEmbeddingForPostgres(queryEmbedding);
    
    const result = await client.query(
      `SELECT 
        content,
        metadata,
        1 - (embedding <=> $1) as similarity
       FROM documents
       ORDER BY embedding <=> $1
       LIMIT $2`,
      [formattedEmbedding, limit]
    );
    console.log('results',result.rows);
    return result.rows;
  } catch (error) {
    console.error('Error searching similar documents:', error);
    throw error;
  }
}

// RAG Pipeline
export async function generateAnswer(question: string): Promise<string> {
  try {
    // 1. Find relevant documents
    const similarDocs = await searchSimilarDocuments(question, 3);
    
    // 2. Create a prompt with context
    const context = similarDocs
      .map(doc => `${doc.content}\n(Source: ${doc.metadata.source})`)
      .join('\n\n');
    
    // 3. Generate answer using GPT-4
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that answers questions about Up Banking. 
                   Use the provided context to answer questions accurately. 
                   If you're not sure or the context doesn't contain relevant information, say so.
                   Always cite your sources when possible.`
        },
        {
          role: 'user',
          content: `Context:\n${context}\n\nQuestion: ${question}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return completion.choices[0].message.content || 'Unable to generate answer';
  } catch (error) {
    console.error('Error generating answer:', error);
    throw error;
  }
}

// Index documents
export async function indexDocuments(texts: { content: string; source: string }[]) {
  try {
    for (const { content, source } of texts) {
      // Split content into smaller chunks
      const chunks = createChunks(content, source);
      
      for (const chunk of chunks) {
        await storeDocument(chunk.content, chunk.metadata);
      }
      
      console.log(`Indexed document: ${source}`);
    }
  } catch (error) {
    console.error('Error indexing documents:', error);
    throw error;
  }
}