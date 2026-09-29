import { useEffect, useMemo, useState } from "react";
import { Search, ClipboardList, ShoppingCart } from "lucide-react";
import { api } from "../../lib/api.js";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .adminGetBookings()
      .then((data) => {
        setBookings(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return bookings;
    return bookings.filter((booking) => [booking.name, booking.phone, booking.email, booking.product_name, booking.model_number, booking.address]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query));
  }, [bookings, search]);

  const totalQuantity = bookings.reduce((total, booking) => total + Number(booking.quantity || 0), 0);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-lime">Customer pipeline</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">Bookings &amp; Enquiries</h1>
          <p className="mt-1 text-sm text-cloud">Review requests captured by the website chatbot.</p>
        </div>
        <div className="flex gap-3">
          <Metric label="Enquiries" value={bookings.length} icon={ClipboardList} />
          <Metric label="Units requested" value={totalQuantity} icon={ShoppingCart} />
        </div>
      </div>

      {status === "loading" && <p className="text-cloud">Loading…</p>}
      {status === "error" && <p className="text-red-700">Couldn&rsquo;t load bookings.</p>}
      {status === "ready" && bookings.length > 0 && (
        <label className="relative mb-5 block max-w-xl">
          <span className="sr-only">Search bookings</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cloud" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, phone, email, product..." className="input !rounded-full !pl-10" />
        </label>
      )}

      {status === "ready" && bookings.length === 0 && (
        <p className="text-cloud">No bookings yet — they&rsquo;ll show up here once the chatbot collects one.</p>
      )}

      {status === "ready" && bookings.length > 0 && filteredBookings.length === 0 && (
        <p className="rounded-2xl border border-dashed border-ink/15 bg-deep-card p-8 text-center text-cloud">No bookings match your search.</p>
      )}

      {status === "ready" && filteredBookings.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-ink/10 shadow-card">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-deep-card text-left text-xs uppercase tracking-wide text-cloud">
              <tr>
                <th className="p-4">When</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Product</th>
                <th className="p-4">Qty</th>
                <th className="p-4">Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b.id} className="border-t border-ink/5 align-top">
                  <td className="p-4 whitespace-nowrap text-cloud">{new Date(b.created_at).toLocaleString()}</td>
                  <td className="p-4 font-semibold text-ink">{b.name}</td>
                  <td className="p-4 text-cloud">
                    <div>{b.phone}</div>
                    {b.email && <div className="text-cloud/70">{b.email}</div>}
                  </td>
                  <td className="p-4 text-cloud">
                    {b.product_name || "—"}
                    {b.model_number && <div className="text-xs text-cloud/70">{b.model_number}</div>}
                  </td>
                  <td className="p-4 text-cloud">{b.quantity}</td>
                  <td className="p-4 max-w-xs text-cloud">{b.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, icon: Icon }) {
  return <div className="hidden items-center gap-2 rounded-2xl border border-ink/10 bg-deep-card px-3 py-2 shadow-card sm:flex"><span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-50 text-[#1565c0]"><Icon className="h-4 w-4" /></span><div><p className="text-sm font-extrabold text-ink">{value}</p><p className="text-[10px] text-cloud">{label}</p></div></div>;
}
