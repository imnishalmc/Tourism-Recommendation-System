import { Routes, Route } from "react-router-dom";

import HomePage from "@/pages/home/HomePage";

import DestinationListPage from "@/pages/destination/DestinationListPage";
import DestinationDetailPage from "@/pages/destination/DestinationDetailPage";

import ItineraryPage from "@/pages/itinerary/ItineraryPage";

import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

import ProfilePage from "@/pages/profile/ProfilePage";
import ChangePassword from "@/pages/profile/ChangePassword";

import DashboardPage from "@/pages/admin/DashboardPage";
import UserManagementPage from "@/pages/admin/UserManagementPage";
import DestinationManagementPage from "@/pages/admin/DestinationManagementPage";
import ReviewManagementPage from "@/pages/admin/ReviewManagementPage";
import AdminLayout from "@/layouts/AdminLayout";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminRoute from "@/components/auth/AdminRoute";

function App() {
  return (
    <Routes>

      {/*  PUBLIC ROUTES  */}

      <Route path="/" element={<HomePage />} />

      <Route
        path="/destination"
        element={<DestinationListPage />}
      />

      <Route
        path="/destination/:id"
        element={<DestinationDetailPage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      {/*  USER ROUTES */}

      <Route element={<ProtectedRoute />}>

        <Route
          path="/itinerary"
          element={<ItineraryPage />}
        />

        <Route
          path="/profile"
          element={<ProfilePage />}
        />

        <Route
          path="/profile/change-password"
          element={<ChangePassword />}
        />

      </Route>

      {/*  ADMIN ROUTES */}

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="destinations" element={<DestinationManagementPage />} />
          <Route path="reviews" element={<ReviewManagementPage />} />
        </Route>
      </Route>

    </Routes>
  );
}

export default App;
