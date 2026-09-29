import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

import { CompareProvider } from "./context/CompareContext.jsx";
import { AdminAuthProvider } from "./context/AdminAuthContext.jsx";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import FloatingContacts from "./components/FloatingContacts.jsx";
import ChatWidget from "./components/ChatWidget.jsx";
import CompareBar from "./components/CompareBar.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Contact from "./pages/Contact.jsx";
import Compare from "./pages/Compare.jsx";

import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminBookings from "./pages/admin/AdminBookings.jsx";
import AdminConversations from "./pages/admin/AdminConversations.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Public storefront chrome: nav, footer, floating chat/contact widgets, and
// the compare-selection bar. Admin routes deliberately don't use this.
function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingContacts />
      <ChatWidget />
      <CompareBar />
    </div>
  );
}

export default function App() {
  return (
    <CompareProvider>
      <AdminAuthProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products/:categorySlug" element={<CategoryPage />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminProducts />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="conversations" element={<AdminConversations />} />
          </Route>
        </Routes>
      </AdminAuthProvider>
    </CompareProvider>
  );
}

function NotFound() {
  return (
    <div className="container-x py-32 text-center">
      <h1 className="text-3xl font-bold text-ink">Page not found</h1>
      <p className="mt-3 text-cloud">The page you&rsquo;re looking for doesn&rsquo;t exist.</p>
    </div>
  );
}
