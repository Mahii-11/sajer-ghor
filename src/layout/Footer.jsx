import React, { useEffect, useState } from 'react';
import {
  Facebook,
  Twitter,
  Linkedin,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CreditCard,
  RefreshCw,
  Globe
} from 'lucide-react';
import { FaYoutube } from 'react-icons/fa';
import { getSocialData, getSiteSettings } from '../services/api';

// Outline Instagram glyph that fills white on hover (needs a `group` parent),
// with the lens and dot cut out in the brand pink to match the solid Facebook icon.
const InstagramIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" className="stroke-current fill-transparent group-hover:fill-white transition-colors duration-300" />
    <circle cx="12" cy="12" r="4" className="stroke-current group-hover:stroke-[#db2777] transition-colors duration-300" />
    <circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none group-hover:fill-[#db2777] transition-colors duration-300" />
  </svg>
);

export default function Footer() {
  const [social, setSocial] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFooterData = async () => {
      try {
        setLoading(true);
        // Independent requests: one failing must not blank the other.
        const [socialRes, settingsRes] = await Promise.allSettled([
          getSocialData(),
          getSiteSettings()
        ]);

        if (settingsRes.status === 'fulfilled') {
          setSettings(settingsRes.value);
        } else {
          console.error("Failed to fetch site settings:", settingsRes.reason);
        }

        if (socialRes.status === 'fulfilled') {
          const socialData = socialRes.value;
          setSocial(Array.isArray(socialData) ? socialData : socialData?.data || []);
        } else {
          console.error("Failed to fetch social links:", socialRes.reason);
        }
      } finally {
        setLoading(false);
      }
    };

    loadFooterData();
  }, []);

  const renderSocialIcon = (item) => {
  // item.icon সহ সব পসিবল ফিল্ড চেক করা হচ্ছে
  const str = (
    (item?.icon || '') + 
    (item?.icon_name || '') + 
    (item?.name || '') + 
    (item?.title || '') + 
    (item?.link || '')
  ).toLowerCase();

  if (str.includes('facebook') || str.includes('fb')) return <Facebook className="w-4 h-4 fill-current" />;
  if (str.includes('instagram') || str.includes('insta')) return <InstagramIcon className="w-4 h-4" />;
  if (str.includes('twitter') || str.includes('x')) return <Twitter className="w-4 h-4 fill-current" />;
  if (str.includes('youtube') || str.includes('yt')) return <FaYoutube className="w-4 h-4" />;
  if (str.includes('linkedin')) return <Linkedin className="w-4 h-4 fill-current" />;

  return <Globe className="w-4 h-4" />;
};

  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass border-t-2 border-pink-200 text-gray-800 mt-12" id="main-footer">
      {/* Trust Badges Bar */}
      <div className="bg-white/40 backdrop-blur-md border-b-2 border-pink-200 py-7 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 text-center">
          <div className="flex flex-col items-center p-2">
            <ShieldCheck className="w-9 h-9 text-[#db2777] mb-2.5" />
            <h4 className="text-base font-bold text-gray-900 uppercase tracking-wide">100% Authentic</h4>
            <p className="text-sm text-gray-500 mt-1 max-w-xs">Sourced directly from official international brands</p>
          </div>
          <div className="flex flex-col items-center p-2">
            <RefreshCw className="w-9 h-9 text-[#db2777] mb-2.5" />
            <h4 className="text-base font-bold text-gray-900 uppercase tracking-wide">Easy Refunds</h4>
            <p className="text-sm text-gray-500 mt-1 max-w-xs">Hassle-free 7-day refund or replacement policy</p>
          </div>
          <div className="flex flex-col items-center p-2">
            <CreditCard className="w-9 h-9 text-[#db2777] mb-2.5" />
            <h4 className="text-base font-bold text-gray-900 uppercase tracking-wide">Secure Payment</h4>
            <p className="text-sm text-gray-500 mt-1 max-w-xs">Cash on delivery, bKash, SSLCommerz protected</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
        {/* Brand & Socials */}
        <div className="space-y-4">
          {settings?.logo && (
            <img
              src={settings.logo}
              alt={settings?.name || "Shajer Ghor"}
              className="h-10 object-contain"
            />
          )}

          <p className="text-sm text-gray-600 leading-relaxed">
            {settings?.note}
          </p>
          
          {/* Dynamic Social Links */}
          <div className="flex items-center gap-3 pt-2">
            {loading ? (
              <span className="text-sm text-gray-400 font-medium">Loading socials...</span>
            ) : (
              social.map((item, index) => (
                <a
                  key={item?.id || index}
                  href={item?.link || item?.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item?.name || 'Social Link'}
                  className="group w-8 h-8 rounded-full bg-white border border-pink-200 hover:bg-[#db2777] hover:border-[#db2777] hover:text-white text-[#db2777] flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer"
                >
                  {renderSocialIcon(item)}
                </a>
              ))
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm uppercase tracking-wider text-gray-900 font-bold mb-4 border-b border-pink-200/50 pb-2">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-sm text-gray-600 font-medium">
            <li><a href="#" className="hover:text-[#db2777] transition-colors">New Arrivals</a></li>
            <li><a href="#" className="hover:text-[#db2777] transition-colors">Exclusive Offers</a></li>
            <li><a href="#" className="hover:text-[#db2777] transition-colors">Trending Products</a></li>
            <li><a href="#" className="hover:text-[#db2777] transition-colors">Clearance Sale</a></li>
            <li><a href="#" className="hover:text-[#db2777] transition-colors">Gift Cards</a></li>
          </ul>
        </div>

        {/* Information */}
        <div>
          <h4 className="text-sm uppercase tracking-wider text-gray-900 font-bold mb-4 border-b border-pink-200/50 pb-2">
            Information
          </h4>
          <ul className="space-y-2.5 text-sm text-gray-600 font-medium">
            <li><a href="#" className="hover:text-[#db2777] transition-colors">About {settings?.name || 'Shajerghor'}</a></li>
            <li><a href="#" className="hover:text-[#db2777] transition-colors">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-[#db2777] transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#db2777] transition-colors">Return & Refund Policy</a></li>
            <li><a href="#" className="hover:text-[#db2777] transition-colors">FAQS & Support</a></li>
          </ul>
        </div>

        {/* Contact and Apps */}
        <div className="space-y-5">
          <div>
            <h4 className="text-sm uppercase tracking-wider text-gray-900 font-bold mb-4 border-b border-pink-200/50 pb-2">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm text-gray-600">
              {settings?.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#db2777] shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </li>
              )}
              {(settings?.contact || settings?.alternative_conatct) && (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#db2777] shrink-0" />
                  <span>
                    {settings?.contact} 
                    {settings?.alternative_conatct ? ` / ${settings.alternative_conatct}` : ''}
                  </span>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#db2777] shrink-0" />
                  <span>{settings.email}</span>
                </li>
              )}
            </ul>
          </div>

          {/* App Download Buttons 
          <div className="space-y-2 pt-2">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Download our App</span>
            <div className="flex flex-col sm:flex-row gap-2">
              <a href="#" className="bg-black hover:bg-gray-800 text-white rounded-lg px-3 py-1.5 flex items-center gap-2 transition-all duration-300 w-full sm:w-auto justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Apple_logo_black.svg" className="w-4 h-4 invert" alt="Apple" referrerPolicy="no-referrer" />
                <div className="text-left">
                  <span className="text-[8px] text-gray-400 block leading-none">Download on the</span>
                  <span className="text-[10px] font-bold leading-none">App Store</span>
                </div>
              </a>
              <a href="#" className="bg-black hover:bg-gray-800 text-white rounded-lg px-3 py-1.5 flex items-center gap-2 transition-all duration-300 w-full sm:w-auto justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Google_Play_Store_badge_EN.svg" className="w-4 h-4 object-contain" alt="Google Play" referrerPolicy="no-referrer" />
                <div className="text-left">
                  <span className="text-[8px] text-gray-400 block leading-none">GET IT ON</span>
                  <span className="text-[10px] font-bold leading-none">Google Play</span>
                </div>
              </a>
            </div>
          </div> */}
        </div>
      </div>

      {/* Copy & Legal */}
      <div className="border-t border-pink-100/50 bg-white/20 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
          <p>
            {settings?.copyright ||
              `© ${currentYear} ${settings?.name ? settings.name.toUpperCase() : 'SHAJERGHOR'}. All rights reserved.`}
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}