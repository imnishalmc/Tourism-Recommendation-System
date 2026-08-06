import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/home/HomePage";
import ItineraryPage from "./pages/itinerary/ItineraryPage";
import DestinationListPage from "./pages/destination/DestinationListPage";
import DestinationDetailPage from "./pages/destination/DestinationDetailPage";
// import RecommendationPage from "@/pages/recommendation/RecommendationPage";
import LoginPage from "@/pages/auth/LoginPage";
// import RegisterPage from "@/pages/auth/RegisterPage";

// import ProfilePage from "@/pages/profile/ProfilePage";

// import DashboardPage from "@/pages/admin/DashboardPage";
// import RecommendationPage from "./pages/recommendation/RecommendationPage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
<Route path="/destination" element={<DestinationListPage />} />
      <Route path="/destination/:id" element={<DestinationDetailPage />} />
      <Route
        path="/itinerary"
        element={<ItineraryPage />}
      />
         {/* <Route
        path="/recommendations"
        element={<RecommendationPage />}
      /> */}
   <Route
        path="/login"
        element={<LoginPage />}
      />

      {/* <Route
        path="/register"
        element={<RegisterPage />}
      /> */}

      {/* <Route
        path="/profile"
        element={<ProfilePage />}
      /> */}
{/* 
      <Route
        path="/admin/dashboard"
        element={<DashboardPage />}
      /> */}
    </Routes>
  );
}

export default App;