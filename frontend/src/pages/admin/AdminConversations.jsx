import { useEffect, useMemo, useState } from "react";
import { MessageSquare, Search } from "lucide-react";
import { api } from "../../lib/api.js";
import AdminBackButton from "../../components/AdminBackButton.jsx";

export default function AdminConversations() {
  const [conversations, setConversations] = useState([]);
  const [status, setStatus] = useState("loading");
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .adminGetConversations()
      .then((data) => {
        setConversations(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return conversations;
    return conversations.filter((conversation) => [conversation.product_name, conversation.last_message]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query));
  }, [conversations, search]);

  if (openId) {
    return <ConversationDetail id={openId} onBack={() => setOpenId(null)} />;
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-lime">Customer conversations</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">Chatbot Conversations</h1>
          <p className="mt-1 text-sm text-cloud">Read visitor questions and follow up on product interest.</p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-ink/10 bg-deep-card px-3 py-2 shadow-card"><MessageSquare className="h-4 w-4 text-[#1565c0]" /><span className="text-sm font-extrabold text-ink">{conversations.length}</span><span className="text-xs text-cloud">total</span></div>
      </div>

      {status === "loading" && <p className="text-cloud">Loading…</p>}
      {status === "error" && <p className="text-red-700">Couldn&rsquo;t load conversations.</p>}
      {status === "ready" && conversations.length > 0 && (
        <label className="relative mb-5 block max-w-xl">
          <span className="sr-only">Search conversations</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cloud" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search product or message..." className="input !rounded-full !pl-10" />
        </label>
      )}

      {status === "ready" && conversations.length === 0 && (
        <p className="text-cloud">No conversations yet — they&rsquo;ll show up here once a visitor opens the chat widget.</p>
      )}

      {status === "ready" && conversations.length > 0 && filteredConversations.length === 0 && (
        <p className="rounded-2xl border border-dashed border-ink/15 bg-deep-card p-8 text-center text-cloud">No conversations match your search.</p>
      )}

      {status === "ready" && filteredConversations.length > 0 && (
        <div className="space-y-2">
          {filteredConversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setOpenId(c.id)}
              className="flex w-full items-center justify-between rounded-2xl border border-ink/10 bg-deep-card p-5 text-left shadow-card hover:border-lime/40"
            >
              <div className="min-w-0">
                <p className="font-semibold text-ink">{c.product_name || "No product context"}</p>
                <p className="mt-1 truncate text-sm text-cloud">{c.last_message}</p>
              </div>
              <div className="ml-4 shrink-0 text-right text-xs text-cloud">
                <p>{c.message_count} messages</p>
                <p>{new Date(c.created_at).toLocaleString()}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ConversationDetail({ id, onBack }) {
  const [conversation, setConversation] = useState(null);

  useEffect(() => {
    api.adminGetConversation(id).then(setConversation);
  }, [id]);

  return (
    <div>
      <AdminBackButton onClick={onBack} fallbackTo="/admin/conversations" label="Back to conversations" />

      {!conversation ? (
        <p className="text-cloud">Loading…</p>
      ) : (
        <div className="max-w-2xl">
          <h1 className="mb-1 text-xl font-bold text-ink">{conversation.product_name || "No product context"}</h1>
          <p className="mb-6 text-sm text-cloud">Started {new Date(conversation.created_at).toLocaleString()}</p>
          <div className="space-y-3 rounded-3xl border border-ink/10 bg-deep-card p-6 shadow-card">
            {conversation.messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.sender === "user" ? "bg-lime text-white" : "bg-ink/5 text-ink"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
