import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingCart, CheckCircle, XCircle, Loader2, X } from 'lucide-react';
import { useForm } from '@formspree/react';

// --- STABLE MODAL COMPONENTS (Defined OUTSIDE the main function) ---
// By moving them out, they are NOT re-declared on every keystroke, fixing the focus issue.

const ModalWrapper = ({ children, onClose }: { children: React.ReactNode, onClose: () => void }) => 
  createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        {children}
      </div>
    </div>,
    document.body
  );

// --- MAIN COMPONENT ---

export default function PaystackCheckout({ productName, productPrice, productId }: any) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [state, handleFormspreeSubmit] = useForm('mlgwkkpn');

  const priceInNaira = parseFloat(productPrice.replace('$', ''));
  const priceInKobo = Math.round(priceInNaira * 100);

  // Trigger Paystack only when Formspree succeeds
  useEffect(() => {
    if (state.succeeded && showModal) {
      setShowModal(false);
      openPaystackGateway();
    }
  }, [state.succeeded]);

  const openPaystackGateway = () => {
    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    if (!window.PaystackPop) return;

    const handler = (window as any).PaystackPop.setup({
      key: publicKey,
      email: email, // Change 'customer@example.com' to email,
      amount: priceInKobo,
      currency: 'NGN',
      ref: `${productId}_${Date.now()}`,
      callback: (response: any) => {
        setIsVerifying(true);
        verifyOnServer(response.reference);
      },
      onClose: () => setIsProcessing(false)
    });
    handler.openIframe();
  };

  const verifyOnServer = async (reference: string) => {
    try {
      const res = await fetch('/.netlify/functions/verify-payment', {
        method: 'POST',
        body: JSON.stringify({ reference, email })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setShowSuccess(true);
      } else {
        setErrorMessage(result.error || 'Verification failed');
        setShowError(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Server error');
      setShowError(true);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)} 
        disabled={isProcessing || isVerifying}
        className="bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-semibold w-full hover:bg-red-700 transition-all"
      >
        Buy
      </button>

      {/* Delivery Details Modal */}
      {showModal && (
        <ModalWrapper onClose={() => setShowModal(false)}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Delivery Details</h3>
            <button onClick={() => setShowModal(false)}><X className="w-6 h-6 text-gray-400" /></button>
          </div>
          <form onSubmit={handleFormspreeSubmit} className="space-y-4">
            <input type="text" name="fullName" placeholder="Full Name" required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full p-3 border rounded-lg" />
            <input type="text" name="address" placeholder="Address" required value={address} onChange={e => setAddress(e.target.value)} className="w-full p-3 border rounded-lg" />
            <input type="tel" name="phone" placeholder="Phone" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-3 border rounded-lg" />
            <input type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border rounded-lg" />
            <button type="submit" disabled={state.submitting} className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold">
              {state.submitting ? 'Processing...' : 'Continue to Payment'}
            </button>
          </form>
        </ModalWrapper>
      )}

      {/* Verification / Status Modals */}
      {isVerifying && (
        <ModalWrapper onClose={() => {}}>
           <div className="flex flex-col items-center">
             <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
             <p className="font-bold">Verifying Payment...</p>
           </div>
        </ModalWrapper>
      )}

      {showSuccess && (
        <ModalWrapper onClose={() => setShowSuccess(false)}>
          <div className="flex flex-col items-center">
            <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Success!</h3>
            <button onClick={() => setShowSuccess(false)} className="w-full bg-green-600 text-white py-3 rounded-lg mt-4">Done</button>
          </div>
        </ModalWrapper>
      )}

      {showError && (
        <ModalWrapper onClose={() => setShowError(false)}>
          <div className="flex flex-col items-center">
            <XCircle className="w-16 h-16 text-red-600 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Error</h3>
            <p className="text-center mb-4">{errorMessage}</p>
            <button onClick={() => setShowError(false)} className="w-full bg-red-600 text-white py-3 rounded-lg">Try Again</button>
          </div>
        </ModalWrapper>
      )}
    </>
  );
}