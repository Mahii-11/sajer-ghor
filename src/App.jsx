import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import HomePage from "./pages/HomePage";


const router = createBrowserRouter([
  {
    path: "/", 
    element: <AppLayout />,
    children: [
      {
        path: "/", 
        element: <HomePage />,
      },

     
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
