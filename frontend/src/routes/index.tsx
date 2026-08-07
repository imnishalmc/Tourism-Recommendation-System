import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "@/pages/home/HomePage";
import DestinationListPage from "@/pages/destination/DestinationListPage";
import DestinationDetailPage from "@/pages/destination/DestinationDetailPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import RecommendationPage from "@/pages/recommendation/RecommendationPage";
import ItineraryPage from "@/pages/itinerary/ItineraryPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/destination" element={<DestinationListPage />} />
        <Route path="/destination/:id" element={<DestinationDetailPage />} />
        <Route path="/recommendations" element={<RecommendationPage />} />
        <Route path="/itinerary" element={<ItineraryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;