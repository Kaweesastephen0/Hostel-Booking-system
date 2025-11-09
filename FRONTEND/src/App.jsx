import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage.jsx";
import Aboutus from "./pages/aboutus.jsx";
import Contactus from "./pages/contactus.jsx";
import SearchResultsPage from "./pages/SearchResultPage.jsx";
import RoomListingPage from "./pages/roomListings/RoomList.jsx";
import RoomDetails from "./pages/RoomDetails/RoomDetails.jsx";

// Components
import Auth from "./components/Auth/AuthModal";
import Header from "./components/layout/header/Header.jsx";
import Footer from "./components/layout/footer/Footer.jsx";
import Booking from "./components/booking/Booking";
import UserProfile from "./components/Auth/UserProfile";

const App = () => {
  const location = useLocation();

  const noHeaderNoFooter =
    location.pathname.includes("/login") ||
    location.pathname.includes("/auth") ||
    location.pathname.includes("/profile");

  return (
    <div>
      {!noHeaderNoFooter && <Header />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/about" element={<Aboutus />} />
        <Route path="/contact" element={<Contactus />} />
        <Route path="/search-results" element={<SearchResultsPage />} />
        <Route path="/rooms/:hostelId" element={<RoomListingPage />} />
        <Route path="/room/:roomId" element={<RoomDetails />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>

      {!noHeaderNoFooter && <Footer />}
    </div>
  );
};

export default App;
