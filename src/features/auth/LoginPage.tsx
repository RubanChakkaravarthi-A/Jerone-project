import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDemo } from "../../context/DemoContext";
import type { UserRole } from "../../data/types";
import { Button, FormField, Message } from "../../components/ui";

const credentials: Record<UserRole, { email: string; password: string; label: string }> = {
  student: {
    email: "student@jerone.demo",
    password: "Jerone2026",
    label: "Student demo"
  },
  admin: {
    email: "admin@jerone.demo",
    password: "Jerone2026",
    label: "Admin demo"
  }
};

export const LoginPage = () => {
  const { signIn } = useDemo();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const chooseDemo = (nextRole: UserRole) => {
    setRole(nextRole);
    setEmail(credentials[nextRole].email);
    setPassword(credentials[nextRole].password);
    setError("");
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const expected = credentials[role];
    if (!email.trim() || !password) {
      setError("Enter the demo email and password to continue.");
      return;
    }
    if (email.trim().toLowerCase() !== expected.email || password !== expected.password) {
      setError("Use the displayed " + expected.label.toLowerCase() + " credentials, or choose its quick sign-in.");
      return;
    }
    setError("");
    setLoading(true);
    window.setTimeout(() => {
      signIn(role);
      navigate(role === "student" ? "/student/dashboard" : "/admin/dashboard", { replace: true });
    }, 350);
  };

  return (
    <main className="login-page">
      <section className="login-story">
        <div className="login-brand">
          <span className="brand-mark"><ShieldCheck size={23} /></span>
          <span>JERONE</span>
        </div>
        <div className="login-story-copy">
          <p className="eyebrow">STUDENT & ADMIN MANAGEMENT</p>
          <h1>Clear academic workflows, in one deliberate space.</h1>
          <p>
            Explore a refined frontend demo for students and administrators. Every action is local to this browser.
          </p>
        </div>
        <div className="login-highlights" aria-label="Portal highlights">
          <div><Sparkles size={18} /><span>Thoughtful, role-aware dashboards</span></div>
          <div><GraduationCap size={18} /><span>Connected academic demo data</span></div>
          <div><ShieldCheck size={18} /><span>Frontend-only local persistence</span></div>
        </div>
        <p className="login-footnote">JERONE is a learning portal demo. It does not connect to a real institution, server, or payment service.</p>
      </section>

      <section className="login-panel-wrap">
        <form className="login-panel" onSubmit={submit} noValidate>
          <div>
            <p className="eyebrow">WELCOME BACK</p>
            <h2>Sign in to the demo</h2>
            <p className="muted">Pick a role to inspect its complete local workflow.</p>
          </div>
          <div className="role-selector" aria-label="Select a demo role">
            {(["student", "admin"] as UserRole[]).map((item) => (
              <button
                key={item}
                className={"role-choice " + (role === item ? "role-choice-active" : "")}
                type="button"
                onClick={() => chooseDemo(item)}
              >
                {item === "student" ? <GraduationCap size={19} /> : <ShieldCheck size={19} />}
                <span>
                  <strong>{item === "student" ? "Student" : "Administrator"}</strong>
                  <small>{item === "student" ? "Learning and requests" : "Academic operations"}</small>
                </span>
              </button>
            ))}
          </div>
          <FormField label="Demo email" htmlFor="login-email">
            <input
              id="login-email"
              className="input"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={credentials[role].email}
            />
          </FormField>
          <FormField label="Demo password" htmlFor="login-password">
            <div className="password-field">
              <input
                id="login-password"
                className="input"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter the password"
              />
              <button
                className="icon-button password-toggle"
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </FormField>
          {error ? <Message tone="error">{error}</Message> : null}
          <Button type="submit" loading={loading} className="full-width">
            Sign in as {role === "student" ? "student" : "administrator"} <ArrowRight size={18} />
          </Button>
          <div className="demo-credential">
            <span>{credentials[role].label}</span>
            <code>{credentials[role].email} · {credentials[role].password}</code>
            <button type="button" onClick={() => chooseDemo(role)}>Use these details</button>
          </div>
        </form>
      </section>
    </main>
  );
};
