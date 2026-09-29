# Vibetouch

Vibetouch is a product catalogue and enquiry website for Smart TVs,
interactive panels, and related display products.

## Main features

- Responsive React storefront with banners, product cards, filters, search,
  product galleries, comparisons, and product detail pages.
- Node.js and Express API backed by PostgreSQL.
- Admin dashboard for managing products, specifications, prices, stock,
  categories, product images, bookings, and chatbot conversations.
- Product chatbot that answers from database information and supports an
  enquiry and booking flow.
- JWT and httpOnly-cookie authentication for admin routes.

## Technology

- Frontend: React, Vite, Tailwind CSS, React Router, Framer Motion, and Swiper
- Backend: Node.js, Express, PostgreSQL, `pg`, `bcryptjs`, `jsonwebtoken`, and
  `multer`
- Database: PostgreSQL

## Project structure

```text
backend/   Express API, database schema, migrations, admin routes, uploads
frontend/  React storefront and admin dashboard
```

## Important notes

- Product data is stored in PostgreSQL.
- Product image records are stored in PostgreSQL, while local uploads are
  served by the backend from `backend/uploads/`.
- Local environment files and runtime uploads are excluded from Git.
- For production, uploaded images should use persistent storage such as
  Cloudinary, Amazon S3, or a properly configured persistent disk.
- Replace placeholder product information and images before launch.
