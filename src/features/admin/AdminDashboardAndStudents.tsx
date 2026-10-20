import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckSquare,
  ClipboardList,
  FileText,
  GraduationCap,
  Search,
  Users
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MetricCard, ProgressBar, SectionHeader } from "../../components/data-display";
import { Badge, Button, Card, EmptyState, FormField, Message } from "../../components/ui";
import { PageHeader } from "../../components/layout/AppShell";
import { attendancePercent, formatDate, fullName, studentCourses } from "../../lib/formatters";
import { applicationTone, useAdminData } from "./shared";

export const AdminDashboardPage = () => {
  const { state } = useAdminData();
  const navigate = useNavigate();
  const activeStudents = state.students.filter((student) => student.status === "Active");
  const pending = state.applications.filter((application) => application.status === "Pending");
  const totalOutstanding = state.fees.reduce((total, fee) => total + (fee.total - fee.paid), 0);
  const overallAttendance = attendancePercent(state.attendance);

  return (
    <>
      <PageHeader
        title="Institution overview"
        description="A focused operating snapshot for the Autumn 2026 demo term."
        action={<Button type="button" onClick={() => navigate("/admin/announcements")}><FileText size={18} /> Publish notice</Button>}
      />
      <div className="metric-grid">
        <MetricCard label="Active students" value={activeStudents.length} detail={state.students.length + " total student records"} icon={<Users size={21} />} action={() => navigate("/admin/students")} />
        <MetricCard label="Courses" value={state.courses.length} detail="Current term catalogue" icon={<BookOpen size={21} />} tone="teal" action={() => navigate("/admin/courses")} />
        <MetricCard label="Pending requests" value={pending.length} detail="Require a local decision" icon={<ClipboardList size={21} />} tone="amber" action={() => navigate("/admin/applications")} />
        <MetricCard label="Attendance" value={overallAttendance + "%"} detail="Across seeded records" icon={<CheckSquare size={21} />} tone="rose" action={() => navigate("/admin/attendance")} />
      </div>
      <div className="dashboard-grid dashboard-grid-wide">
        <Card className="dashboard-main-card">
          <SectionHeader title="Requests awaiting review" description="Student submissions are synchronized within this browser." action={<Link to="/admin/applications" className="text-link">Review all <ArrowRight size={15} /></Link>} />
          {pending.length ? <div className="request-list">{pending.slice(0, 4).map((application) => {
            const student = state.students.find((item) => item.id === application.studentId);
            return <div className="request-item" key={application.id}><div><Badge tone="warning">Pending</Badge><h3>{application.type}</h3><p>{fullName(student)} · {application.reason}</p></div><time>{formatDate(application.submittedAt)}</time></div>;
          })}</div> : <EmptyState title="No pending requests" description="New local requests will appear here." />}
        </Card>
        <Card>
          <SectionHeader title="Portal signal" description="A simple derived indicator from current data." />
          <div className="signal-list">
            <div><span>Attendance coverage</span><strong>{overallAttendance}%</strong></div>
            <ProgressBar value={overallAttendance} tone="teal" />
            <div><span>Outstanding demo fees</span><strong>₹{totalOutstanding.toLocaleString("en-IN")}</strong></div>
            <p className="muted">No financial transaction is connected to this frontend demo.</p>
          </div>
        </Card>
      </div>
      <div className="dashboard-grid">
        <Card>
          <SectionHeader title="Recent notices" action={<Link to="/admin/announcements" className="text-link">Manage notices <ArrowRight size={15} /></Link>} />
          <div className="notice-list">{state.announcements.slice(0, 3).map((announcement) => <div className="notice-link" key={announcement.id}><Badge tone={announcement.category === "Finance" ? "warning" : "info"}>{announcement.category}</Badge><span><strong>{announcement.title}</strong><small>{formatDate(announcement.createdAt)}</small></span></div>)}</div>
        </Card>
        <Card>
          <SectionHeader title="Quick actions" description="Navigate directly to a working module." />
          <div className="quick-actions"><Button type="button" variant="secondary" onClick={() => navigate("/admin/students")}><Users size={17} /> Student records</Button><Button type="button" variant="secondary" onClick={() => navigate("/admin/results")}><GraduationCap size={17} /> Record result</Button><Button type="button" variant="secondary" onClick={() => navigate("/admin/attendance")}><CheckSquare size={17} /> Update attendance</Button></div>
        </Card>
      </div>
    </>
  );
};

export const AdminStudentsPage = () => {
  const { state } = useAdminData();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const students = state.students.filter((student) => {
    const matchesText = (student.studentCode + " " + fullName(student) + " " + student.email + " " + student.program)
      .toLowerCase()
      .includes(query.toLowerCase());
    return matchesText && (status === "All" || student.status === status);
  });

  return (
    <>
      <PageHeader title="Student management" description="Search, inspect, and update student records stored in the local demo." />
      <Card className="toolbar-card student-toolbar">
        <div className="search-input"><Search size={18} /><input aria-label="Search students" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, ID, email, or programme" /></div>
        <select className="input compact-select" aria-label="Filter student status" value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option><option>Active</option><option>Inactive</option></select>
      </Card>
      <Card>
        <SectionHeader title="Student records" description={students.length + " matching records"} />
        {students.length ? <div className="table-wrap"><table><thead><tr><th>Student</th><th>Programme</th><th>Email</th><th>Phone</th><th>Semester</th><th>Joined</th><th>Attendance</th><th>Status</th><th aria-label="Actions" /></tr></thead><tbody>{students.map((student) => {
          const percentage = attendancePercent(state.attendance.filter((record) => record.studentId === student.id));
          return <tr key={student.id}><td><div className="student-cell"><strong>{fullName(student)}</strong><small>{student.studentCode}</small></div></td><td>{student.program}</td><td>{student.email}</td><td>{student.phone}</td><td>{student.semester}</td><td>{student.joinedDate}</td><td>{percentage}%</td><td><Badge tone={student.status === "Active" ? "success" : "neutral"}>{student.status}</Badge></td><td><Link className="table-action" to={"/admin/students/" + student.id}>View</Link></td></tr>;
        })}</tbody></table></div> : <EmptyState title="No student records found" description="Try changing the search or status filter." />}
      </Card>
    </>
  );
};

export const AdminStudentDetailPage = () => {
  const { studentId = "" } = useParams();
  const { state, updateStudent } = useAdminData();
  const navigate = useNavigate();
  const student = state.students.find((item) => item.id === studentId);
  const [draft, setDraft] = useState(() => ({
    firstName: student?.firstName ?? "",
    lastName: student?.lastName ?? "",
    email: student?.email ?? "",
    phone: student?.phone ?? "",
    program: student?.program ?? "",
    semester: student?.semester ?? "",
    status: student?.status ?? "Active"
  }));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!student) {
    return (
      <>
        <PageHeader title="Student not found" description="The requested record does not exist in the current demo data." />
        <Card><EmptyState title="No matching student" description="Return to the student list and choose an available record." action={<Button type="button" onClick={() => navigate("/admin/students")}>Back to students</Button>} /></Card>
      </>
    );
  }

  const attendance = attendancePercent(state.attendance.filter((record) => record.studentId === student.id));
  const courses = studentCourses(state, student.id);
  const results = state.results.filter((result) => result.studentId === student.id);

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.firstName.trim() || !draft.lastName.trim() || !/^\S+@\S+\.\S+$/.test(draft.email)) {
      setError("First name, last name, and a valid email address are required.");
      setMessage("");
      return;
    }
    updateStudent(student.id, {
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      program: draft.program.trim(),
      semester: draft.semester.trim(),
      status: draft.status as "Active" | "Inactive"
    });
    setError("");
    setMessage("Student record updated in this browser’s local demo data.");
  };

  return (
    <>
      <PageHeader title={fullName(student)} description={student.studentCode + " · " + student.program} action={<Button type="button" variant="secondary" onClick={() => navigate("/admin/students")}>Back to students</Button>} />
      <div className="metric-grid compact-metrics"><MetricCard label="Attendance" value={attendance + "%"} detail="Across current records" icon={<CheckSquare size={21} />} tone="teal" /><MetricCard label="Enrolled courses" value={courses.length} detail="Current term" icon={<BookOpen size={21} />} /><MetricCard label="Recorded results" value={results.length} detail="Local sample assessments" icon={<GraduationCap size={21} />} tone="amber" /></div>
      <Card>
        <SectionHeader title="Edit student record" description="The form updates the shared local data store." />
        <form className="form-grid" onSubmit={save} noValidate>
          <FormField label="First name" htmlFor="admin-first-name"><input id="admin-first-name" className="input" value={draft.firstName} onChange={(event) => setDraft({ ...draft, firstName: event.target.value })} /></FormField>
          <FormField label="Last name" htmlFor="admin-last-name"><input id="admin-last-name" className="input" value={draft.lastName} onChange={(event) => setDraft({ ...draft, lastName: event.target.value })} /></FormField>
          <FormField label="Email" htmlFor="admin-student-email"><input id="admin-student-email" className="input" type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /></FormField>
          <FormField label="Phone" htmlFor="admin-student-phone"><input id="admin-student-phone" className="input" value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} /></FormField>
          <FormField label="Programme" htmlFor="admin-student-programme"><input id="admin-student-programme" className="input" value={draft.program} onChange={(event) => setDraft({ ...draft, program: event.target.value })} /></FormField>
          <FormField label="Semester" htmlFor="admin-student-semester"><input id="admin-student-semester" className="input" value={draft.semester} onChange={(event) => setDraft({ ...draft, semester: event.target.value })} /></FormField>
          <FormField label="Record status" htmlFor="admin-student-status"><select id="admin-student-status" className="input" value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as "Active" | "Inactive" })}><option>Active</option><option>Inactive</option></select></FormField>
          {error ? <div className="form-full"><Message tone="error">{error}</Message></div> : null}
          {message ? <div className="form-full"><Message tone="success">{message}</Message></div> : null}
          <div className="form-actions form-full"><Button type="submit">Save record</Button></div>
        </form>
      </Card>
    </>
  );
};
