import React from "react"
import { BrowserRouter as Router, Routes, Route  } from "react-router-dom"
import HostelList from "./components/homePage/HostelList"
import Login from './components/Auth/login'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import Navbar from './components/navbar/navbar'  // Corrected path
import SidebarMenu from './components/sidebar/sidebarMenu'
import HostelHeader from "./components/header"

const App=()=>{
  return(
    <Router>
      <div>
      <HostelHeader/>
        
        <Routes>
          <Route path="/" element={<HostelList/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/about" element={<AboutUs/>}/>
          <Route path="/contact" element={<ContactUs/>}/>
          <Route path="/hostels" element={<HostelList/>}/>
        </Routes>
      </div>
    </Router>
  )
}
export default App