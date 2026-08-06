import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/home/HomePage";
import ItineraryPage from "./pages/itinerary/ItineraryPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/itinerary"
        element={<ItineraryPage />}
      />
    </Routes>
  );
}

export default App;