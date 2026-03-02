import { useState } from 'react';
import { Search, Package, Calendar, DollarSign, CheckCircle, Loader2 } from 'lucide-react';

interface Transaction {
  id: string;
  reference: string;
  email: string;
  amount: number;
  status: string;
  created_at: string;
}

export default function MyOrdersPage() {
  const [email, setEmail] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const response = await fetch('/.netlify/functions/get-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await response.json();

      if (response.ok) {
        setTransactions(data.transactions || []);
      } else {
        setError(data.error || 'Failed to fetch orders');
        setTransactions([]);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Unable to fetch orders. Please try again.');
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number) => {
    return `₦${(amount / 100).toFixed(2)}`;
  };

  return (
    <div className="pt-16 min-h-screen bg-white">
      <section
        className="relative py-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">My Orders</h1>
          <p className="text-xl text-gray-100">
            Track your order history and transaction details
          </p>
        </div>
      </section>

      <section className="py-16 bg-stone-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-black mb-6">Find Your Orders</h2>
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-6 py-4 rounded-lg mb-8">
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {hasSearched && !isLoading && transactions.length === 0 && !error && (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-black mb-2">No Orders Found</h3>
              <p className="text-gray-600">
                We couldn't find any orders associated with this email address.
              </p>
            </div>
          )}

          {transactions.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-black mb-4">
                Order History ({transactions.length})
              </h3>

              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          {transaction.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Package className="w-4 h-4" />
                          <span className="text-sm">
                            <span className="font-semibold text-black">Reference:</span>{' '}
                            {transaction.reference}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {formatDate(transaction.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 px-6 py-4 rounded-lg">
                      <DollarSign className="w-6 h-6 text-red-600" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Amount Paid</p>
                        <p className="text-2xl font-bold text-black">
                          {formatAmount(transaction.amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            &copy; 2026 Ohayonet Pharmacy. All rights reserved. | Terms & Conditions | Privacy Policy
          </p>
        </div>
      </footer>
    </div>
  );
}
