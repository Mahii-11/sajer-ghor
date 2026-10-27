import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const THEMES = {
  pink: {
    bg: 'from-[#831843] via-[#be185d] to-[#f472b6]',
    glow: 'bg-pink-300/30',
    button: 'text-[#9d174d]',
  },
  indigo: {
    bg: 'from-[#1e1b4b] via-[#4338ca] to-[#db2777]',
    glow: 'bg-indigo-300/30',
    button: 'text-[#3730a3]',
  },
};

/**
 * Section banner. Two modes:
 *  - designed banner: pass `title` (+ optional `eyebrow`, `subtitle`, `viewAllTo`, `theme`)
 *    and the banner renders the category text with a "View All" button on the right.
 *  - image banner: pass `image`; it is never cropped and keeps its own aspect ratio.
 */
export default function SectionBanner({
  image,
  alt = 'Banner',
  to,
  title,
  eyebrow,
  subtitle,
  viewAllTo,
  theme = 'pink',
}) {
  if (title) {
    const t = THEMES[theme] || THEMES.pink;
    return (
      <div
        className={`relative overflow-hidden rounded-xl md:rounded-2xl shadow-sm bg-gradient-to-r ${t.bg}`}
      >
        {/* decorative shapes */}
        <div className={`absolute -right-16 -top-24 w-72 h-72 rounded-full blur-2xl ${t.glow}`} />
        <div className="absolute right-24 -bottom-28 w-64 h-64 rounded-full border-[28px] border-white/10" />
        <div className="absolute -left-10 -bottom-16 w-48 h-48 rounded-full bg-white/10" />

        <div className="relative flex items-center justify-between gap-4 px-5 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10 lg:py-12">
          <div className="min-w-0">
            {eyebrow && (
              <p className="mb-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-white/75">
                {eyebrow}
              </p>
            )}
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-white leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1.5 hidden sm:block text-sm md:text-base text-white/85">
                {subtitle}
              </p>
            )}
          </div>

          {viewAllTo && (
            <Link
              to={viewAllTo}
              className={`group shrink-0 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold shadow-lg hover:bg-black hover:text-white transition-colors ${t.button}`}
            >
              View All
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (!image) return null;

  const img = (
    <img
      src={image}
      alt={alt}
      loading="lazy"
      className="block w-full h-auto"
    />
  );

  const className =
    'block w-full overflow-hidden rounded-xl md:rounded-2xl bg-gray-100 shadow-sm';

  return to ? (
    <Link to={to} className={className}>{img}</Link>
  ) : (
    <div className={className}>{img}</div>
  );
}
