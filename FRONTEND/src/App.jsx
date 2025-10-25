
import React from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import HostelList from "./components/homePage/HostelList"
import Auth from "./components/Auth/AuthModal"
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import HostelHeader from "./components/header"
import MukBookFooter from "./components/footer/HostelFooter"
import RoomListingPage from "./components/roomList/RoomList"
import ExactRoom from "./components/roomList/ExactRoom"

const App = () => {
  const location = useLocation();

  const noHeaderNoFooter = location.pathname.includes("/login") || location.pathname.includes("/auth");
  
  return (
    <div>
      {!noHeaderNoFooter && <HostelHeader />}
      
      <Routes>
        <Route path="/" element={<HostelList />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/hostels" element={<HostelList />} />
        <Route path="/RoomListingPage" element={<RoomListingPage />} />
        <Route path="/ExactRoom" element={<ExactRoom />} />
      </Routes>

      {!noHeaderNoFooter && <MukBookFooter />}
    </div>
  )
}

export default App
