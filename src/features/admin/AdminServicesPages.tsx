import { useState, type FormEvent } from "react";
import { Edit3, FileText, Plus, RotateCcw, Search, Trash2 } from "lucide-react";
import { SectionHeader } from "../../components/data-display";
import { Badge, Button, Card, ConfirmDialog, EmptyState, FormField, Message, Modal } from "../../components/ui";
import { PageHeader } from "../../components/layout/AppShell";
import type { Announcement, ApplicationStatus, StudentApplication } from "../../data/types";
import { formatDate, fullName } from "../../lib/formatters";
import { applicationTone, useAdminData } from "./shared";

type AnnouncementDraft = Omit<Announcement, "id" | "readBy" | "createdAt">;

const emptyAnnouncement = (): AnnouncementDraft => ({
  title: "",
  category: "Academic",
  body: "",
  author: "Academic Office"
});

export const AdminAnnouncementsPage = () => {
  const { state, saveAnnouncement, deleteAnnouncement } = useAdminData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [draft, setDraft] = useState<AnnouncementDraft>(emptyAnnouncement);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openEditor = (announcement?: Announcement) => {
    setEditing(announcement ?? null);
    setDraft(announcement ? {
      title: announcement.title,
      category: announcement.category,
      body: announcement.body,
      author: announcement.author
    } : emptyAnnouncement());
    setError("");
    setOpen(true);
  };

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      saveAnnouncement(editing?.id ?? null, draft);
      setOpen(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save the announcement.");
    }
  };

  const target = state.announcements.find((announcement) => announcement.id === deleteId);

  return (
    <>
      <PageHeader title="Announcement management" description="Publish, edit, or remove notices shared with the student portal." action={<Button type="button" onClick={() => openEditor()}><Plus size={18} /> Create announcement</Button>} />
      <Card>
        <SectionHeader title="Published notices" description="Student announcement views update from this same local store." />
        {state.announcements.length ? <div className="admin-notice-list">{state.announcements.map((announcement) => <article className="admin-notice" key={announcement.id}><div><div className="notice-meta"><Badge tone={announcement.category === "Finance" ? "warning" : "info"}>{announcement.category}</Badge><span>{formatDate(announcement.createdAt)} · {announcement.author}</span></div><h2>{announcement.title}</h2><p>{announcement.body}</p></div><div className="row-actions"><button className="table-action" type="button" onClick={() => openEditor(announcement)}><Edit3 size={15} /> Edit</button><button className="table-action table-action-danger" type="button" onClick={() => setDeleteId(announcement.id)}><Trash2 size={15} /> Delete</button></div></article>)}</div> : <EmptyState title="No announcements yet" description="Create a notice to share it with students." />}
      </Card>
      <Modal open={open} title={editing ? "Edit announcement" : "Create announcement"} onClose={() => setOpen(false)}>
        <form className="modal-form stack-form" onSubmit={save} noValidate>
          <FormField label="Title" htmlFor="announcement-title"><input id="announcement-title" className="input" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} /></FormField>
          <div className="inline-fields">
            <FormField label="Category" htmlFor="announcement-category"><select id="announcement-category" className="input" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value as AnnouncementDraft["category"] })}><option>Academic</option><option>Campus</option><option>Finance</option><option>General</option></select></FormField>
            <FormField label="Author" htmlFor="announcement-author"><input id="announcement-author" className="input" value={draft.author} onChange={(event) => setDraft({ ...draft, author: event.target.value })} /></FormField>
          </div>
          <FormField label="Message" htmlFor="announcement-body"><textarea id="announcement-body" className="input textarea" value={draft.body} onChange={(event) => setDraft({ ...draft, body: event.target.value })} /></FormField>
          {error ? <Message tone="error">{error}</Message> : null}
          <div className="modal-actions"><Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit">Save announcement</Button></div>
        </form>
      </Modal>
      <ConfirmDialog open={Boolean(deleteId)} title="Delete this announcement?" description={target ? "“" + target.title + "” will be removed from both admin and student demo views." : "This notice will be removed."} confirmLabel="Delete announcement" danger onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) deleteAnnouncement(deleteId); setDeleteId(null); }} />
    </>
  );
};

export const AdminApplicationsPage = () => {
  const { state, decideApplication } = useAdminData();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [selected, setSelected] = useState<StudentApplication | null>(null);
  const [decision, setDecision] = useState<ApplicationStatus | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const applications = state.applications.filter((application) => {
    const student = state.students.find((item) => item.id === application.studentId);
    const text = application.type + " " + application.reason + " " + fullName(student);
    return text.toLowerCase().includes(query.toLowerCase()) && (status === "All" || application.status === status);
  });

  const openDetail = (application: StudentApplication) => {
    setSelected(application);
    setDecision(null);
    setNote(application.decisionNote ?? "");
    setError("");
  };

  const chooseDecision = (next: ApplicationStatus) => {
    setDecision(next);
    if (next === "Approved") setNote("Approved in this local demo.");
    else setNote("");
    setError("");
  };

  const confirmDecision = () => {
    if (!selected || !decision) return;
    try {
      decideApplication(selected.id, decision, note);
      setSelected(null);
      setDecision(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update the request.");
    }
  };

  const selectedStudent = state.students.find((student) => student.id === selected?.studentId);

  return (
    <>
      <PageHeader title="Application approvals" description="Review student requests and make a visible local demo decision." />
      <Card className="toolbar-card student-toolbar">
        <div className="search-input"><Search size={18} /><input aria-label="Search applications" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search request, student, or reason" /></div>
        <select className="input compact-select" aria-label="Filter request status" value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option><option>Pending</option><option>Approved</option><option>Rejected</option></select>
      </Card>
      <Card>
        <SectionHeader title="Student requests" description={applications.length + " matching requests"} />
        {applications.length ? <div className="table-wrap"><table><thead><tr><th>Student</th><th>Request</th><th>Submitted</th><th>Status</th><th aria-label="Actions" /></tr></thead><tbody>{applications.map((application) => <tr key={application.id}><td>{fullName(state.students.find((student) => student.id === application.studentId))}</td><td><strong>{application.type}</strong><br /><small>{application.reason.slice(0, 72)}{application.reason.length > 72 ? "…" : ""}</small></td><td>{formatDate(application.submittedAt)}</td><td><Badge tone={applicationTone(application.status)}>{application.status}</Badge></td><td><button className="table-action" type="button" onClick={() => openDetail(application)}>Review</button></td></tr>)}</tbody></table></div> : <EmptyState title="No requests found" description="Try a different search or status filter." />}
      </Card>
      <Modal open={Boolean(selected)} title="Review student request" onClose={() => setSelected(null)}>
        {selected ? <div className="stack-form"><div className="detail-summary"><Badge tone={applicationTone(selected.status)}>{selected.status}</Badge><h3>{selected.type}</h3><p>{fullName(selectedStudent)} · Submitted {formatDate(selected.submittedAt)}</p><p>{selected.reason}</p>{selected.decisionNote ? <p className="decision-note">Recorded decision: {selected.decisionNote}</p> : null}</div>
          {selected.status === "Pending" && !decision ? <div className="modal-actions"><Button type="button" variant="secondary" onClick={() => setSelected(null)}>Close</Button><Button type="button" variant="danger" onClick={() => chooseDecision("Rejected")}>Reject</Button><Button type="button" onClick={() => chooseDecision("Approved")}>Approve</Button></div> : null}
          {selected.status === "Pending" && decision ? <div className="stack-form decision-confirm"><h3>{decision === "Approved" ? "Approve this request?" : "Reject this request?"}</h3><p>{decision === "Approved" ? "Confirming makes the local approval visible in the student request history." : "A short explanation is required and will be visible to the student in this demo."}</p><FormField label={decision === "Rejected" ? "Rejection reason" : "Decision note"} htmlFor="decision-note"><textarea id="decision-note" className="input textarea" value={note} onChange={(event) => setNote(event.target.value)} /></FormField>{error ? <Message tone="error">{error}</Message> : null}<div className="modal-actions"><Button type="button" variant="secondary" onClick={() => setDecision(null)}>Back</Button><Button type="button" variant={decision === "Rejected" ? "danger" : "primary"} onClick={confirmDecision}>Confirm {decision.toLowerCase()}</Button></div></div> : null}
          {selected.status !== "Pending" ? <div className="modal-actions"><Button type="button" onClick={() => setSelected(null)}>Close</Button></div> : null}
        </div> : null}
      </Modal>
    </>
  );
};

export const AdminSettingsPage = () => {
  const { resetDemoData } = useAdminData();
  const [confirmReset, setConfirmReset] = useState(false);
  const [message, setMessage] = useState("");

  const reset = () => {
    resetDemoData();
    setConfirmReset(false);
    setMessage("The original local demo dataset has been restored.");
  };

  return (
    <>
      <PageHeader title="Demo settings" description="Control only the mock data stored in this browser." />
      <div className="settings-grid">
        <Card>
          <SectionHeader title="Reset demo data" description="Return students, courses, notices, applications, and records to their original seed state." />
          <p className="muted">This affects only the current browser’s local frontend demo. It does not contact a server.</p>
          {message ? <Message tone="success">{message}</Message> : null}
          <Button type="button" variant="danger" onClick={() => setConfirmReset(true)}><RotateCcw size={17} /> Reset local demo data</Button>
        </Card>
        <Card>
          <SectionHeader title="Scope reminder" description="JPRN is intentionally frontend-only for this phase." />
          <ul className="scope-list"><li>No live authentication or real accounts</li><li>No backend, database, or shared records</li><li>No real payment processing</li><li>Session and changes expire or stay local to this browser</li></ul>
        </Card>
      </div>
      <ConfirmDialog open={confirmReset} title="Reset all local demo data?" description="Your local edits to students, courses, attendance, results, notices, and requests will be replaced with the original sample data." confirmLabel="Reset demo data" danger onClose={() => setConfirmReset(false)} onConfirm={reset} />
    </>
  );
};
