'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Category {
  type: string;
  id: string;
}

interface Transaction {
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

interface TransactionResponse {
  data: Transaction[];
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<TransactionResponse | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      console.log('📊 Fetching UP summary...');
      try {
        const response = await fetch('http://localhost:3010/up/get-summary', {
          method: 'GET',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch summary');
        }

        const data = await response.json();
        console.log('✅ Summary received');
        setSummary(data);
      } catch (err) {
        console.error('❌ Error fetching summary:', err);
        setError('Failed to load summary');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, []);

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

  const filteredTransactions = summary?.data.filter(transaction => {
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.attributes.description?.toLowerCase().includes(searchLower) ||
      transaction.attributes.rawText?.toLowerCase().includes(searchLower) ||
      transaction.relationships.category?.data?.id.toLowerCase().includes(searchLower) ||
      transaction.relationships.parentCategory?.data?.id.toLowerCase().includes(searchLower)
    );
  });

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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl text-center font-bold mb-6">Recent Transactions</h1>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex flex-col items-center gap-4 w-full max-w-2xl mx-auto">
        {filteredTransactions?.map((transaction) => (
          <Card
            key={transaction.id}
            onClick={() => toggleExpand(transaction.id)}
            className="w-full cursor-pointer hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg leading-none">
                    {transaction.attributes.description || 'Unnamed Transaction'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {transaction.attributes.rawText || 'No details available'}
                  </p>
                </div>
                <div className={`text-lg font-medium ${transaction.attributes.amount.value.startsWith('-')
                  ? 'text-red-600'
                  : 'text-green-600'
                  }`}>
                  {transaction.attributes.amount.value.startsWith('-') ? '' : '+'}
                  {transaction.attributes.amount.value} {transaction.attributes.amount.currencyCode}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-2">
                {/* Categories */}
                <div className="flex gap-2">
                  {transaction.relationships.parentCategory?.data && (
                    <Badge variant="secondary">
                      {transaction.relationships.parentCategory.data.id}
                    </Badge>
                  )}
                  {transaction.relationships.category?.data && (
                    <Badge variant="outline">
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
                    <div className="text-gray-500 font-mono text-xs">
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
                            #{tag.id}
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

      {/* Debug view - collapsible */}
      <details className="mt-8 p-4 bg-gray-50 rounded-lg">
        <summary className="cursor-pointer text-gray-600">
          View Raw Data
        </summary>
        <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto">
          {JSON.stringify(summary, null, 2)}
        </pre>
      </details>
    </div>
  );
}