import { Outlet } from "react-router-dom";
import SideBar from "../modules/Admin/components/Sidebar";
import Header from "../modules/Admin/components/Header";



export default function AdminLayout() {
    return (
        <div className="flex">
            <SideBar />
            <div className="flex-1">
                <Header />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}