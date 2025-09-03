import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { FileText, Download, Loader2 } from 'lucide-react';

interface BillingHistoryProps {
  userId: string;
}

interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: number;
  status: 'paid' | 'open' | 'void';
  url: string;
}

export function BillingHistory({ userId }: BillingHistoryProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock data for demo purposes
  useEffect(() => {
    const fetchInvoices = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock invoices
      const mockInvoices: Invoice[] = [
        {
          id: 'inv_1',
          number: 'INV-001',
          date: '2024-08-01',
          amount: 5.00,
          status: 'paid',
          url: '#',
        },
        {
          id: 'inv_2',
          number: 'INV-002',
          date: '2024-07-01',
          amount: 5.00,
          status: 'paid',
          url: '#',
        },
        {
          id: 'inv_3',
          number: 'INV-003',
          date: '2024-06-01',
          amount: 5.00,
          status: 'paid',
          url: '#',
        },
      ];
      
      setInvoices(mockInvoices);
      setIsLoading(false);
    };
    
    fetchInvoices();
  }, [userId]);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'void':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
        <CardDescription>
          View and download your past invoices
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Invoice</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Download</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b">
                    <td className="px-4 py-4 text-sm">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-2" />
                        {invoice.number}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">{formatDate(invoice.date)}</td>
                    <td className="px-4 py-4 text-sm">{formatAmount(invoice.amount)}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(invoice.status)}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <a href={invoice.url} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4" />
                        </a>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices yet</h3>
            <p className="text-gray-500">
              You don't have any invoices yet. They will appear here once you subscribe to a paid plan.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

