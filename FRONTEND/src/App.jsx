import React from "react"
import { BrowserRouter as Router, Routes, Route  } from "react-router-dom"
import HostelList from "./components/HostelList"
import Login from '../src/components/Auth/login'

const App=()=>{
  return(
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HostelList/>}/>
          <Route path="/login" element={<Login/>}/>
        </Routes>
    </div>
    </Router>
    
  )
}
export default App