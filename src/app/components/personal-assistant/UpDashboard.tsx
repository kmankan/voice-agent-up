'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from 'next/navigation';
import { SendHorizontal, RefreshCcw } from 'lucide-react';
import { authHeaders, removeAuthToken } from '@/lib/auth';

export interface Category {
  type: string;
  id: string;
}

export interface Transaction {
  id: string;
  attributes: {
    status: string;
    rawText: string;
    description: string;
    message: string | null;
    isCategorizable: boolean;
    amount: {
      currencyCode: string;
      value: string;
      valueInBaseUnits: number;
    };
    cardPurchaseMethod?: {
      method: string;
      cardNumberSuffix: string;
    } | null;
    settledAt: string;
    createdAt: string;
    transactionType: string;
    performingCustomer?: {
      displayName: string;
    } | null;
    deepLinkURL?: string;
  };
  relationships: {
    category: {
      data: Category | null;
    };
    parentCategory: {
      data: Category | null;
    };
    tags: {
      data: string[];
    };
    account?: {
      data: Category | null;
    };
    attachment?: {
      data: string | null;
    };
  };
}

export interface TransactionResponse {
  data: Transaction[];
}

export interface InsightResponse {
  answer: string;
}

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

function formatInsightMessage(content: string) {
  // Check if the delimiter exists
  if (content.includes('The transactions are:')) {
    const [summary, transactionsList] = content.split('The transactions are:');
    return (
      <div className="space-y-3">
        <p className="font-medium">{summary.trim()}</p>
        {transactionsList && (
          <div className="space-y-1">
            <p className="font-medium text-base">Transactions:</p>
            <ul className="list-none space-y-1">
              {transactionsList.trim().split('\n').filter(Boolean).map((transaction, idx) => (
                <li key={idx} className="flex justify-between text-sm py-1 border-b border-gray-200 last:border-0">
                  <span className="flex gap-2">
                    <span>{transaction.split(': ')[0]}</span>
                    <span>{transaction.split(': ')[1]?.split(' - ')[0]}</span>
                  </span>
                  <span className="font-medium">{transaction.split(' - ')[1]}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // If delimiter isn't found, just display the content as is
  return (
    <div className="space-y-3">
      <p className="font-medium">{content.trim()}</p>
    </div>
  );
}

function InsightsPanel({
  messages,
  setMessages,
  inputMessage,
  setInputMessage,
  handleSubmit,
  messagesEndRef
}: {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div id="insights" className="h-[80vh] md:h-[85vh] border-2 border-white rounded-lg py-2 px-1 md:px-2 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-circular font-bold text-[#ffee52]">
          Insights
        </h2>
        <button
          onClick={() => setMessages([])}
          className="p-2 hover:bg-[#3a7c7a] rounded-full transition-colors"
          title="Reset conversation"
        >
          <RefreshCcw className="w-5 h-5 text-[#ffee52]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-[80%] ${message.role === 'assistant'
              ? 'ml-auto bg-[#489b98] text-white'
              : 'bg-gray-200 text-black'
              }`}
          >
            {message.role === 'assistant'
              ? formatInsightMessage(message.content)
              : message.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-1">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask about transactions..."
          className="flex-1 px-1 py-1 text-xs md:text-base rounded-lg bg-neutral-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ffee52] focus:border-transparent resize-none"
        />
        <button
          type="submit"
          className="px-3 md:px-4 ml-1 py-2 bg-[#ffee52] text-[#ff705c] rounded-lg hover:bg-[#3a7c7a] transition-colors active:transform active:scale-95 active:bg-[#ffdd00]"
        >
          <SendHorizontal className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

function TransactionsPanel({
  searchTerm,
  setSearchTerm,
  selectedAccounts,
  handleAccountToggle,
  filteredTransactions,
  expandedId,
  toggleExpand,
  formatDate,
  summary
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedAccounts: Set<'personal' | 'joint'>;
  handleAccountToggle: (accountType: 'personal' | 'joint') => void;
  filteredTransactions: Transaction[];
  expandedId: string | null;
  toggleExpand: (id: string) => void;
  formatDate: (dateString: string) => string;
  summary: TransactionResponse | null;
}) {
  return (
    <div id="transactions" className="h-[85vh] flex flex-col">
      {/* Search Bar - keep outside of scroll area */}
      <div className="w-11/12 mx-auto mb-3">
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs md:text-base px-2 md:px-4 py-2 bg-neutral-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Account type toggle */}
      <div className="flex gap-2 md:gap-4 items-center justify-center font-circular font-bold text-[#ffee52] mb-3">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedAccounts.has('personal')}
            onChange={() => handleAccountToggle('personal')}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span>Personal</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedAccounts.has('joint')}
            onChange={() => handleAccountToggle('joint')}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span>2Up</span>
        </label>
      </div>

      {/* Scrollable transaction list */}
      <div className="flex-1 overflow-y-auto font-circular">
        <div className="flex flex-col items-center gap-4">
          {filteredTransactions?.map((transaction) => (
            <Card
              key={transaction.id}
              onClick={() => toggleExpand(transaction.id)}
              className={`w-11/12 cursor-pointer hover:shadow-lg transition-shadow ${transaction.attributes.amount.value.startsWith('-')
                ? 'bg-[#ff8bd1]'
                : 'bg-[#489b98]'
                }`}
            >
              <CardHeader className="p-3 md:p-4">
                <div className="flex flex-col md:flex-row justify-between items-start">
                  <div className="flex flex-col space-y-1 w-full">
                    <h3 className="font-semibold text-base md:text-lg leading-none text-[#ffee52]">
                      {transaction.attributes.description || 'Unnamed Transaction'}
                    </h3>
                    <p className="text-sm text-muted-foreground text-black w-full overflow-scroll">
                      {transaction.attributes.rawText || ''}
                    </p>
                  </div>
                  <div className={`flex text-right leading-none text-sm md:text-base font-medium ${transaction.attributes.amount.value.startsWith('-')
                    ? 'text-rose-600'
                    : 'text-green-200'
                    }`}>
                    {transaction.attributes.amount.value.startsWith('-') ? '' : '+'}
                    ${transaction.attributes.amount.value}
                  </div>
                </div>
              </CardHeader>

              <CardContent className='p-3 md:p-4'>
                <div className="space-y-2">
                  {/* Categories */}
                  <div className="flex gap-2">
                    {transaction.relationships.parentCategory?.data && (
                      <Badge variant="secondary" className="p-0 text-[10px] md:text-sm">
                        {transaction.relationships.parentCategory.data.id}
                      </Badge>
                    )}
                    {transaction.relationships.category?.data && (
                      <Badge variant="outline" className="bg-[#71f38b] text-black p-0 text-[10px] md:text-sm">
                        {transaction.relationships.category.data.id}
                      </Badge>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div>
                    <Badge variant={transaction.attributes.status === 'SETTLED' ? 'default' : 'secondary'}>
                      {transaction.attributes.status}
                    </Badge>
                  </div>
                </div>

                {/* Expanded content remains the same */}
                {expandedId === transaction.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="space-y-3 text-sm">
                      {/* Transaction ID */}
                      <div className="text-gray-900 font-mono text-xs">
                        ID: {transaction.id}
                      </div>

                      {/* Transaction Type & Status */}
                      <div className="flex gap-2 flex-wrap">
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                          {transaction.attributes.transactionType}
                        </span>
                        {transaction.attributes.isCategorizable && (
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-600">
                            Categorizable
                          </span>
                        )}
                      </div>

                      {/* Additional Details */}
                      <div className="space-y-1 text-gray-600">
                        {transaction.attributes.message && (
                          <div>
                            <span className="font-medium">Message:</span>
                            <p className="italic">&quot;{transaction.attributes.message}&quot;</p>
                          </div>
                        )}

                        {transaction.attributes.cardPurchaseMethod && (
                          <div>
                            <span className="font-medium">Payment:</span>
                            {' '}{transaction.attributes.cardPurchaseMethod.method}
                            {' '}(*{transaction.attributes.cardPurchaseMethod.cardNumberSuffix})
                          </div>
                        )}

                        <div>
                          <span className="font-medium">Created:</span>
                          {' '}{formatDate(transaction.attributes.createdAt)}
                        </div>

                        {transaction.attributes.settledAt && (
                          <div>
                            <span className="font-medium">Settled:</span>
                            {' '}{formatDate(transaction.attributes.settledAt)}
                          </div>
                        )}

                        {transaction.attributes.performingCustomer && (
                          <div>
                            <span className="font-medium">By:</span>
                            {' '}{transaction.attributes.performingCustomer.displayName}
                          </div>
                        )}

                        {transaction.relationships.account?.data && (
                          <div>
                            <span className="font-medium">Account:</span>
                            {' '}{transaction.relationships.account.data.id}
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {transaction.relationships.tags?.data.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {transaction.relationships.tags.data.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Attachment Indicator */}
                      {transaction.relationships.attachment?.data && (
                        <div className="text-blue-600">
                          <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          Has attachment
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Debug view - moved inside scroll area */}
        <details className="mt-8 mx-auto max-w-2xl p-4 bg-gray-50 rounded-lg">
          <summary className="cursor-pointer text-gray-600">
            View Raw Data
          </summary>
          <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto">
            {JSON.stringify(summary, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<TransactionResponse | null>(null);
  const [anonymisedSummary, setAnonymisedSummary] = useState<TransactionResponse | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedAccounts, setSelectedAccounts] = useState<Set<'personal' | 'joint'>>(new Set(['personal', 'joint']));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (summary) {
      setAnonymisedSummary(anonymiseData(summary));
    }
  }, [summary]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // strips out any sensitive or identifiable data from the transaction data found in variable summary
  const anonymiseData = (transactionInformation: TransactionResponse): TransactionResponse => {
    const anonymisedData = transactionInformation.data?.map(transaction => ({
      ...transaction,
      id: `XXXX-${transaction.id.slice(-4)}`,
      attributes: {
        ...transaction.attributes,
        description: transaction.attributes.description?.replace(/[A-Za-z0-9]{16,}|(?:\+?\d{2}[-\s]?)?\d{10}|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '[REDACTED]') ?? null,
        rawText: transaction.attributes.rawText?.replace(/[A-Za-z0-9]{16,}|(?:\+?\d{2}[-\s]?)?\d{10}|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '[REDACTED]') ?? null,
        message: transaction.attributes.message?.replace(/[A-Za-z0-9]{16,}|(?:\+?\d{2}[-\s]?)?\d{10}|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '[REDACTED]') ?? null,
        cardPurchaseMethod: transaction.attributes.cardPurchaseMethod ? {
          method: transaction.attributes.cardPurchaseMethod.method,
          cardNumberSuffix: 'XXXX'
        } : null,
        performingCustomer: transaction.attributes.performingCustomer ? {
          displayName: 'Anonymous User'
        } : null,
        deepLinkURL: undefined
      },
      relationships: {
        ...transaction.relationships,
        account: transaction.relationships.account ? {
          data: {
            type: transaction.relationships.account.data?.type ?? 'account',
            id: 'XXXX'
          }
        } : {
          data: null
        }
      }
    }));
    return { data: anonymisedData };
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const message = inputMessage.trim();
    // is message is empty, do nothing
    if (!message) return;
    // clear the input message field
    setInputMessage('');

    // Create temporary variable to store messages and update the globalmessages state with new user message
    const newMessages = [...messages, { role: 'user' as const, content: message }];
    setMessages(newMessages);
    console.log('current messages', newMessages);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/up/insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
          anonymisedSummary
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch insights');
      }

      const data: InsightResponse = await response.json();
      console.log('✅ Insights received', data);// Update to include all previous messages plus the new assistant response
      setMessages([...newMessages, { role: 'assistant', content: data.answer }]);
    } catch (error) {
      console.error('❌ Error fetching insights:', error);
      setError('Failed to fetch insights');
    }
  };

  useEffect(() => {
    const fetchSummary = async () => {
      console.log('selectedAccounts', selectedAccounts, Array.from(selectedAccounts));
      console.log('📊 Fetching UP summary...');
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/up/get-summary`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ accountTypes: Array.from(selectedAccounts) })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch summary');
        }

        const data = await response.json();
        console.log('✅ Summary received');
        console.log('Summary data:', data);
        setSummary(data);
      } catch (err) {
        console.error('❌ Error fetching summary:', err);
        setError('Failed to load summary');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [selectedAccounts]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredTransactions = summary?.data?.filter(transaction => {
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.attributes.description?.toLowerCase().includes(searchLower) ||
      transaction.attributes.rawText?.toLowerCase().includes(searchLower) ||
      transaction.relationships.category?.data?.id.toLowerCase().includes(searchLower) ||
      transaction.relationships.parentCategory?.data?.id.toLowerCase().includes(searchLower)
    );
  }) ?? [];

  const handleAccountToggle = (accountType: 'personal' | 'joint') => {
    setSelectedAccounts(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(accountType)) {
        // Don't allow deselecting if it's the last selected option
        if (newSelection.size > 1) {
          newSelection.delete(accountType);
        }
      } else {
        newSelection.add(accountType);
      }
      return newSelection;
    });
  };

  const handleExit = async () => {
    try {
      // Call logout endpoint with JWT
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/logout`, {
        method: 'POST',
        headers: authHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.clearToken) {
          removeAuthToken();
        }
      }

      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-4 bg-red-100 text-red-700 rounded-lg">
      Error: {error}
    </div>
  );

  return (
    <div className="px-3">
      <div className="absolute top-4 right-4">
        <button
          onClick={handleExit}
          className="px-4 py-2 bg-[#ffee52] text-[#ff705c] rounded-lg hover:bg-red-600 hover:text-white transition-colors "
        >
          Exit
        </button>
      </div>

      <h1 className="text-5xl text-center font-circular font-bold pt-4 md:pt-3 mb-4 md:mb-8 text-[#ffee52]">Recent Transactions</h1>

      <div className="grid grid-cols-[60%_40%] md:grid-cols-2 gap-2 md:gap-2">
        <InsightsPanel
          messages={messages}
          setMessages={setMessages}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSubmit={handleSubmit}
          messagesEndRef={messagesEndRef}
        />
        <TransactionsPanel
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedAccounts={selectedAccounts}
          handleAccountToggle={handleAccountToggle}
          filteredTransactions={filteredTransactions}
          expandedId={expandedId}
          toggleExpand={toggleExpand}
          formatDate={formatDate}
          summary={summary}
        />
      </div>
    </div>
  );
}