import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackButton({ fallbackTo = "/", label = "Back" }) {
  const navigate = useNavigate();

  function handleBack() {
    const historyIndex = window.history.state?.idx;
    const canGoBackInApp = typeof historyIndex === "number" ? historyIndex > 0 : document.referrer.startsWith(window.location.origin);
    if (canGoBackInApp) {
      navigate(-1);
    } else {
      // A direct/new-tab product has no in-app history. Replace the entry so
      // clicking Back again cannot loop back into the product route.
      navigate(fallbackTo, { replace: true });
    }
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-cloud transition-colors hover:text-lime"
    >
      <ArrowLeft className="h-4 w-4" /> {label}
    </button>
  );
}
