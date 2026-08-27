import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Phone, Mail, MapPin, ShieldCheck, CreditCard, RefreshCw } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass border-t border-pink-100/50 text-gray-800 mt-12" id="main-footer">
      {/* Trust Badges Bar */}
      <div className="bg-white/40 backdrop-blur-md border-b border-pink-100/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center p-2">
            <ShieldCheck className="w-8 h-8 text-[#db2777] mb-2" />
            <h4 className="text-sm font-bold text-gray-900 uppercase">100% Authentic</h4>
            <p className="text-xs text-gray-500 mt-1">Sourced directly from official international brands</p>
          </div>
          <div className="flex flex-col items-center p-2">
            <RefreshCw className="w-8 h-8 text-[#db2777] mb-2" />
            <h4 className="text-sm font-bold text-gray-900 uppercase">Easy Refunds</h4>
            <p className="text-xs text-gray-500 mt-1">Hassle-free 7-day refund or replacement policy</p>
          </div>
          <div className="flex flex-col items-center p-2">
            <CreditCard className="w-8 h-8 text-[#db2777] mb-2" />
            <h4 className="text-sm font-bold text-gray-900 uppercase">Secure Payment</h4>
            <p className="text-xs text-gray-500 mt-1">Cash on delivery, bKash, SSLCommerz protected</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
        {/* Brand & Socials */}
        <div className="space-y-4">
          <h3 className="text-2xl font-black tracking-tighter text-[#db2777]">
            SHAJER<span className="text-black">GHOR</span>
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Bangladesh's most trusted premium destination for certified 100% authentic cosmetics, skincare, fragrances, and maternal wellness products.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-3 pt-2">
            <a href="#" className="w-8 h-8 rounded-full bg-white border border-pink-200 hover:bg-[#db2777] hover:text-white text-gray-600 flex items-center justify-center transition-all duration-300 shadow-sm">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white border border-pink-200 hover:bg-[#db2777] hover:text-white text-gray-600 flex items-center justify-center transition-all duration-300 shadow-sm">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white border border-pink-200 hover:bg-[#db2777] hover:text-white text-gray-600 flex items-center justify-center transition-all duration-300 shadow-sm">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white border border-pink-200 hover:bg-[#db2777] hover:text-white text-gray-600 flex items-center justify-center transition-all duration-300 shadow-sm">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-gray-900 font-extrabold mb-4 border-b border-pink-200/50 pb-2">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-xs text-gray-600 font-medium">
            <li><a href="#" className="hover:text-[#db2777] transition-colors">New Arrivals</a></li>
            <li><a href="#" className="hover:text-[#db2777] transition-colors">Exclusive Offers</a></li>
            <li><a href="#" className="hover:text-[#db2777] transition-colors">Trending Products</a></li>
            <li><a href="#" className="hover:text-[#db2777] transition-colors">Clearance Sale</a></li>
            <li><a href="#" className="hover:text-[#db2777] transition-colors">Gift Cards</a></li>
          </ul>
        </div>

        {/* Information */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-gray-900 font-extrabold mb-4 border-b border-pink-200/50 pb-2">
            Information
          </h4>
          <ul className="space-y-2.5 text-xs text-gray-600 font-medium">
            <li><a href="#" className="hover:text-[#db2777] transition-colors">About Shajerghor</a></li>
            <li><a href="#" className="hover:text-[#db2777] transition-colors">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-[#db2777] transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#db2777] transition-colors">Return & Refund Policy</a></li>
            <li><a href="#" className="hover:text-[#db2777] transition-colors">FAQS & Support</a></li>
          </ul>
        </div>

        {/* Contact and Apps */}
        <div className="space-y-5">
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gray-900 font-extrabold mb-4 border-b border-pink-200/50 pb-2">
              Contact Us
            </h4>
            <ul className="space-y-3 text-xs text-gray-600">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#db2777] shrink-0 mt-0.5" />
                <span>Level-4, Shajeer Tower, Banani, Dhaka-1213, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#db2777] shrink-0" />
                <span>+880 1999-999999 (9 AM - 10 PM)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#db2777] shrink-0" />
                <span>support@shajerghor.com</span>
              </li>
            </ul>
          </div>

          {/* App Download Buttons */}
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
          </div>
        </div>
      </div>

      {/* Copy & Legal */}
      <div className="border-t border-pink-100/50 bg-white/20 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
          <p>© {currentYear} SHAJERGHOR. All rights reserved.</p>
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
