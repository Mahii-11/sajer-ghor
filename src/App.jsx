import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import HomePage from "./pages/HomePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ShopContainer from "./pages/ShopContainer";
import CheckoutPage from "./pages/CheckoutPage";
import BrandProductsPage from "./pages/BrandProductsPage";
import CampaignProductsPage from "./pages/CampaignProductsPage";
import ShowcaseProductsPage from "./pages/ShowcaseProductsPage";
import SectionProductsPage from "./pages/SectionProductsPage";
import { getAllTopRankedProducts, getAllRecommendedProducts } from "./services/api";


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
        path: "/product-details/:slug",
        element: <ProductDetailsPage />
      },

      {
        path: "/shop",
        element: <ShopContainer />
      },

      {
        path: "/brand/:slug",
        element: <BrandProductsPage />
      },

      {
        path: "/campaign/:slug",
        element: <CampaignProductsPage />
      },

      {
        path: "/showcase/:slug",
        element: <ShowcaseProductsPage />
      },

      {
        path: "/top-ranking-products",
        element: <SectionProductsPage title="TOP RANKING PRODUCTS" fetchProducts={getAllTopRankedProducts} />
      },

      {
        path: "/recommended-products",
        element: <SectionProductsPage title="RECOMMENDED PRODUCTS" fetchProducts={getAllRecommendedProducts} />
      },

      {
        path: "/checkout",
        element: <CheckoutPage />
      }

     
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
