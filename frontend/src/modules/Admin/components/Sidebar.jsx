import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function SideBar() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Packages", path: "/admin/packages" },
    { name: "Bookings", path: "/admin/bookings" },
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between h-16 px-4">
        

        <button onClick={() => setOpen(true)}>
          <Menu size={28} />
        </button>
      </header>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-64 bg-slate-900 text-white
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Mobile Close Button */}
        <div className="md:hidden flex justify-end p-4">
          <button onClick={() => setOpen(false)}>
            <X size={28} />
          </button>
        </div>

        {/* Logo */}
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="text-2xl font-bold">Adventure</h2>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col p-4 gap-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-3 hover:bg-slate-800 transition"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
