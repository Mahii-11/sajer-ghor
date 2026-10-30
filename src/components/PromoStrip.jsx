import { Link } from "react-router-dom";

// ratio = image width / height, used so every card gets the same height with no cropping
const promos = [
  {
    id: "feedback",
    ratio: 1916 / 821,
    image: "/images/Customer Feedback Banner.png",
    alt: "Customer Feedback & Suggestion",
    to: "#",
  },
  {
    id: "vendor",
    ratio: 1919 / 820,
    image: "/images/Grow Together Vendor Onboarding.png",
    alt: "Vendor Onboarding",
    to: "#",
  },
  {
    id: "skincare-app",
    ratio: 2170 / 725,
    image: "/images/AI Skincare App Beauty Banner.png",
    alt: "Beauty Measure & Skincare Suggestion",
    to: "/shop",
  },
  {
    id: "burka",
    ratio: 2170 / 725,
    image: "/images/Elegant Burka Collection Banner.png",
    alt: "Burka Collection",
    to: "/shop",
  },
];

export default function PromoStrip() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 py-3 flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap gap-3">
        {promos.map((promo) => (
          <Link
            key={promo.id}
            to={promo.to}
            style={{ flexGrow: promo.ratio }}
            className="block basis-full sm:basis-[calc(50%-0.375rem)] lg:basis-0 min-w-0 overflow-hidden rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
          >
            <img
              src={promo.image}
              alt={promo.alt}
              loading="lazy"
              className="w-full h-auto block"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
