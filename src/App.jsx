import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import HomePage from "./pages/HomePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ShopContainer from "./pages/ShopContainer";
import CheckoutPage from "./pages/CheckoutPage";
import BrandProductsPage from "./pages/BrandProductsPage";
import AllBrandsPage from "./pages/AllBrandsPage";
import CampaignProductsPage from "./pages/CampaignProductsPage";
import ShowcaseProductsPage from "./pages/ShowcaseProductsPage";
import ThankYouPage from "./pages/ThankYouPage";
import TrackOrderPage from "./pages/TrackOrderPage";
import DashboardPage from "./pages/DashboardPage";
import SectionProductsPage from "./pages/SectionProductsPage";
import OrderDetails from "./components/dashboard/OrderDetails";
import {
  getAllTopRankedProducts,
  getAllRecommendedProducts,
} from "./services/api";


const router = createBrowserRouter([
  // Dashboard has its own sidebar + header, so it sits outside AppLayout (site navbar/footer)
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  // Single order view also lives inside the dashboard shell (sidebar + header)
  {
    path: "/order-details/:id",
    element: (
      <DashboardPage highlightTab="orders">
        <OrderDetails />
      </DashboardPage>
    ),
  },
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
        path: "/brands",
        element: <AllBrandsPage />
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
        element: (
          <SectionProductsPage
            title="TOP RANKING PRODUCTS"
            fetchProducts={getAllTopRankedProducts}
          />
        )
      },

      {
        path: "/recommended-products",
        element: (
          <SectionProductsPage
            title="RECOMMENDED PRODUCTS"
            fetchProducts={getAllRecommendedProducts}
          />
        )
      },

      {
        path: "/checkout",
        element: <CheckoutPage />
      },

      {
        path: "/thank-you",
        element: <ThankYouPage />
      },

      {
        path: "/track-order",
        element: <TrackOrderPage />
      }

    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
