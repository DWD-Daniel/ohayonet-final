import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, Phone, MessageCircle, Plus, Minus } from 'lucide-react';
import backgroundImage from '../assets/my-photo.jpg';

interface CartItem {
  id: string;
  name: string;
  price: string;
  image?: string;
  quantity: number;
}

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  const persist = (next: CartItem[]) => {
    setCart(next);
    localStorage.setItem('cart', JSON.stringify(next));
  };

  const updateQuantity = (id: string, delta: number) => {
    persist(
      cart.map((item) => {
        if (item.id === id) {
          const q = item.quantity + delta;
          return { ...item, quantity: q < 1 ? 1 : q };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    persist(cart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      persist([]);
    }
  };

  const totalAmount = cart.reduce((sum, item) => {
    const numeric = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
    return sum + numeric * item.quantity;
  }, 0);

  const PHONE = '+2348067470702';
  const waLink = `https://wa.me/${PHONE.replace(/\+/g, '')}?text=${encodeURIComponent(
    `Hi! I would like to order the following items:\n${cart.map(item => `• ${item.name} x${item.quantity} - ${item.price}`).join('\n')}\n\nTotal: ₦${totalAmount.toLocaleString()}`
  )}`;

  return (
    <div 
      className="pt-16 min-h-screen bg-cover bg-center" 
      style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})` }}
    >
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl text-white font-bold flex items-center gap-3">
            <ShoppingCart className="w-8 h-8" />
            Shopping Cart
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-all"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="space-y-3">
              {cart.map((item) => {
                const itemPrice = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
                const itemTotal = itemPrice * item.quantity;
                
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center gap-4 flex-col md:flex-row">
                      {/* Product Image */}
                      {item.image && (
                        <div
                          className="w-24 h-24 bg-gray-200 bg-center bg-cover rounded-lg flex-shrink-0"
                          style={{ backgroundImage: `url(${item.image})` }}
                        />
                      )}
                      
                      {/* Product Info */}
                      <div className="flex-grow">
                        <h2 className="font-bold text-gray-900 text-lg">{item.name}</h2>
                        <p className="text-red-600 font-bold text-xl">{item.price}</p>
                      </div>

                      {/* Quantity & Actions */}
                      <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-2 hover:bg-gray-200 rounded transition-all"
                          title="Decrease quantity"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-2 hover:bg-gray-200 rounded transition-all"
                          title="Increase quantity"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <p className="text-gray-600 text-sm">Subtotal</p>
                        <p className="font-bold text-gray-900">₦{itemTotal.toLocaleString()}</p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-3 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                        title="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">₦{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2 text-gray-600 text-sm">
                  <span>Items: {cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
              </div>
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-red-600">₦{totalAmount.toLocaleString()}</span>
              </div>

              <button
                onClick={clearCart}
                className="w-full text-red-600 hover:bg-red-50 py-2 rounded-lg font-semibold transition-all"
              >
                Clear Cart
              </button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/products')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Continue Shopping
              </button>
              <a
                href={`tel:${PHONE}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-center"
              >
                <Phone className="w-5 h-5" />
                Call to Order
              </a>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-center"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
