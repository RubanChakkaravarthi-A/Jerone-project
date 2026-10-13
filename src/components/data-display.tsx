import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Card } from "./ui";

export const MetricCard = ({
  label,
  value,
  detail,
  icon,
  tone = "indigo",
  action
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: ReactNode;
  tone?: "indigo" | "teal" | "amber" | "rose";
  action?: () => void;
}) => (
  <Card className="metric-card">
    <div className={"metric-icon metric-" + tone}>{icon}</div>
    <div className="metric-copy">
      <span className="metric-label">{label}</span>
      <strong className="metric-value">{value}</strong>
      <small className="metric-detail">{detail}</small>
    </div>
    {action ? (
      <button className="metric-action" type="button" aria-label={"Open " + label} onClick={action}>
        <ArrowUpRight size={18} />
      </button>
    ) : null}
  </Card>
);

export const SectionHeader = ({
  title,
  description,
  action
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) => (
  <div className="section-header">
    <div>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
    {action}
  </div>
);

export const ProgressBar = ({
  value,
  label,
  tone = "indigo"
}: {
  value: number;
  label?: string;
  tone?: "indigo" | "teal" | "amber" | "rose";
}) => (
  <div className="progress-wrap">
    {label ? <span>{label}</span> : null}
    <div className="progress-track" aria-label={label}>
      <span className={"progress-value progress-" + tone} style={{ width: Math.max(0, Math.min(value, 100)) + "%" }} />
    </div>
  </div>
);
