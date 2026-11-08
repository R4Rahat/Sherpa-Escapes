import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Package,
  CalendarCheck,
  Inbox,
  HelpCircle,
  Quote,
  ShoppingBag,
  LogOut,
  X,
  ChevronsUpDown,
  Book
} from "lucide-react";
import { useAuthStore } from "../../../store/useAuthStore";

export default function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  const closeSidebarOnMobile = () => {
    if (setOpen) setOpen(false);
  };

  const menuItems = [
    { name: "Home", path: "/admin", icon: Home, end: true },
    { name: "Package", path: "/admin/packages", icon: Package, end: false },
    { name: "Booking", path: "/admin/bookings", icon: CalendarCheck, end: false },
    { name: "Enquiry", path: "/admin/enquiries", icon: Inbox, end: false },
    { name: "Faq", path: "/admin/faqs", icon: HelpCircle, end: false },
    { name: "Testimonial", path: "/admin/testimonials", icon: Quote, end: false },
    { name: "Blogs", path: "/admin/blogs", icon: Book, end: false },
  ];

  const displayName = user?.name || user?.email?.split("@")[0] || "Admin";
  const displayRole = user?.role || "Administrator";

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={closeSidebarOnMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-dvh w-72 lg:w-64 bg-[#FAFAFA] border-r border-slate-200/80
          flex flex-col justify-between
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 select-none
        `}
      >
        {/* Top Header & Navigation */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo / Brand Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200/60 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white font-bold shadow-xs">
                <span className="font-mono text-base tracking-tighter">S</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-[15px] tracking-tight leading-none">
                  Sherpa Excapes
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={closeSidebarOnMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
              aria-label="Close Sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 scrollbar-thin">
            {/* MAIN MENU SECTION */}
            <div>
              <p className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase px-3 mb-2">
                MAIN MENU
              </p>

              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.end}
                      onClick={closeSidebarOnMobile}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive
                          ? "bg-white shadow-xs border border-slate-200/90 text-slate-900 font-semibold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                        }`
                      }
                    >
                      <Icon size={18} className="text-slate-500 shrink-0" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>


          </div>
        </div>

        {/* Bottom Profile Section */}
        <div className="p-3 border-t border-slate-200/70 bg-white/50 relative">
          {profileDropdownOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-xl shadow-lg border border-slate-200 p-1.5 z-50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition cursor-pointer font-medium"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          <div
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-200/50 transition cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold text-xs shrink-0 overflow-hidden ring-1 ring-slate-200">
                <span className="uppercase">{displayName.charAt(0)}</span>
              </div>

              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-slate-900 text-sm truncate leading-tight">
                  {displayName}
                </span>
                <span className="text-[11px] text-slate-400 truncate leading-normal">
                  {displayRole}
                </span>
              </div>
            </div>

            <ChevronsUpDown size={16} className="text-slate-400 shrink-0 ml-1" />
          </div>
        </div>
      </aside>
    </>
  );
}
