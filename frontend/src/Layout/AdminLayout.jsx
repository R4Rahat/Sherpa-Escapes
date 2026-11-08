import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../modules/Admin/components/Sidebar";
import Header from "../modules/Admin/components/Header";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex">
      {/* Sidebar (Responsive drawer for mobile, fixed sidebar for desktop) */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Content Viewport */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Topbar Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content Outlet (Blank pages as requested) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
