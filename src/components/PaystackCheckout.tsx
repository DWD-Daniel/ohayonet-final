import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Phone, MessageCircle, ShoppingCart } from 'lucide-react';
import { useForm } from '@formspree/react';

// Props updated to include autoOpen
interface PaystackCheckoutProps {
  productName: string;
  productPrice: string;
  productId: string;
  autoOpen?: boolean;
}

const ModalWrapper = ({ children, onClose }: { children: React.ReactNode, onClose: () => void }) =>
  createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
        {children}
      </div>
    </div>,
    document.body
  );

export default function PaystackCheckout({ productName, productPrice, productId, autoOpen }: PaystackCheckoutProps) {
  const [showModal, setShowModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  
  const [state, handleFormspreeSubmit] = useForm('mlgwkkpn');

  // NEW: Effect to handle the auto-open redirect logic
  useEffect(() => {
    if (autoOpen) {
      setShowModal(true);
      // Optional: Smooth scroll to this product so user knows which one they are buying
      document.getElementById(`product-${productId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [autoOpen, productId]);

  useEffect(() => {
    if (state.succeeded && showModal) {
      setShowModal(false);
      setShowOrderModal(true);
    }
  }, [state.succeeded, showModal]);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-semibold w-full hover:bg-red-700 transition-all flex items-center justify-center gap-1"
      >
        <ShoppingCart className="w-3 h-3" />
        <span>Buy</span>
      </button>

      {showModal && (
        <ModalWrapper onClose={() => setShowModal(false)}>
          <button onClick={() => setShowModal(false)} className="absolute right-4 top-4">
            <X className="w-6 h-6 text-gray-400" />
          </button>
          <h3 className="text-2xl font-bold mb-2">Delivery Details</h3>
          <p className="text-gray-600 mb-6 text-sm">Buying: <span className="font-bold">{productName}</span> ({productPrice})</p>
          
          <form onSubmit={handleFormspreeSubmit} className="space-y-4">
            {/* Hidden field so Formspree knows which product was bought */}
            <input type="hidden" name="Product" value={productName} />
            <input type="text" name="fullName" placeholder="Full Name" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-600 outline-none" />
            <input type="tel" name="phone" placeholder="Phone Number" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-600 outline-none" />
            <button type="submit" disabled={state.submitting} className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-all">
              {state.submitting ? 'Processing...' : 'Continue to Payment'}
            </button>
          </form>
        </ModalWrapper>
      )}

      {showOrderModal && (
        <ModalWrapper onClose={() => setShowOrderModal(false)}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Complete Your Order</h3>
            <button onClick={() => setShowOrderModal(false)}><X className="w-6 h-6 text-gray-400" /></button>
          </div>
          <div className="space-y-4">
            <p className="text-gray-600 text-center mb-6">Details saved. Choose how you'd like to pay:</p>
            <button onClick={() => setShowPhoneNumber(!showPhoneNumber)} className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-3">
              <Phone className="w-5 h-5" /> Call to Order
            </button>
            {showPhoneNumber && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <a href="tel:+2348067470702" className="text-green-600 text-xl font-bold">+234 80160137474</a>
              </div>
            )}
            <button onClick={() => window.open(`https://wa.me/2348067470702`, '_blank')} className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-3">
              <MessageCircle className="w-5 h-5" /> WhatsApp Order
            </button>
          </div>
        </ModalWrapper>
      )}
    </>
  );
}