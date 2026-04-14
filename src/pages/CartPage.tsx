import { useState, useEffect } from 'react';
import backgroundImage from '../assets/my-photo.jpg';

interface CartItem {
  id: string;
  name: string;
  price: string;
  image?: string;
  quantity: number;
}

export default function CartPage() {
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

  const totalAmount = cart.reduce((sum, item) => {
    // assume price formatted like "₦1200" or "$10.00"
    const numeric = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
    return sum + numeric * item.quantity;
  }, 0);

  // phone for call and whatsapp
  const PHONE = '+2348067470702';
  const waLink = `https://wa.me/${PHONE.replace(/\+/g, '')}?text=${encodeURIComponent(
    'Hi, I would like to order the following items from my cart.'
  )}`;

  return (
    <div 
      className="pt-16 min-h-screen bg-cover bg-center" 
      style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})` }}
    >
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl text-white font-bold mb-8">Your Cart</h1>

        {cart.length === 0 ? (
          <p className="text-white">Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white rounded-lg shadow p-4"
              >
                <div className="flex items-center gap-4">
                  {item.image && (
                    <div
                      className="w-16 h-16 bg-gray-200 bg-center bg-cover rounded"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                  )}
                  <div>
                    <h2 className="font-semibold text-black">{item.name}</h2>
                    <p className="text-red-600 font-bold">{item.price}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="px-2 py-1 bg-gray-100 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="px-2 py-1 bg-gray-100 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-4 text-sm text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="px-4 py-2 text-right text-white bg-gray-800 font-bold text-lg rounded">
              Total: {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>

            <div className="flex flex-col md:flex-row md:justify-end gap-4">
              <a
                href={`tel:${PHONE}`}
                className="bg-blue-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-center"
              >
                Call to Order
              </a>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-center"
              >
                Chat to Order
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
