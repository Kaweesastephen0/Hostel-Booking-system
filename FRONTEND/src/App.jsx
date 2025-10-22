
import { Routes, Route, useLocation  } from "react-router-dom"
import HostelList from "./components/homePage/HostelList"
import Login from './components/Auth/login'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import HostelHeader from "./components/header"
import Booking from "./components/booking/Booking"

const App=()=>{
  const Location = useLocation();


  const NoHeaderNoFooter = Location.pathname.includes("/login");
  
  return(
    
      <div>
        {/* {!NoHeaderNoFooter && <HostelHeader/> } */}
      
        
        <Routes>
          <Route path="/" element={<HostelList/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/about" element={<AboutUs/>}/>
          <Route path="/contact" element={<ContactUs/>}/>
          <Route path="/hostels" element={<HostelList/>}/>
          <Route path="/booking" element={<Booking/>}/>
        </Routes>

    
      </div>

    
  )
}
export default App