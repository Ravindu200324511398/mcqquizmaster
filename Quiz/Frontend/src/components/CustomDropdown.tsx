import React, { useState, useRef, useEffect } from 'react';

export interface DropdownOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
  badgeColor?: string;
  icon?: React.ReactNode;
}

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  icon?: React.ReactNode;
  id?: string;
  disabled?: boolean;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  className = '',
  buttonClassName = '',
  menuClassName = '',
  icon,
  id,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative select-none ${className}`} id={id}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(prev => !prev)}
        className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 
          bg-slate-900/90 hover:bg-slate-850 border border-white/10 hover:border-violet-500/50 
          focus:outline-none focus:ring-2 focus:ring-violet-500/40 text-left
          ${isOpen ? 'border-violet-500 ring-2 ring-violet-500/20 bg-slate-850 shadow-lg shadow-violet-500/10' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${buttonClassName}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1 truncate">
          {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <span className={`truncate ${selectedOption ? 'text-slate-100 font-medium' : 'text-slate-400'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span
              className={`shrink-0 ml-1.5 px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                selectedOption.badgeColor || 'bg-violet-500/20 text-violet-300 border-violet-500/30'
              }`}
            >
              {selectedOption.badge}
            </span>
          )}
        </div>

        {/* Animated Chevron */}
        <svg
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-violet-400' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Glassmorphic Options Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute left-0 right-0 mt-2 z-50 min-w-[200px] max-h-64 overflow-y-auto rounded-xl 
            bg-slate-900/95 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-black/80 p-1.5 
            animate-in fade-in zoom-in-95 duration-150 origin-top ${menuClassName}`}
          style={{
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 25px -5px rgba(124, 58, 237, 0.25)',
          }}
        >
          {options.map(option => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 text-left
                  ${
                    isSelected
                      ? 'bg-gradient-to-r from-violet-600/30 to-fuchsia-600/20 text-white border border-violet-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1 truncate">
                  {option.icon && <span className="shrink-0">{option.icon}</span>}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-slate-200 font-medium">{option.label}</div>
                    {option.description && (
                      <div className="text-[11px] text-slate-400 font-normal truncate mt-0.5">
                        {option.description}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {option.badge && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                        option.badgeColor || 'bg-violet-500/20 text-violet-300 border-violet-500/30'
                      }`}
                    >
                      {option.badge}
                    </span>
                  )}
                  {isSelected && (
                    <svg
                      className="w-4 h-4 text-violet-400 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
