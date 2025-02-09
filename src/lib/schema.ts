import { vector, pgTable, serial, text, jsonb } from 'drizzle-orm/pg-core';
import { index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  metadata: jsonb('metadata'),
  embedding: vector('embedding', { dimensions: 1536 })
}, (table) => ({
  embeddingIdx: index('documents_embedding_idx')
    .using('hnsw')
    .on(table.embedding.op('vector_cosine_ops'))
    .withParameterizedStatement(
      sql`WITH (m = 16, ef_construction = 64)`
    )
})); 