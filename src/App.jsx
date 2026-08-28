import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import HomePage from "./pages/HomePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";


const router = createBrowserRouter([
  {
    path: "/", 
    element: <AppLayout />,
    children: [
      {
        path: "/", 
        element: <HomePage />,
      },

      {
        path: "/product-details",
        element: <ProductDetailsPage />
      }

     
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
