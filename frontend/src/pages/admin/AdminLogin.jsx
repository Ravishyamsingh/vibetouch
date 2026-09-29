import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import AdminBackButton from "../../components/AdminBackButton.jsx";

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin/products", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-deep px-6">
      <div className="w-full max-w-sm">
        <AdminBackButton fallbackTo="/" label="Back to website" />
        <form onSubmit={handleSubmit} className="mt-4 w-full rounded-3xl border border-ink/10 bg-deep-card p-8 shadow-card-lg">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-lime/10 text-lime">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-center text-xl font-bold text-ink">Admin Login</h1>
        <p className="mt-1 text-center text-sm text-cloud">Vibetouch dashboard access</p>

        {error && (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink/80">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              autoFocus
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink/80">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </label>
        </div>

        <button type="submit" disabled={loading} className="btn-lime mt-6 w-full justify-center disabled:opacity-60">
          {loading ? "Signing in…" : "Sign In"}
        </button>
        </form>
      </div>
    </div>
  );
}
