import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onSubmit?: (query: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
}

export default function SearchBar({ onSearch, onSubmit, placeholder = 'Search products...', className, value: controlledValue }: SearchBarProps) {
  const [internalValue, setInternalValue] = useState('');
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    if (onSearch) {
      onSearch(newValue);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && value.trim()) {
      onSubmit(value.trim());
    }
  };

  const handleIconClick = () => {
    if (onSubmit && value.trim()) {
      onSubmit(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="w-full px-4 py-2 pl-10 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
      />
      <button
        type="button"
        onClick={handleIconClick}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer hover:text-red-600 transition-colors"
      >
        <Search className="w-4 h-4 text-gray-400 hover:text-red-600" />
      </button>
    </form>
  );
}
