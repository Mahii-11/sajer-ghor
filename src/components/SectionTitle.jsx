import React from 'react';

const SIZES = {
  md: 'text-lg md:text-xl',
  lg: 'text-xl md:text-2xl',
};

// `size`: "md" (default) or "lg" for the bigger home page headings
export default function SectionTitle({ title, subtitle, size = 'md' }) {
  return (
    <div className="text-center mb-8 md:mb-10" id={`section-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>
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
