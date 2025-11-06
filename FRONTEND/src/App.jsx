import React from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import HomePage from "./pages/HomePage.jsx"
import Auth from "./components/Auth/AuthModal"
// import AboutUs from './pages/AboutUs'
// import ContactUs from './pages/ContactUs'
import Header from "./components/layout/header/Header.jsx";
// import Booking from "./components/booking/Booking"
import SearchResultsPage from "./pages/SearchResultPage.jsx";
import Footer from "./components/layout/footer/Footer.jsx"
import RoomListingPage from "./pages/roomListings/RoomList.jsx"
import RoomDetails from "./pages/RoomDetails/RoomDetails.jsx"
import UserProfile from "./components/Auth/UserProfile"

const App = () => {
  const location = useLocation();

  const noHeaderNoFooter = location.pathname.includes("/login") || location.pathname.includes("/auth") || location.pathname.includes("/auth") || location.pathname.includes("/profile");

  return (
    <div>
      {!noHeaderNoFooter && <Header />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<UserProfile />} />
        {/* <Route path="/about" element={<AboutUs />} /> */}
        {/* <Route path="/contact" element={<ContactUs />} /> */}
                <Route path="/search-results" element={<SearchResultsPage />} />
       <Route path="/rooms/:hostelId" element={<RoomListingPage />} />
        <Route path="/room/:roomId" element={<RoomDetails />} />
        {/* <Route path='/booking' element={<Booking/>}/> */}
        
      </Routes>

      {!noHeaderNoFooter && <Footer />}
    </div>
  )
}

export default App