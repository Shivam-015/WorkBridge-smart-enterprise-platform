import { useState, useRef, useEffect } from "react";

const API_BASE = import.meta.env.VITE_CHATBOT_URL || "http://localhost:8001";

// Get current user role from localStorage/auth (adjust to match your auth setup)
function getUserRole() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.role || "employee";
  } catch {
    return "employee";
  }
}

export default function ChatbotBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "👋 Hi! I'm WorkBridge Assistant. Ask me anything about the platform — features, roles, pages, or how things work!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async () => {
    const question = input.trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chatbot/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, user_role: getUserRole() }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [...prev, { role: "bot", text: data.answer }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: data.error || "Something went wrong. Please try again." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "❌ Could not connect to AI service. Make sure the chatbot server is running." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* ── Chat Window ─────────────────────────────────────── */}
      {open && (
        <div style={styles.window}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <div style={styles.headerAvatar}>W</div>
              <div>
                <div style={styles.headerTitle}>WorkBridge Assistant</div>
                <div style={styles.headerSub}>Powered by local AI · Always up to date</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={styles.closeBtn}>✕</button>
          </div>

          {/* Messages */}
          <div style={styles.messages}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.bubble,
                  ...(msg.role === "user" ? styles.userBubble : styles.botBubble),
                }}
              >
                <span style={{ whiteSpace: "pre-wrap" }}>
  {msg.text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .split("\n")
    .map((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
        return (
          <span key={i} style={{ display: "flex", gap: 6, marginTop: 4 }}>
            <span style={{ color: "#4f46e5", fontWeight: 800, flexShrink: 0 }}>•</span>
            <span>{trimmed.slice(2)}</span>
          </span>
        );
      }
      if (trimmed === "") return <br key={i} />;
      return <span key={i} style={{ display: "block", marginTop: i === 0 ? 0 : 6 }}>{trimmed}</span>;
    })}
</span>
              </div>
            ))}

            {loading && (
              <div style={{ ...styles.bubble, ...styles.botBubble, opacity: 0.6 }}>
                <span style={styles.typing}>●●●</span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={styles.inputRow}>
            <input
              style={styles.input}
              placeholder="Ask about WorkBridge..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              style={{
                ...styles.sendBtn,
                opacity: loading || !input.trim() ? 0.5 : 1,
              }}
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* ── Floating Circle Button ───────────────────────────── */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={styles.fab}
        title="WorkBridge Assistant"
      >
        {open ? "✕" : "💬"}
      </button>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  fab: {
    position: "fixed",
    bottom: "28px",
    right: "28px",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    backgroundColor: "#4f46e5",
    color: "#fff",
    fontSize: "22px",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 16px rgba(79,70,229,0.45)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s",
  },
  window: {
    position: "fixed",
    bottom: "96px",
    right: "28px",
    width: "360px",
    height: "500px",
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
    display: "flex",
    flexDirection: "column",
    zIndex: 9998,
    overflow: "hidden",
    fontFamily: "system-ui, sans-serif",
  },
  header: {
    backgroundColor: "#4f46e5",
    padding: "14px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  headerAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#818cf8",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "16px",
  },
  headerTitle: {
    color: "#fff",
    fontWeight: "600",
    fontSize: "14px",
  },
  headerSub: {
    color: "#c7d2fe",
    fontSize: "11px",
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    backgroundColor: "#f8fafc",
  },
  bubble: {
    maxWidth: "85%",
    padding: "10px 14px",
    borderRadius: "12px",
    fontSize: "13.5px",
    lineHeight: "1.5",
    wordBreak: "break-word",
  },
  botBubble: {
    backgroundColor: "#fff",
    color: "#1e293b",
    alignSelf: "flex-start",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    borderBottomLeftRadius: "4px",
  },
  userBubble: {
    backgroundColor: "#4f46e5",
    color: "#fff",
    alignSelf: "flex-end",
    borderBottomRightRadius: "4px",
  },
  typing: {
    letterSpacing: "3px",
    animation: "pulse 1s infinite",
  },
  inputRow: {
    display: "flex",
    padding: "12px",
    gap: "8px",
    borderTop: "1px solid #e2e8f0",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    padding: "9px 14px",
    borderRadius: "24px",
    border: "1px solid #e2e8f0",
    fontSize: "13.5px",
    outline: "none",
    backgroundColor: "#f8fafc",
  },
  sendBtn: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
