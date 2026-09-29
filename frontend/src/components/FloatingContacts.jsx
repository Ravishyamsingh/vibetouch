import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "919810711398";
const WHATSAPP_MESSAGE =
  "I came across your website, Vibetouch.in, and I'm interested in learning more about your products. Could you please share additional details?";

export default function FloatingContacts() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
      className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-3"
    >
      <motion.a
        variants={{ hidden: { opacity: 0, x: 30 }, show: { opacity: 1, x: 0 } }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.96 }}
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
        target="_blank"
        rel="noreferrer"
        className="relative flex items-center gap-2 rounded-full bg-[#16BE45] px-5 py-3 text-sm font-bold text-white
                   shadow-lg shadow-black/30"
      >
        <motion.span
          className="absolute inset-0 -z-10 rounded-full bg-[#16BE45]"
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <MessageCircle className="h-4 w-4" /> WhatsApp Us
      </motion.a>
      <motion.a
        variants={{ hidden: { opacity: 0, x: 30 }, show: { opacity: 1, x: 0 } }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.96 }}
        href="tel:+919810711398"
        className="flex items-center gap-2 rounded-full bg-lime px-5 py-3 text-sm font-bold text-white
                   shadow-lg shadow-black/30"
      >
        <Phone className="h-4 w-4" /> Call Now
      </motion.a>
    </motion.div>
  );
}
