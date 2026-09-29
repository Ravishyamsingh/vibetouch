import { Navigate, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Package, MessageSquare, ClipboardList, LogOut, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import AdminBackButton from "../../components/AdminBackButton.jsx";

const NAV = [
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/bookings", label: "Bookings", icon: ClipboardList },
  { to: "/admin/conversations", label: "Conversations", icon: MessageSquare },
];

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch(new URLSearchParams(location.search).get("search") || "");
  }, [location.search]);

  function handleSearch(event) {
    event.preventDefault();
    const value = search.trim();
    navigate(`/admin/products${value ? `?search=${encodeURIComponent(value)}` : ""}`);
  }

  if (admin === undefined) {
    return <div className="grid min-h-screen place-items-center bg-deep text-cloud">Checking session…</div>;
  }
  if (admin === null) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-deep">
      <aside className="hidden w-64 shrink-0 border-r border-ink/5 bg-deep-soft p-6 sm:block">
        <div className="mb-8 flex items-center gap-2 text-lg font-extrabold text-ink">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-lime text-white">V</span>
          Admin
        </div>
        <nav className="space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  isActive ? "bg-lime/10 text-lime" : "text-cloud hover:bg-ink/5"
                }`
              }
            >
              <Icon className="h-4 w-4" /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-8 border-t border-ink/5 pt-4">
          <p className="mb-3 truncate text-xs text-cloud">{admin.email}</p>
          <button onClick={logout} className="flex items-center gap-2 text-sm font-semibold text-cloud hover:text-lime">
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden p-6 sm:p-10">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <AdminBackButton fallbackTo="/" label="Back to website" />
          <form onSubmit={handleSearch} className="relative min-w-[220px] flex-1 sm:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cloud" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products or model numbers..."
              className="input !rounded-full !py-2.5 !pl-10"
              aria-label="Search products in admin panel"
            />
          </form>
          <nav className="flex gap-1 overflow-x-auto sm:hidden">
            {NAV.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 text-xs font-semibold ${isActive ? "bg-lime/10 text-lime" : "text-cloud"}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
