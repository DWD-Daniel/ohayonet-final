import { useState } from 'react';
import { ShoppingCart, CheckCircle, XCircle, Loader2 } from 'lucide-react';

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

  const priceInNaira = parseFloat(productPrice.replace('$', ''));
  const priceInKobo = Math.round(priceInNaira * 100);

  const handlePayment = () => {
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
      metadata: {
        product_id: productId,
        product_name: productName,
        custom_fields: [
          {
            display_name: 'Product',
            variable_name: 'product_name',
            value: productName
          }
        ]
      },
      onClose: function() {
        setIsProcessing(false);
      },
      callback: async function(response: any) {
        setIsProcessing(false);
        setIsVerifying(true);

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
          setErrorMessage('Unable to verify payment. Please contact support with your reference: ' + response.reference);
          setShowError(true);
        } finally {
          setIsVerifying(false);
        }
      }
    });

    handler.openIframe();
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-2">Payment Successful!</h3>
          <p className="text-gray-600 mb-6">
            Your payment for <span className="font-semibold">{productName}</span> has been confirmed.
          </p>
          <button
            onClick={() => setShowSuccess(false)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (showError) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-2">Payment Error</h3>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <button
            onClick={() => setShowError(false)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (isVerifying) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-bold text-black mb-2">Verifying Payment...</h3>
          <p className="text-gray-600">Please wait while we confirm your transaction.</p>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handlePayment}
      disabled={isProcessing}
      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
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
  );
}
