import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductSubcategory } from '../data/categories';

interface CarouselProps {
  items: ProductSubcategory[];
  onCardClick: (categoryId: string) => void;
}

export default function Carousel({ items, onCardClick }: CarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener('resize', updateScrollButtons);
    return () => window.removeEventListener('resize', updateScrollButtons);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(updateScrollButtons, 500);
    }
  };

  const handleDragStart = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    const startX = e.clientX - carouselRef.current.offsetLeft;
    const scrollLeft = carouselRef.current.scrollLeft;

    const handleDragMove = (moveEvent: MouseEvent) => {
      const x = moveEvent.clientX - carouselRef.current!.offsetLeft;
      const walk = (x - startX) * 1;
      carouselRef.current!.scrollLeft = scrollLeft - walk;
    };

    const handleDragEnd = () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      updateScrollButtons();
    };

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!carouselRef.current) return;
    const startX = e.touches[0].clientX - carouselRef.current.offsetLeft;
    const scrollLeft = carouselRef.current.scrollLeft;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const x = moveEvent.touches[0].clientX - carouselRef.current!.offsetLeft;
      const walk = (x - startX) * 1;
      carouselRef.current!.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      updateScrollButtons();
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div className="relative w-full">
      <div
        ref={carouselRef}
        onMouseDown={handleDragStart}
        onTouchStart={handleTouchStart}
        className="flex gap-6 overflow-x-auto scrollbar-hide select-none cursor-grab active:cursor-grabbing"
        style={{ scrollBehavior: 'smooth' }}
      >
        {items.map((item) => (
          <button
           key={item.id}
  onClick={() => onCardClick(item.id)}
  // Change w-72 to w-[45vw] for mobile, and use sm:w-72 for larger screens
  className="group flex-shrink-0 w-[45vw] sm:w-72 aspect-video rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 focus:outline-none"
          >
            <div className="relative h-full w-full">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${item.image})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 via-red-900/40 to-transparent" />
              <div className="absolute bottom-6 left-6 text-left">
                <h3 className="text-white text-lg sm:text-2xl font-bold leading-tight">
  {item.name}</h3>
              </div>
            </div>
          </button>
        ))}
      </div>

      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-black" />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all"
        >
          <ChevronRight className="w-6 h-6 text-black" />
        </button>
      )}
    </div>
  );
}
