import { useState } from "react";
import { Search, Bell, Mail, Menu, LogOut, User as UserIcon } from "lucide-react";
import { useAuthStore } from "../../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function Header({ onMenuClick }) {
  const [searchValue, setSearchValue] = useState("");
  const [showMobileUserMenu, setShowMobileUserMenu] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  const displayName = user?.name || user?.email?.split("@")[0] || "Admin";

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-3">
      {/* Left side: Mobile Menu Button + Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu size={22} />
        </button>

        {/* Search Bar matching screenshot */}
        {/* <div className="relative w-full max-w-xs sm:max-w-sm">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search"
            className="w-full h-10 pl-4 pr-10 rounded-xl bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200/90 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition-all"
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
            <Search size={18} />
          </span>
        </div> */}
      </div>

      {/* Right side: Action Icons (Notifications, Mail, Profile/Logout) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Messages / Mail Icon */}
        {/* <button
          type="button"
          className="relative p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          aria-label="Messages"
        >
          <Mail size={19} />
        </button> */}

        {/* Notifications Bell Icon with badge */}
        {/* <button
          type="button"
          className="relative p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={19} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white" />
        </button> */}

        {/* User quick avatar / logout on mobile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMobileUserMenu(!showMobileUserMenu)}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-slate-200 transition cursor-pointer ml-1"
            aria-label="User Account"
          >
            <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold uppercase">
              {displayName.charAt(0)}
            </div>
          </button>

          {showMobileUserMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {displayName}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {user?.email || "admin@example.com"}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition cursor-pointer"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
