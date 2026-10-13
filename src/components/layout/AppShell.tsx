import { useState, type PropsWithChildren } from "react";
import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckSquare,
  ClipboardList,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  ReceiptIndianRupee,
  Settings,
  ShieldCheck,
  Users,
  X
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDemo } from "../../context/DemoContext";
import { fullName } from "../../lib/formatters";
import { Avatar, Button } from "../ui";

type ShellRole = "student" | "admin";

const studentNavigation = [
  { to: "/student/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/student/profile", label: "My profile", icon: Users },
  { to: "/student/courses", label: "Courses", icon: BookOpen },
  { to: "/student/attendance", label: "Attendance", icon: CheckSquare },
  { to: "/student/results", label: "Results", icon: GraduationCap },
  { to: "/student/announcements", label: "Notices", icon: Bell },
  { to: "/student/timetable", label: "Timetable", icon: CalendarDays },
  { to: "/student/fees", label: "Fees", icon: ReceiptIndianRupee },
  { to: "/student/applications", label: "Requests", icon: FileText }
];

const adminNavigation = [
  { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/attendance", label: "Attendance", icon: CheckSquare },
  { to: "/admin/results", label: "Results", icon: GraduationCap },
  { to: "/admin/announcements", label: "Notices", icon: Bell },
  { to: "/admin/applications", label: "Requests", icon: ClipboardList },
  { to: "/admin/settings", label: "Demo settings", icon: Settings }
];

export const AppShell = ({ role, children }: PropsWithChildren<{ role: ShellRole }>) => {
  const { state, session, logout } = useDemo();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const student = state.students.find((item) => item.id === session?.userId);
  const personName = role === "student" ? fullName(student) : "Maya Joseph";
  const navigation = role === "student" ? studentNavigation : adminNavigation;

  const leave = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-shell">
      <aside className={"sidebar " + (mobileOpen ? "sidebar-open" : "")} aria-label={role + " navigation"}>
        <div className="brand">
          <span className="brand-mark"><ShieldCheck size={24} /></span>
          <div className="brand-text">
            <span>JERONE</span>
            <small>Premium Portal</small>
          </div>
          <button className="mobile-close icon-button" type="button" aria-label="Close navigation" onClick={() => setMobileOpen(false)}>
            <X size={19} />
          </button>
        </div>
        <nav className="navigation">
          <p className="nav-heading">{role === "student" ? "Student Experience" : "Administrative Hub"}</p>
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => "nav-link " + (isActive ? "nav-link-active" : "")}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={20} aria-hidden="true" />
                <span className="nav-label">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <div className="sidebar-note">
          <span className="note-title">Demo Environment</span>
          <p>Experience the premium frontend. All data persists locally in your browser.</p>
        </div>
      </aside>
      {mobileOpen ? <button className="drawer-scrim" type="button" aria-label="Close navigation" onClick={() => setMobileOpen(false)} /> : null}
      <div className="shell-main">
        <header className="topbar">
          <button className="icon-button mobile-menu" type="button" aria-label="Open navigation" onClick={() => setMobileOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="topbar-context">
            <span className="context-label">{role === "student" ? "Student Dashboard" : "Control Center"}</span>
            <strong className="context-term">Autumn Term · 2026</strong>
          </div>
          <div className="topbar-actions">
            <div className="notification-wrap">
              <button
                className="icon-button notification-button"
                type="button"
                aria-label="Open notifications"
                aria-expanded={notificationsOpen}
                onClick={() => setNotificationsOpen((open) => !open)}
              >
                <Bell size={20} />
                <span className="notification-dot" />
              </button>
              {notificationsOpen ? (
                <div className="notification-panel">
                  <strong className="panel-title">Notifications</strong>
                  <div className="panel-content">
                    <p>Your portal activity is stored locally for this demo.</p>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="profile-chip">
              <Avatar name={personName} />
              <div className="profile-info">
                <strong className="profile-name">{personName}</strong>
                <span className="profile-role">{role === "student" ? "Student" : "Administrator"}</span>
              </div>
            </div>
            <Button className="logout-button" variant="ghost" type="button" onClick={leave}>
              <LogOut size={18} />
              <span className="logout-text">Exit</span>
            </Button>
          </div>
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
};

export const PageHeader = ({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) => (
  <header className="page-header">
    <div>
      <p className="eyebrow">JERONE PORTAL</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
    {action}
  </header>
);
