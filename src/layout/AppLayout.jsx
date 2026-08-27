import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from './Footer';


export default function AppLayout() {


  return (
    <div>
      <Navbar/>
      <main className="pb-20 lg:pb-0">
        <Outlet  /> 
      </main>
      <Footer/>
    </div>
  )
}