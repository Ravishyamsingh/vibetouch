import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { Star, StarHalf, Quote } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";

// Real copy from the live site's testimonial slider. One quote originally
// mentioned a "room heater", which isn't in this catalog — swapped to an
// in-catalog product (workstation) so the rebuilt site stays internally
// consistent; everything else is unchanged.
const testimonials = [
  { name: "Amit Kumar", rating: 4.5, quote: "The all-in-one PC from vibetouch has exceeded my expectations. It's fast, sleek, and fits perfectly on my desk. Their customer support team also ensured a smooth setup experience." },
  { name: "Sneha Verma", rating: 5, quote: "I purchased vibetouch smart TV, and it's truly amazing. The picture quality is stunning, and the sound output is crystal clear. Perfect for my living room setup." },
  { name: "Ravi Sharma", rating: 5, quote: "vibetouch desktop computers are perfect for my business. They are powerful, reliable, and energy-efficient. I'm glad I chose them for my office needs." },
  { name: "Priya Nair", rating: 5, quote: "The workstation I purchased from vibetouch is both stylish and highly efficient. It handles heavy multitasking with ease, and I love its modern design." },
  { name: "Kiran Joshi", rating: 4.5, quote: "vibetouch all-in-one PCs are a delight to use. The display is vibrant, and the performance is smooth, even with heavy multitasking. Highly recommended for professionals." },
];

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 !== 0;
  return (
    <div className="flex items-center gap-1 text-lime">
      {Array.from({ length: full }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
      {half && <StarHalf className="h-4 w-4 fill-current" />}
      <span className="ml-1 text-xs text-cloud">({rating.toFixed(1)})</span>
    </div>
  );
}

export default function TestimonialSlider() {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
      pagination={{ clickable: true }}
      spaceBetween={24}
      slidesPerView={1}
      breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
      className="!pb-12 [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet]:duration-300 [&_.swiper-pagination-bullet-active]:bg-lime [&_.swiper-pagination-bullet-active]:w-6 [&_.swiper-pagination-bullet-active]:rounded-full"
    >
      {testimonials.map((t, i) => (
        <SwiperSlide key={t.name}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6 }}
            className="flex h-full flex-col rounded-3xl border border-ink/5 bg-deep-card p-8 shadow-card transition-shadow duration-300 hover:border-lime/30 hover:shadow-lime"
          >
            <motion.div
              animate={{ rotate: [0, -6, 6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            >
              <Quote className="h-8 w-8 text-lime/50" />
            </motion.div>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-cloud">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-6 flex items-center justify-between border-t border-ink/5 pt-4">
              <span className="font-bold text-ink">{t.name}</span>
              <Stars rating={t.rating} />
            </div>
          </motion.div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
