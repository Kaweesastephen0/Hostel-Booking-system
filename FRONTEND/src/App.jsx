import React from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import HostelList from "./components/homePage/HostelList"
import Auth from "./components/Auth/AuthModal"
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import HostelHeader from "./components/header/HostelHeader.jsx";
import Booking from "./components/booking/Booking"
import MukBookFooter from "./components/footer/HostelFooter"
import RoomListingPage from "./components/roomList/RoomList"
import ExactRoom from "./components/roomList/ExactRoom"
import UserProfile from "./components/Auth/UserProfile"

const App = () => {
  const location = useLocation();

  const noHeaderNoFooter = location.pathname.includes("/login") || location.pathname.includes("/auth") || location.pathname.includes("/auth") || location.pathname.includes("/profile");

  return (
    <div>
      {!noHeaderNoFooter && <HostelHeader />}

      <Routes>
        <Route path="/" element={<HostelList />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/hostels" element={<HostelList />} />
        <Route path="/rooms/:hostelId" element={<RoomListingPage />} />
        <Route path="/room/:roomId" element={<ExactRoom />} />
        <Route path='/booking' element={<Booking/>}/>
        
      </Routes>

      {!noHeaderNoFooter && <MukBookFooter />}
    </div>
  )
}

export default App