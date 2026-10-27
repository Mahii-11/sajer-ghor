import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from './Footer';
import CartDrawer from "../components/CartDrawer";
import FloatingCartButton from "../components/FloatingCartButton";
import CartToast from "../components/CartToast";


export default function AppLayout() {


  return (
    <div>
      <Navbar/>
      <main className="pb-20 lg:pb-0">
        <Outlet  /> 
      </main>
      <Footer />
      <CartDrawer />
      <FloatingCartButton />
      <CartToast />
    </div>
  )
}