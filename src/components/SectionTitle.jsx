import React from 'react';

const SIZES = {
  md: 'text-lg md:text-xl',
  lg: 'text-xl md:text-2xl',
};

// `size`: "md" (default) or "lg" for the bigger home page headings
// `className`: override the default bottom spacing (e.g. "mb-6 md:mb-8")
export default function SectionTitle({ title, subtitle, size = 'md', className = 'mb-8 md:mb-10' }) {
  return (
    <div className={`text-center ${className}`} id={`section-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      {subtitle && (
        <span className="text-[#db2777] text-xs font-semibold tracking-widest uppercase block mb-2">
          {subtitle}
        </span>
      )}
      <h2 className={`${SIZES[size] || SIZES.md} font-bold text-gray-900 tracking-wide uppercase`}>
        {title}
      </h2>
    </div>
  );
}
