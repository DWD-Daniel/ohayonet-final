import { useState, useEffect, memo, useMemo } from 'react';
// FIXED: Added ShoppingCart to the imports
import { ArrowRight, ShoppingCart } from 'lucide-react';
import Carousel from '../components/Carousel';
import SearchBar from '../components/SearchBar';
import mySectionBg from '../assets/pharmacy-interior.jpg';
// Note: PaystackCheckout import can be removed if not used elsewhere in this file
import { PRODUCT_CATEGORIES, getNewArrivals, getDiscountedProducts, Product } from '../data/categories';

interface HomePageProps {
  onNavigate: (page: string, productType?: string, param?: string) => void;
  onSearchSubmit?: (query: string) => void;
}

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.pexels.com/photos/3683041/pexels-photo-3683041.jpeg?auto=compress&cs=tinysrgb&w=1920',
];

// BEST PRACTICE: Define ProductCard outside the main component
const ProductCard = memo(({ product, onNavigate }: { product: Product; onNavigate: (page: string, productType?: string) => void }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 group">
    {/* 1. Image Section */}
    <div
      className="h-40 bg-gray-200 bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
      style={{ backgroundImage: `url(${product.image})` }}
    />

    {/* 2. Content Section */}
    <div className="p-3">
      {/* Name and "New" Tag */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-bold text-black flex-1">{product.name}</h3>
        {product.isNew && (
          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full ml-2 flex-shrink-0">
            Limited
          </span>
        )}
      </div>

      {/* Price and "Discount" Tag */}
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          {product.discount ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-xs line-through text-gray-500">{'$' + (parseFloat(product.price.slice(1)) * 1.25).toFixed(2)}</span>
                <span className="text-sm font-bold text-red-600">{product.price}</span>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                Best-seller
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-red-600">{product.price}</span>
          )}
        </div>
      </div>

      {/* 3. The Redirect Button (Linked to Products Page) */}
      <div className="mt-3">
        <button
          onClick={() => onNavigate('products', undefined, product.id)}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1"
        >
          <ShoppingCart className="w-3 h-3" />
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  </div>
));

export default function HomePage({ onNavigate, onSearchSubmit }: HomePageProps) {
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'drug' | 'non-drug' | 'medical-device'>('drug');

  // Smooth Hero Image transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeCategory = PRODUCT_CATEGORIES.find((cat) => cat.type === activeTab);
  const newArrivals = useMemo(() => getNewArrivals(), []);
  const discountedProducts = useMemo(() => getDiscountedProducts(), []);

  const handleSubcategoryClick = (subcategoryId: string) => {
    onNavigate('products', activeTab, subcategoryId);
  };

  return (
    <div className="pt-16 min-h-screen bg-white">
      <section className="relative h-60 md:h-70 flex items-center justify-center overflow-hidden">
        {HERO_IMAGES.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === heroImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}

        <div className="absolute inset-0 bg-black/50 z-1" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 mt-6 md:mt-0">
            We Dispense Rare Drugs
          </h1>
          <p className="text-base md:text-xl text-gray-100 mb-4 md:mb-8">
            Your trusted source for one-of-a-kind pharmaceuticals and health products
          </p>

          <div className="md:hidden mb-6">
            <SearchBar onSubmit={onSearchSubmit} placeholder="Search products..." />
          </div>

          <button
            onClick={() => onNavigate('products', 'drug')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 md:px-8 md:py-3 text-sm md:text-base rounded-full font-semibold transition-all hover:scale-105 inline-flex items-center gap-2"
          >
            Shop Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <section className="py-6 bg-stone-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-2">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center">Cold Chain</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
              {PRODUCT_CATEGORIES.find((cat) => cat.type === 'drug')?.subcategories
                ?.find((sub) => sub.id === 'antidiabetics')?.products.map((product) => (
                  <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
                )) || []}
            </div>
          </div>
          <div className="flex gap-4 mb-8 justify-center">
            {PRODUCT_CATEGORIES.map((category) => {
              const label = category.label === 'Surgicals' ? 'Surgicals' : category.label;
              return (
                <button
                  key={category.type}
                  onClick={() => setActiveTab(category.type as typeof activeTab)}
                  className={`px-3 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-base font-semibold rounded-full transition-all ${activeTab === category.type
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-white text-black border-2 border-gray-200 hover:border-red-600'
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {activeCategory && (
            <Carousel items={activeCategory.subcategories} onCardClick={handleSubcategoryClick} />
          )}
        </div>
      </section>

      <section
        className="relative py-12 bg-cover bg-center bg-no-repeat"
        style={{
          // 2. Use the imported variable and add a slight dark tint so text stays readable
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${mySectionBg})`
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4">Limited Deals</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-black mb-5">Best Sellers</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {discountedProducts.map((product) => (
              <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0">

          {/* Left Side: Name & Address */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-lg mb-2">Ohayonet Pharmacy</h3>
            <p className="text-gray-400">123 Health Avenue, Medical District</p>
            <p className="text-gray-400">City, State, ZIP Code</p>
            <a
              href="mailto:ohayonetpharmacy@gmail.com"
              className="text-blue-400 hover:text-blue-300 transition-colors block mt-2"
            >
              ohayonetpharmacy@gmail.com
            </a>
          </div>

          {/* Right Side: Legal & Copyright */}
          <div className="text-center md:text-right flex flex-col items-center md:items-end">
            <p className="text-gray-400">
              &copy; 2026 Ohayonet Pharmacy. All rights reserved.
            </p>
            <div className="mt-2 space-x-4 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}