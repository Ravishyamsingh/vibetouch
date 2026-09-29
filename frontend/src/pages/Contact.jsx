import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, CheckCircle2 } from "lucide-react";
import { api } from "../lib/api.js";
import SectionHeading from "../components/SectionHeading.jsx";
import { stagger, fadeUp, viewportOnce } from "../lib/motion.js";

const initialForm = { name: "", email: "", phone: "", subject: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | done | error

  useEffect(() => {
    document.title = "Contact Us | Vibetouch";
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});
    try {
      await api.submitContact(form);
      setStatus("done");
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
      if (err.errors) setErrors(err.errors);
    }
  }

  return (
    <div className="container-x py-16">
      <SectionHeading eyebrow="Help & Solution" title="Get In Touch" />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={stagger}
        className="mt-12 grid gap-12 lg:grid-cols-5"
      >
        <div className="space-y-6 lg:col-span-2">
          <motion.a
            variants={fadeUp}
            whileHover={{ y: -4 }}
            href="tel:+919810711398"
            className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-deep-card p-6 shadow-card transition-shadow hover:border-lime/40 hover:shadow-lime"
          >
            <motion.span
              whileHover={{ rotate: [0, -12, 12, 0] }}
              transition={{ duration: 0.5 }}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-lime/10 text-lime"
            >
              <Phone className="h-5 w-5" />
            </motion.span>
            <div>
              <p className="text-sm text-cloud">Call us</p>
              <p className="font-bold text-ink">+91 98107 11398</p>
              <p className="text-sm text-cloud">Toll Free: 1800-309-7050</p>
            </div>
          </motion.a>
          <motion.a
            variants={fadeUp}
            whileHover={{ y: -4 }}
            href="mailto:info@vibetouch.in"
            className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-deep-card p-6 shadow-card transition-shadow hover:border-lime/40 hover:shadow-lime"
          >
            <motion.span
              whileHover={{ rotate: [0, -12, 12, 0] }}
              transition={{ duration: 0.5 }}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-lime/10 text-lime"
            >
              <Mail className="h-5 w-5" />
            </motion.span>
            <div>
              <p className="text-sm text-cloud">Email us</p>
              <p className="font-bold text-ink">info@vibetouch.in</p>
              <p className="text-sm text-cloud">care@vibetouch.in</p>
            </div>
          </motion.a>
        </div>

        <motion.form
          variants={fadeUp}
          onSubmit={handleSubmit}
          className="space-y-4 rounded-3xl border border-ink/10 bg-deep-card p-8 shadow-card-lg lg:col-span-3"
        >
          <AnimatePresence>
            {status === "done" && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 overflow-hidden rounded-xl border border-lime/30 bg-lime/10 p-4 text-sm text-lime"
              >
                <motion.span
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                </motion.span>
                Thanks — your enquiry has been received. We&rsquo;ll be in touch shortly.
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" error={errors.name}>
              <input
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="input"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone (optional)">
              <input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Subject (optional)">
              <input
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                className="input"
              />
            </Field>
          </div>

          <Field label="Message" error={errors.message}>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              className="input resize-none"
            />
          </Field>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={status === "submitting"}
            className="btn-lime w-full justify-center disabled:opacity-60"
          >
            {status === "submitting" ? "Sending…" : "Send Enquiry"}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink/80">{label}</span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1 block text-xs text-red-400"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}
