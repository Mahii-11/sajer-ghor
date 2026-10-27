import ForHerHim from "../components/ForHerHim";
import Founders from "../components/Founders";
import HeroBanner from "../components/HeroBanner";
import RecommendedProducts from "../components/RecommendedProducts";
import TopRankProduct from "../components/TopRankProduct";
import TrendingCategories from "../components/TrendingCategories";
import DealsSection from "../components/DealsSection";
import TopBrandsSection from "../components/TopBrandsSection";
import BeautyLoversSection from "../components/BeautyLoversSection";
import TopBrands from "../components/TopBrands";

export default function HomePage() {
  return (
      <div>
       <section id="hero-banner-section" className="w-full">
         <HeroBanner />
      </section>
      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-10 md:space-y-12">

        <DealsSection />
        <TopBrandsSection/>
        <div>
          <ForHerHim />
        </div>
        <TopRankProduct />
        <RecommendedProducts />
        <TopBrands />
        <TrendingCategories />
        <BeautyLoversSection />
      </main>
      
    </div>
  )
}