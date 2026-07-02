import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
}

export const SearchBar = ({
  value,
  onChange,
  onSubmit,
  onFocus,
  onBlur,
  placeholder = 'Search for movies, TV shows, genres...',
}: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(value);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <motion.form
      onSubmit={handleSubmit}
      animate={{
        scale: isFocused ? 1.01 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`relative flex items-center w-full transition-all duration-300 rounded-2xl border ${
        isFocused
          ? 'border-streamly-red bg-white/[0.06] shadow-xl shadow-streamly-red/15'
          : 'border-white/20 bg-white/[0.04] hover:bg-white/[0.07] hover:border-white/30'
      }`}
    >
      <FiSearch
        className={`absolute left-4 transition-colors duration-300 ${
          isFocused ? 'text-streamly-red' : 'text-streamly-gray-light'
        }`}
        size={20}
      />

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => { setIsFocused(true); onFocus?.(); }}
        onBlur={() => { setIsFocused(false); onBlur?.(); }}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-white pl-12 pr-4 py-4 text-base placeholder-white/40 focus:outline-none"
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="p-2 mr-1 text-white/40 hover:text-white transition-colors"
        >
          <FiX size={18} />
        </button>
      )}

      <motion.button
        type="submit"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={`mr-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
          isFocused
            ? 'bg-streamly-red text-white shadow-lg shadow-streamly-red/25'
            : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
        }`}
      >
        Search
      </motion.button>
    </motion.form>
  );
};
