import React from 'react';

export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="text-center mb-8 md:mb-10" id={`section-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      {subtitle && (
        <span className="text-[#db2777] text-xs font-semibold tracking-widest uppercase block mb-2">
          {subtitle}
        </span>
      )}
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-wide relative inline-block">
        {title}
        <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#db2777] rounded-full"></span>
      </h2>
    </div>
  );
}
