import { useState, type FormEvent } from "react";
import { CheckCircle2, Clock3, IndianRupee, Send } from "lucide-react";
import { MetricCard, ProgressBar, SectionHeader } from "../../components/data-display";
import { Badge, Button, Card, EmptyState, FormField, Message } from "../../components/ui";
import { PageHeader } from "../../components/layout/AppShell";
import type { StudentApplication } from "../../data/types";
import { formatCurrency, formatDate } from "../../lib/formatters";
import { useStudentData } from "./shared";

export const StudentFeesPage = () => {
  const { state, studentId } = useStudentData();
  const fee = state.fees.find((item) => item.studentId === studentId);

  if (!fee) {
    return (
      <>
        <PageHeader title="Fees" description="Your demo tuition overview." />
        <EmptyState title="No fee summary available" description="This student does not have a sample fee record yet." />
      </>
    );
  }

  const balance = fee.total - fee.paid;
  const settled = fee.total ? Math.round((fee.paid / fee.total) * 100) : 0;

  return (
    <>
      <PageHeader title="Fees" description="A readable local summary — no payment is processed in this demo." />
      <div className="metric-grid compact-metrics">
        <MetricCard label="Total fee" value={formatCurrency(fee.total)} detail="Autumn 2026" icon={<IndianRupee size={21} />} />
        <MetricCard label="Amount paid" value={formatCurrency(fee.paid)} detail="Recorded locally" icon={<CheckCircle2 size={21} />} tone="teal" />
        <MetricCard label="Outstanding" value={formatCurrency(balance)} detail={"Due " + formatDate(fee.dueDate)} icon={<Clock3 size={21} />} tone="amber" />
      </div>
      <Card className="fee-summary-card">
        <div><span>Payment progress</span><strong>{settled}% settled</strong></div>
        <ProgressBar value={settled} tone="teal" />
      </Card>
      <Card>
        <SectionHeader title="Fee history" description="These are fictional sample entries. No money is transferred." />
        {balance > 0 ? <Message tone="info">A demo balance remains. The portal does not collect real payment details.</Message> : null}
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {fee.transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{formatDate(transaction.date)}</td>
                  <td>{transaction.description}</td>
                  <td>{formatCurrency(transaction.amount)}</td>
                  <td><Badge tone={transaction.status === "Paid" ? "success" : "warning"}>{transaction.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
};

export const StudentApplicationsPage = () => {
  const { state, studentId, createApplication } = useStudentData();
  const [type, setType] = useState<StudentApplication["type"]>("Bonafide Certificate");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const applications = state.applications
    .filter((application) => application.studentId === studentId)
    .sort((left, right) => right.submittedAt.localeCompare(left.submittedAt));

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      createApplication({ studentId, type, reason });
      setReason("");
      setError("");
      setMessage("Your request was added with Pending status in this local demo.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create the request.");
      setMessage("");
    }
  };

  return (
    <>
      <PageHeader title="Applications & requests" description="Submit and track local demo requests for student services." />
      <div className="application-layout">
        <Card>
          <SectionHeader title="New request" description="This creates a local demo record only." />
          <form className="stack-form" onSubmit={submit} noValidate>
            <FormField label="Request type" htmlFor="request-type">
              <select id="request-type" className="input" value={type} onChange={(event) => setType(event.target.value as StudentApplication["type"])}>
                <option>Bonafide Certificate</option>
                <option>ID Card Replacement</option>
                <option>Leave Request</option>
              </select>
            </FormField>
            <FormField label="Reason or details" htmlFor="request-reason" hint="At least 12 characters.">
              <textarea id="request-reason" className="input textarea" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Explain what you need…" />
            </FormField>
            {error ? <Message tone="error">{error}</Message> : null}
            {message ? <Message tone="success">{message}</Message> : null}
            <Button type="submit"><Send size={17} /> Submit request</Button>
          </form>
        </Card>
        <Card>
          <SectionHeader title="My request history" description={applications.length + " local records"} />
          {applications.length ? (
            <div className="request-list">
              {applications.map((application) => (
                <div className="request-item" key={application.id}>
                  <div>
                    <Badge tone={application.status === "Pending" ? "warning" : application.status === "Approved" ? "success" : "danger"}>{application.status}</Badge>
                    <h3>{application.type}</h3>
                    <p>{application.reason}</p>
                    {application.decisionNote ? <small>Decision: {application.decisionNote}</small> : null}
                  </div>
                  <time>{formatDate(application.submittedAt)}</time>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No requests yet" description="Use the form to submit your first local demo request." />
          )}
        </Card>
      </div>
    </>
  );
};
