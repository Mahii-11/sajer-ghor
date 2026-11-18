import { Menu, Home } from "lucide-react";
import { Link } from "react-router-dom"; // Search, Bell: lagbe jokhon search/notification uncomment hobe


import { resolveImageUrl } from "../../utils/imageUrl";

export default function Header({ setSidebarOpen, setActiveTab, user, loading = false }) {
  return (
    <header className="h-16 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-[0_10px_30px_-18px_rgba(219,39,119,0.35)] flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 sticky top-0">
      {/* Left: Menu & Search */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button 
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-md"
          onClick={() => setSidebarOpen(true)}
          data-testid="button-open-sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* TODO: Search input - search API ready hole uncomment kore dynamic korte hobe (import e Search add korte hobe)
        <div className="hidden sm:flex items-center bg-slate-100 px-3 py-2 rounded-lg w-64 border border-transparent focus-within:border-[#db2777] focus-within:bg-white transition-all focus-within:ring-4 focus-within:ring-[#db2777]/10">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
            data-testid="input-search"
          />
        </div>
        */}
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-3 sm:gap-5">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#db2777] transition-colors"
          data-testid="link-header-home"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Shop</span>
        </Link>

        {/* TODO: Notifications - notification API ready hole uncomment kore dynamic korte hobe (import e Bell add korte hobe)
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors" data-testid="button-notifications">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
        */}

        {/* Profile */}
        {loading ? (
          <div className="flex items-center gap-3 animate-pulse" aria-hidden="true">
            <div className="hidden sm:block space-y-2">
              <div className="h-3.5 w-20 bg-slate-200 rounded ml-auto" />
              <div className="h-3 w-14 bg-slate-100 rounded ml-auto" />
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-200" />
          </div>
        ) : (
          <div onClick={() => setActiveTab('profile')} className="flex items-center gap-3 cursor-pointer group" data-testid="button-profile-menu">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-slate-700 group-hover:text-[#db2777] transition-colors" data-testid="text-username"> {user?.name || "Guest"}</p>
              <p className="text-xs text-slate-500">Customer</p>
            </div>
            <img 
              src={resolveImageUrl(user?.image)}
              alt="User avatar" 
              className="w-9 h-9 rounded-full ring-2 ring-slate-100 group-hover:ring-[#db2777]/30 transition-all object-cover" 
              data-testid="img-avatar-header" 
            />
          </div>
        )}
      </div>
    </header>
  );
}