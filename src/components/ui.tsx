import {
  useEffect,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type PropsWithChildren,
  type ReactNode
} from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { initials } from "../lib/formatters";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

export const Button = ({
  children,
  className = "",
  variant = "primary",
  loading = false,
  disabled,
  ...props
}: ButtonProps) => (
  <button
    className={"button button-" + variant + " " + className}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? <span className="spinner" aria-label="Loading" /> : null}
    {children}
  </button>
);

export const Card = ({ children, className = "", ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
  <section className={"card " + className} {...props}>
    {children}
  </section>
);

type Tone = "neutral" | "success" | "warning" | "danger" | "info";

export const Badge = ({
  children,
  tone = "neutral"
}: PropsWithChildren<{ tone?: Tone }>) => <span className={"badge badge-" + tone}>{children}</span>;

export const Avatar = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={"avatar " + className} aria-label={name} title={name}>
    {initials(name)}
  </span>
);

export const FormField = ({
  label,
  htmlFor,
  error,
  hint,
  children
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) => (
  <label className="form-field" htmlFor={htmlFor}>
    <span className="field-label">{label}</span>
    {children}
    {error ? <span className="field-error">{error}</span> : hint ? <span className="field-hint">{hint}</span> : null}
  </label>
);

export const Message = ({ tone, children }: PropsWithChildren<{ tone: "success" | "error" | "info" }>) => (
  <div className={"message message-" + tone} role={tone === "error" ? "alert" : "status"}>
    {tone === "error" ? <AlertCircle size={18} aria-hidden="true" /> : <CheckCircle2 size={18} aria-hidden="true" />}
    <span>{children}</span>
  </div>
);

export const EmptyState = ({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) => (
  <div className="empty-state">
    <div className="empty-orb" aria-hidden="true" />
    <h3>{title}</h3>
    <p>{description}</p>
    {action}
  </div>
);

export const Modal = ({
  title,
  open,
  onClose,
  children
}: PropsWithChildren<{ title: string; open: boolean; onClose: () => void }>) => {
  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, open]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button className="icon-button" type="button" aria-label="Close dialog" onClick={onClose}>
            <X size={19} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
};

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  onClose,
  onConfirm,
  danger = false
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
  danger?: boolean;
}) => (
  <Modal open={open} title={title} onClose={onClose}>
    <div className="modal-content">
      <p className="modal-copy">{description}</p>
      <div className="modal-actions">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" variant={danger ? "danger" : "primary"} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  </Modal>
);
