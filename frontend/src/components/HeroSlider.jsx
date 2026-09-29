import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  { image: "/banners/banner-1.png", alt: "VibeTouch premium Smart TV range" },
  { image: "/banners/banner-2.png", alt: "VibeTouch IPC55 interactive panel" },
  { image: "/banners/banner-3.png", alt: "VibeTouch Smart TV entertainment" },
];

const placeholderBackgrounds = {
  one: "radial-gradient(circle at 74% 28%, rgba(105, 183, 255, .72), transparent 30%), linear-gradient(115deg, #e7f2ff 0%, #badcff 48%, #438bd1 100%)",
  two: "radial-gradient(circle at 28% 30%, rgba(255,255,255,.8), transparent 28%), linear-gradient(115deg, #eff5ff 0%, #cad7ed 44%, #7994c1 100%)",
  three: "radial-gradient(circle at 78% 72%, rgba(255,255,255,.62), transparent 26%), linear-gradient(115deg, #e8f8f8 0%, #a8d6dc 45%, #2e768b 100%)",
  four: "radial-gradient(circle at 26% 70%, rgba(255,255,255,.7), transparent 28%), linear-gradient(115deg, #eef0ff 0%, #ccc7f0 45%, #7064bb 100%)",
};

function PremiumBanner() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#071a35]" aria-label="Vibetouch premium television banner">
      <div className="absolute -left-[10%] top-[-35%] h-[110%] w-[70%] rounded-full bg-[#1565c0]/30 blur-[100px]" />
      <div className="absolute right-[-12%] top-[-18%] h-[90%] w-[54%] rounded-full bg-[#42a5f5]/25 blur-[90px]" />
      <div className="absolute bottom-[-38%] left-[8%] h-[72%] w-[66%] rounded-full bg-[#00bcd4]/15 blur-[80px]" />
      <div className="absolute inset-0 bg-[linear-gradient(116deg,rgba(255,255,255,.12),transparent_28%,transparent_70%,rgba(255,255,255,.08))]" />

      <div className="absolute left-[9%] top-[18%] h-[56%] w-[28%] rounded-[40%] border border-white/10 bg-white/[0.03] blur-[1px]" />
      <div className="absolute bottom-[15%] left-[12%] h-px w-[48%] bg-gradient-to-r from-transparent via-white/35 to-transparent" />

      <div className="absolute right-[9%] top-[14%] h-[62%] w-[55%] max-w-[820px] [perspective:1600px] sm:right-[12%] sm:top-[13%] sm:h-[68%] sm:w-[56%]">
        <div className="relative h-full w-full rotate-[-3deg] rounded-[18px] border border-white/30 bg-[#0b1424] p-[clamp(6px,1vw,16px)] shadow-[0_40px_90px_rgba(0,0,0,.5),0_0_80px_rgba(66,165,245,.25)]">
          <div className="relative h-full w-full overflow-hidden rounded-[10px] bg-[radial-gradient(circle_at_72%_30%,rgba(126,225,255,.85),transparent_20%),radial-gradient(circle_at_30%_68%,rgba(104,75,255,.7),transparent_32%),linear-gradient(135deg,#152d63_0%,#0d748f_50%,#102044_100%)]">
            <div className="absolute -right-[16%] top-[-24%] h-[95%] w-[70%] rotate-[24deg] rounded-[48%] bg-white/20 blur-[2px]" />
            <div className="absolute bottom-[-30%] left-[-8%] h-[68%] w-[72%] rounded-full bg-[#ff7f50]/30 blur-[20px]" />
            <div className="absolute inset-0 bg-[linear-gradient(105deg,transparent_22%,rgba(255,255,255,.23)_48%,transparent_53%)]" />
          </div>
          <div className="absolute bottom-[-12%] left-1/2 h-[16%] w-[8%] -translate-x-1/2 rounded-b-xl bg-[#0b1424] shadow-xl" />
          <div className="absolute bottom-[-15%] left-1/2 h-[3%] w-[28%] -translate-x-1/2 rounded-full bg-black/65 blur-[1px]" />
        </div>
      </div>

      <div className="absolute bottom-[13%] left-[18%] h-[14%] w-[5%] rotate-[18deg] rounded-[45%] bg-white/20 blur-[1px]" />
      <div className="absolute right-[5%] top-[20%] h-2 w-2 rounded-full bg-white/70 shadow-[0_0_22px_8px_rgba(255,255,255,.35)]" />
      <div className="absolute left-[48%] top-[16%] h-1.5 w-1.5 rounded-full bg-cyan-200/80 shadow-[0_0_18px_6px_rgba(103,232,249,.5)]" />
    </div>
  );
}

function BannerMedia({ slide }) {
  if (slide.image) {
    return <img src={slide.image} alt={slide.alt} className="block h-auto w-full" />;
  }

  if (slide.premium) return <PremiumBanner />;

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: placeholderBackgrounds[slide.tone] }} aria-label={slide.alt}>
      <div className="absolute -right-[10%] top-[14%] h-[62%] w-[48%] rounded-[38%] border border-white/35 bg-white/10 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-[2px]" />
      <div className="absolute -left-[10%] bottom-[-28%] h-[68%] w-[64%] rounded-[50%] border border-white/25 bg-white/10" />
      <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(255,255,255,.16),transparent_32%,rgba(255,255,255,.1)_68%,transparent)]" />
    </div>
  );
}

export default function HeroSlider() {
  return (
    <section className="relative overflow-hidden bg-slate-200" aria-label="Featured banners">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoHeight
        autoplay={{ delay: 5200, disableOnInteraction: false, pauseOnMouseEnter: true }}
        navigation={{ prevEl: ".hero-prev", nextEl: ".hero-next" }}
        pagination={{ clickable: true, el: ".hero-dots" }}
        loop
        className="hero-banner w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.alt}>
            <motion.div
              initial={{ scale: 1.035 }}
              animate={{ scale: 1 }}
              transition={{ duration: 5.2, ease: "linear" }}
              className="relative w-full"
            >
              <BannerMedia slide={slide} />
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between px-5 pb-5 sm:px-10 sm:pb-8">
        <div className="hero-dots pointer-events-auto flex gap-2 [&_.swiper-pagination-bullet]:h-1 [&_.swiper-pagination-bullet]:w-8 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:bg-slate-900/25 [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet]:duration-300 [&_.swiper-pagination-bullet-active]:w-14 [&_.swiper-pagination-bullet-active]:bg-slate-900/80" />
        <div className="pointer-events-auto flex gap-2">
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }} aria-label="Previous banner" className="hero-prev grid h-10 w-10 place-items-center rounded-full border border-slate-900/20 bg-white/45 text-slate-900 backdrop-blur-md transition-colors hover:bg-white">
            <ChevronLeft className="h-4 w-4" />
          </motion.button>
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }} aria-label="Next banner" className="hero-next grid h-10 w-10 place-items-center rounded-full border border-slate-900/20 bg-white/45 text-slate-900 backdrop-blur-md transition-colors hover:bg-white">
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
