import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { resolveImageUrl } from "../utils/imageUrl";

// Avatar button in the navbar with an Account / Logout dropdown
export default function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const avatar = resolveImageUrl(user?.image);

  return (
    <div className="relative" ref={ref}>
      <button
        id="btn-user-menu"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1.5 h-8 pl-0.5 pr-2 rounded-full bg-gray-100 hover:bg-pink-50 transition-colors cursor-pointer"
      >
        <img src={avatar} alt="Account" className="w-7 h-7 rounded-full object-cover bg-white" />
        <ChevronDown className={`w-3.5 h-3.5 text-gray-600 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white border border-gray-100 shadow-xl py-2 z-[60]"
        >
          <div className="flex items-center gap-3 px-4 pb-3 mb-1 border-b border-gray-100">
            <img src={avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{user?.name || "My Account"}</p>
              {user?.email && <p className="text-xs text-gray-500 truncate">{user.email}</p>}
            </div>
          </div>

          <Link
            to="/dashboard"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-pink-50 hover:text-[#db2777] transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" /> Account
          </Link>
          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-pink-50 hover:text-[#db2777] transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
