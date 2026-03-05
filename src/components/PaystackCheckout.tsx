import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Phone, MessageCircle } from 'lucide-react';
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

export default function PaystackCheckout() {
  const [showModal, setShowModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);

  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [state, handleFormspreeSubmit] = useForm('mlgwkkpn');

  // Add logging for state changes
  useEffect(() => {
    console.log('PaystackCheckout: showModal changed to', showModal);
  }, [showModal]);

  useEffect(() => {
    console.log('PaystackCheckout: showOrderModal changed to', showOrderModal);
  }, [showOrderModal]);

  // Add cleanup logging
  useEffect(() => {
    console.log('PaystackCheckout: component mounted');
    return () => {
      console.log('PaystackCheckout: component unmounting');
    };
  }, []);

  // Trigger order modal when Formspree succeeds
  useEffect(() => {
    if (state.succeeded && showModal) {
      setShowModal(false);
      setShowOrderModal(true);
    }
  }, [state.succeeded, showModal]);

  const handleCallToOrder = () => {
    setShowPhoneNumber(!showPhoneNumber);
  };

  const handleChatToOrder = () => {
    const phoneNumber = '+234800000000';
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
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

      {/* Order Options Modal */}
      {showOrderModal && (
        <ModalWrapper onClose={() => setShowOrderModal(false)}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Complete Your Order</h3>
            <button onClick={() => setShowOrderModal(false)}><X className="w-6 h-6 text-gray-400" /></button>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600 text-center mb-6">
              Your delivery details have been saved. Choose how you'd like to complete your order:
            </p>

            {/* Call to Order Button */}
            <button
              onClick={handleCallToOrder}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-3"
            >
              <Phone className="w-5 h-5" />
              Call to Order
            </button>

            {showPhoneNumber && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-800 font-semibold">Call us now:</p>
                <a
                  href="tel:+234800000000"
                  className="text-green-600 text-xl font-bold hover:text-green-800"
                >
                  +234 800 000 000
                </a>
              </div>
            )}

            {/* Chat to Order Button */}
            <button
              onClick={handleChatToOrder}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
            >
              <MessageCircle className="w-5 h-5" />
              Chat to Order (WhatsApp)
            </button>

            <div className="text-center text-sm text-gray-500 mt-4">
              <p>We'll contact you shortly to process your order</p>
            </div>
          </div>
        </ModalWrapper>
      )}
    </>
  );
}