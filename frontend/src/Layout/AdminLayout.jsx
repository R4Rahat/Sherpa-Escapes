import { Outlet } from "react-router-dom";
import SideBar from "../modules/Admin/components/Sidebar";
import Header from "../modules/Admin/components/Header";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <SideBar />

      <div className="flex flex-1 flex-col md:ml-64">
        {/* <Header /> */}

        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
