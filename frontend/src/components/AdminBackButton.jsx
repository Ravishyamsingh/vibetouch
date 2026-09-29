import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AdminBackButton({ fallbackTo = "/", label = "Back", onClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  function handleBack() {
    if (onClick) {
      onClick();
      return;
    }

    const historyIndex = window.history.state?.idx;
    const canGoBackInApp =
      typeof historyIndex === "number"
        ? historyIndex > 0
        : document.referrer.startsWith(window.location.origin);

    if (canGoBackInApp && location.pathname.startsWith("/admin")) {
      navigate(-1);
    } else {
      navigate(fallbackTo, { replace: true });
    }
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-deep-card px-4 py-2 text-sm font-semibold text-cloud shadow-card transition-colors hover:border-lime/40 hover:text-lime"
    >
      <ArrowLeft className="h-4 w-4" /> {label}
    </button>
  );
}
