import { useState, useEffect } from 'react';
import { ShoppingCart, CheckCircle, XCircle, Loader2, X } from 'lucide-react';
import { useForm } from '@formspree/react';

interface PaystackCheckoutProps {
  productName: string;
  productPrice: string;
  productId: string;
}

interface PaystackPopup {
  setup: (config: any) => void;
  openIframe: () => void;
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (config: any) => PaystackPopup;
    };
  }
}

export default function PaystackCheckout({ productName, productPrice, productId }: PaystackCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const [state, handleFormspreeSubmit] = useForm('mlgwkkpn');

  const priceInNaira = parseFloat(productPrice.replace('$', ''));
  const priceInKobo = Math.round(priceInNaira * 100);

  useEffect(() => {
    if (state.succeeded && showModal) {
      setShowModal(false);
      setFullName('');
      setAddress('');
      setPhone('');
      openPaystackGateway();
    }
  }, [state.succeeded, showModal]);

  const handleBuyClick = () => {
    setShowModal(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !address.trim() || !phone.trim()) {
      setErrorMessage('Please fill in all fields.');
      setShowError(true);
      return;
    }

    await handleFormspreeSubmit(e);
  };

  const openPaystackGateway = () => {
    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

    if (!publicKey) {
      setErrorMessage('Payment system is not configured. Please contact support.');
      setShowError(true);
      return;
    }

    if (!window.PaystackPop) {
      setErrorMessage('Payment system is loading. Please try again in a moment.');
      setShowError(true);
      return;
    }

    setIsProcessing(true);

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: 'customer@example.com',
      amount: priceInKobo,
      currency: 'NGN',
      ref: `${productId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      callback: function(response: any) {
        setIsProcessing(false);
        setIsVerifying(true);

        const verifyPayment = async () => {
          try {
            const verifyResponse = await fetch('/.netlify/functions/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                reference: response.reference,
                email: 'customer@example.com'
              })
            });

            const result = await verifyResponse.json();

            if (verifyResponse.ok && result.success) {
              setShowSuccess(true);
              setTimeout(() => setShowSuccess(false), 5000);
            } else {
              setErrorMessage(result.error || 'Payment verification failed. Please contact support.');
              setShowError(true);
            }
          } catch (error) {
            console.error('Verification error:', error);
            setErrorMessage('Unable to verify payment. Please contact support.');
            setShowError(true);
          } finally {
            setIsVerifying(false);
          }
        };

        verifyPayment();
      },
      onClose: function() {
        setIsProcessing(false);
      }
    });

    handler.openIframe();
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-6">
              Your order has been confirmed. Thank you for your purchase!
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showError) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-2">Payment Failed</h3>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <button
              onClick={() => setShowError(false)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isVerifying) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
          <div className="flex flex-col items-center text-center">
            <Loader2 className="w-16 h-16 text-red-600 animate-spin mb-4" />
            <h3 className="text-2xl font-bold text-black mb-2">Verifying Payment</h3>
            <p className="text-gray-600">Please wait while we confirm your transaction...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleBuyClick}
        disabled={isProcessing}
        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-3 h-3" />
            <span>Buy</span>
          </>
        )}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-black">Delivery Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-black mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-black mb-2">
                  Delivery Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none"
                  placeholder="Enter your delivery address"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-black mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              <input type="hidden" name="productName" value={productName} />
              <input type="hidden" name="productPrice" value={productPrice} />
              <input type="hidden" name="productId" value={productId} />

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={state.submitting}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {state.submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    'Continue to Payment'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
