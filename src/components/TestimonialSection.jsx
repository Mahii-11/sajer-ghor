import SectionTitle from "./SectionTitle";
import ReviewCard from '../components/ReviewCard';
import { reviews } from '../data/reviews';


export default function TestimonialSection() {
  return (
      <div>
           <section id="testimonial-section" className="space-y-8">
              <SectionTitle title="TESTIMONIALS" subtitle="#BeautyLovesShajerghor" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </section>
      
    </div>
  )
}
