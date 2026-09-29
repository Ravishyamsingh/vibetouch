import jwt from "jsonwebtoken";

const COOKIE_NAME = "vibetouch_admin_token";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export function signAdminToken(admin) {
  return jwt.sign({ sub: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: "7d" });
}

export function setAdminCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearAdminCookie(res) {
  res.clearCookie(COOKIE_NAME);
}

// Protects /api/admin/* routes. Requires a valid JWT in the httpOnly cookie
// set at login — never trusts a header/body claiming to be an admin.
export function requireAdmin(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ error: "Not authenticated." });
  }
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Session expired, please log in again." });
  }
}

export { COOKIE_NAME };
