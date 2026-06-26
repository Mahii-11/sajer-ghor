import BestDeal from "../components/BestDeal";
import ForHerHim from "../components/ForHerHim";
import Founders from "../components/Founders";
import HeroBanner from "../components/HeroBanner";
import Navbar from "../components/Navbar";
import RecommendedProducts from "../components/RecommendedProducts";
import TestimonialSection from "../components/TestimonialSection";
import TopBrand from "../components/TopBrand";
import TopRankProduct from "../components/TopRankProduct";
import TrendingCategories from "../components/TrendingCategories";
import Footer from '../components/Footer';

export default function HomePage() {
  return (
      <div>
      <Navbar />
       <section id="hero-banner-section" className="w-full -mb-16">
         <HeroBanner />
      </section>
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-8">

        <BestDeal />
        <TopBrand />
        <ForHerHim />
        <TopRankProduct />
        <RecommendedProducts />
        <Founders />
        <TrendingCategories />
        <TestimonialSection />
         <Footer />
        

      </main>
      
    </div>
  )
}
