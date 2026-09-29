import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, X, Send } from "lucide-react";
import { api } from "../lib/api.js";

export default function ChatWidget() {
  const location = useLocation();
  const productSlug = location.pathname.match(/^\/product\/([^/]+)/)?.[1] || null;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [sessionToken, setSessionToken] = useState(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [greeted, setGreeted] = useState(false);
  const scrollRef = useRef(null);

  // Fresh conversation whenever the visitor switches products.
  useEffect(() => {
    setMessages([]);
    setSessionToken(null);
    setGreeted(false);
  }, [productSlug]);

  useEffect(() => {
    if (!open || greeted) return;
    setGreeted(true);
    api
      .getChatGreeting(productSlug || "")
      .then(({ reply, suggestedQuestions }) => {
        setMessages([{ sender: "bot", content: reply }]);
        setSuggested(suggestedQuestions || []);
      })
      .catch(() => setMessages([{ sender: "bot", content: "Hi! I'm having trouble connecting right now — please try again shortly." }]));
  }, [open, greeted, productSlug]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setMessages((m) => [...m, { sender: "user", content: trimmed }]);
    setInput("");
    setSuggested([]);
    setSending(true);

    try {
      const data = await api.sendChatMessage({ sessionToken, productSlug: productSlug || "", message: trimmed });
      setSessionToken(data.sessionToken);
      setMessages((m) => [...m, { sender: "bot", content: data.reply }]);
      setSuggested(data.suggestedQuestions || []);
    } catch {
      setMessages((m) => [...m, { sender: "bot", content: "Something went wrong on our end — mind trying that again?" }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-lime text-white
                   shadow-lg shadow-black/40"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {/* Breathing glow ring while closed — invites the click without a
            constant motion once the visitor is actually mid-conversation. */}
        {!open && (
          <motion.span
            className="absolute inset-0 -z-10 rounded-full bg-lime"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "chat"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {open ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[92vw] max-w-sm flex-col overflow-hidden
                       rounded-3xl border border-ink/10 bg-deep-soft shadow-card-lg"
          >
            <div className="flex items-center gap-3 border-b border-ink/5 bg-deep-card px-5 py-4">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-lime text-white text-sm font-bold">V</span>
              <div>
                <p className="text-sm font-bold text-ink">Vibetouch Assistant</p>
                <p className="text-xs text-cloud">{productSlug ? "Ask about this product" : "Open from a product page for full details"}</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.sender === "user" ? "bg-lime text-white" : "bg-ink/5 text-ink"
                    }`}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl bg-ink/5 px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-ink/40"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {suggested.length > 0 && (
              <div className="flex flex-wrap gap-2 border-t border-ink/5 px-4 py-3">
                {suggested.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="rounded-full border border-ink/15 px-3 py-1.5 text-xs text-cloud hover:border-lime hover:text-lime"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex items-center gap-2 border-t border-ink/5 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 rounded-full border border-ink/10 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-cloud focus:border-lime"
              />
              <button
                type="submit"
                disabled={sending}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lime text-white disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
