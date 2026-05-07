import { useState, useEffect, useRef } from "react";

export default function NotificationBell({ users = [], projects = [], tasks = [] }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const notifs = [];

    // From tasks - all of them
    [...tasks].forEach((task) => {
      const status = String(task.status || "").toUpperCase();
      if (status === "COMPLETED") {
        notifs.push({
          id: `task-done-${task.id}`,
          icon: "✅",
          text: `Task "${task.title || task.name}" marked as completed`,
          time: task.updated_at || task.created_at,
          color: "#16a34a",
        });
      } else if (status === "IN_PROGRESS") {
        notifs.push({
          id: `task-prog-${task.id}`,
          icon: "🔄",
          text: `Task "${task.title || task.name}" is in progress`,
          time: task.updated_at || task.created_at,
          color: "#0891b2",
        });
      } else {
        notifs.push({
          id: `task-new-${task.id}`,
          icon: "📋",
          text: `New task created: "${task.title || task.name}"`,
          time: task.created_at,
          color: "#2563eb",
        });
      }
    });

    // From projects - all of them, checking multiple possible field names
    [...projects].forEach((project) => {
      const projectName =
        project.name ||
        project.title ||
        project.project_name ||
        `Project #${project.id}`;

      const projectStatus =
        project.status || project.project_status || "Active";

      const projectTime =
        project.updated_at ||
        project.created_at ||
        project.start_date ||
        null;

      notifs.push({
        id: `project-${project.id}`,
        icon: "📁",
        text: `Project "${projectName}" — Status: ${projectStatus}`,
        time: projectTime,
        color: "#7c3aed",
      });
    });

    // From users - all of them, checking multiple possible field names
    [...users].forEach((user) => {
      const userName =
  user?.first_name ||
  user?.name ||
  user?.full_name ||
  user?.username ||
  user?.user?.first_name ||
  user?.user?.name ||
  user?.user?.username ||
  user?.email ||
  user?.user?.email ||
  user?.user_email ||
  `User #${user.id}`;
      const userTime =
        user.date_joined ||
        user.created_at ||
        user.joined_at ||
        (user.user && (user.user.date_joined || user.user.created_at)) ||
        null;

      notifs.push({
        id: `user-${user.id}`,
        icon: "👤",
        text: `User "${userName}" added to the system`,
        time: userTime,
        color: "#d97706",
      });
    });

    // Sort by time descending — items with no time go to bottom
    notifs.sort((a, b) => {
      if (!a.time && !b.time) return 0;
      if (!a.time) return 1;
      if (!b.time) return -1;
      return new Date(b.time) - new Date(a.time);
    });

    // Remove duplicates by id just in case
    const seen = new Set();
    const unique = notifs.filter((n) => {
      if (seen.has(n.id)) return false;
      seen.add(n.id);
      return true;
    });

    setNotifications(unique);
    setUnreadCount(Math.min(unique.length, 9));
  }, [users, projects, tasks]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const formatTime = (time) => {
    if (!time) return "some time ago";
    try {
      const date = new Date(time);
      const now = new Date();
      const diff = Math.floor((now - date) / 1000);
      if (diff < 60) return "just now";
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
    } catch {
      return "";
    }
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Bell Button */}
      <button
        onClick={() => { setOpen((o) => !o); setUnreadCount(0); }}
        style={{
          position: "relative",
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.22)",
          borderRadius: "10px",
          padding: "8px 12px",
          cursor: "pointer",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "18px",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.22)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
        title="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: "absolute",
            top: "-6px",
            right: "-6px",
            background: "#ef4444",
            color: "#fff",
            borderRadius: "50%",
            width: "18px",
            height: "18px",
            fontSize: "10px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #0d2760",
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 10px)",
          right: 0,
          width: "340px",
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(13,39,96,0.18)",
          border: "1px solid #dbeafe",
          zIndex: 99999,
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            padding: "14px 18px",
            background: "linear-gradient(135deg, #0d2760, #1e3a8a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <span style={{ color: "#fff", fontWeight: "800", fontSize: "14px", fontFamily: "'Georgia', serif" }}>
              🔔 Notifications
            </span>
            <span style={{ color: "#93c5fd", fontSize: "11px", fontWeight: "600" }}>
              {notifications.length} total
            </span>
          </div>

          {/* List */}
          <div style={{ maxHeight: "420px", overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
                No notifications yet
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} style={{
                  padding: "12px 18px",
                  borderBottom: "1px solid #f0f5ff",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  transition: "background 0.15s",
                  cursor: "default",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f8faff"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{
                    fontSize: "18px",
                    flexShrink: 0,
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: notif.color + "15",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    {notif.icon}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "12px", color: "#1e3a8a", fontWeight: "600", lineHeight: "1.4", margin: 0 }}>
                      {notif.text}
                    </p>
                    <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "3px", margin: "3px 0 0" }}>
                      {formatTime(notif.time)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
