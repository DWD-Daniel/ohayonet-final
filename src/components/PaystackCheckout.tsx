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
  
  // NEW: State for Delivery Info
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const priceInNaira = parseFloat(productPrice.replace('$', ''));
  const priceInKobo = Math.round(priceInNaira * 100);

  const handlePayment = () => {
    // NEW: Validation before opening Paystack
    if (!fullName || !address || !phone) {
      setErrorMessage('Please enter your full name, delivery address, and phone number.');
      setShowError(true);
      return;
    }

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
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                reference: response.reference,
                email: 'customer@example.com',
                full_name: fullName, // Add this
                address: address,
                phone: phone
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

  // --- RENDERS (Modals kept exactly as you had them) ---
  if (showSuccess) { /* ... keep your existing success modal code ... */ }
  if (showError) { /* ... keep your existing error modal code ... */ }
  if (isVerifying) { /* ... keep your existing loading modal code ... */ }

  return (
    <div className="flex flex-col gap-2">
      {/* NEW: Input fields for user data */}
      <input 
        type="text" placeholder="Full Name" 
        value={fullName} onChange={(e) => setFullName(e.target.value)}
        className="border p-2 rounded text-xs"
      />
      <input 
        type="text" placeholder="Delivery Address" 
        value={address} onChange={(e) => setAddress(e.target.value)}
        className="border p-2 rounded text-xs"
      />
      <input 
        type="tel" placeholder="Phone Number" 
        value={phone} onChange={(e) => setPhone(e.target.value)}
        className="border p-2 rounded text-xs"
      />

      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
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
    </div>
  );
}