import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "../modules/Admin/Dashboard/DashboardPage";
import PackagePage from "../modules/Admin/Package/PackagePage";
import BookingPage from "../modules/Admin/Booking/BookingPage";
import BlankPage from "../modules/Admin/components/BlankPage";
import Login from "../components/Login";
import HomePage from "../modules/Public/Home/HomePage";
import AdminLayout from "../Layout/AdminLayout";
import ProtectedRoute from "../modules/Admin/components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/admin",
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                index: true,
                element: <DashboardPage />,
              },
              {
                path: "packages",
                element: <PackagePage />,
              },
              {
                path: "bookings",
                element: <BookingPage />,
              },
              {
                path: "enquiries",
                element: <BlankPage title="Enquiry" />,
              },
              {
                path: "faqs",
                element: <BlankPage title="Faq" />,
              },
              {
                path: "testimonials",
                element: <BlankPage title="Testimonial" />,
              },
              {
                path: "blogs",
                element: <BlankPage title="Blogs" />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
