import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FilePlus2,
  FileText,
  IndianRupee
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { MetricCard, ProgressBar, SectionHeader } from "../../components/data-display";
import { Badge, Button, Card, FormField, Message } from "../../components/ui";
import { PageHeader } from "../../components/layout/AppShell";
import {
  attendancePercent,
  formatCurrency,
  formatDate,
  fullName,
  gradeTone,
  studentCourses
} from "../../lib/formatters";
import { CourseTitle, useStudentData } from "./shared";

export const StudentDashboardPage = () => {
  const { state, studentId, student } = useStudentData();
  const navigate = useNavigate();
  const courses = studentCourses(state, studentId);
  const attendanceRecords = state.attendance.filter((record) => record.studentId === studentId);
  const attendance = attendancePercent(attendanceRecords);
  const fee = state.fees.find((item) => item.studentId === studentId);
  const pendingApplications = state.applications.filter(
    (application) => application.studentId === studentId && application.status === "Pending"
  );
  const courseAttendance = courses.map((course) => ({
    course,
    percent: attendancePercent(attendanceRecords.filter((record) => record.courseId === course.id))
  }));
  const timetable = state.timetable
    .filter((entry) => courses.some((course) => course.id === entry.courseId))
    .slice(0, 3);

  return (
    <>
      <PageHeader
        title={"Welcome back, " + (student?.firstName ?? "Student")}
        description="Your premium academic overview for the Autumn 2026 term."
        action={
          <Button type="button" onClick={() => navigate("/student/applications")}>
            <FilePlus2 size={18} /> New Request
          </Button>
        }
      />
      <div className="metric-grid">
        <MetricCard label="Overall Attendance" value={attendance + "%"} detail="Across all enrolled modules" icon={<CheckCircle2 size={21} />} tone="teal" action={() => navigate("/student/attendance")} />
        <MetricCard label="Active Courses" value={courses.length} detail="Currently enrolled programs" icon={<BookOpen size={21} />} action={() => navigate("/student/courses")} />
        <MetricCard label="Pending Fees" value={formatCurrency((fee?.total ?? 0) - (fee?.paid ?? 0))} detail={fee ? "Due " + formatDate(fee.dueDate) : "No fee record"} icon={<IndianRupee size={21} />} tone="amber" action={() => navigate("/student/fees")} />
        <MetricCard label="Open Requests" value={pendingApplications.length} detail="Awaiting administrator review" icon={<FileText size={21} />} tone="rose" action={() => navigate("/student/applications")} />
      </div>
      <div className="dashboard-grid dashboard-grid-wide">
        <Card className="dashboard-main-card">
          <SectionHeader title="Academic Performance" description="Real-time attendance tracking by course." action={<Link to="/student/attendance" className="text-link">Full Report <ArrowRight size={15} /></Link>} />
          <div className="course-progress-grid">
            {courseAttendance.map(({ course, percent }) => (
              <div className="progress-pod" key={course.id}>
                <div className="pod-header">
                  <strong className="pod-code">{course.code}</strong>
                  <span className="pod-percent">{percent}%</span>
                </div>
                <div className="pod-title">{course.title}</div>
                <ProgressBar value={percent} tone={percent > 75 ? "teal" : percent > 50 ? "indigo" : "rose"} />
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader title="Next Sessions" description="Upcoming classes in your timetable." action={<Link to="/student/timetable" className="text-link">Full Schedule <ArrowRight size={15} /></Link>} />
          <div className="agenda-list">
            {timetable.map((entry) => {
              const course = state.courses.find((item) => item.id === entry.courseId);
              return (
                <div className="agenda-item" key={entry.id}>
                  <span className="agenda-day">{entry.day.slice(0, 3)}</span>
                  <div className="agenda-details">
                    <CourseTitle course={course} />
                    <small>{entry.startTime}–{entry.endTime} · {entry.room}</small>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      <div className="dashboard-grid">
        <Card>
          <SectionHeader title="Institutional Notices" action={<Link to="/student/announcements" className="text-link">View all <ArrowRight size={15} /></Link>} />
          <div className="notice-list">
            {state.announcements.slice(0, 3).map((announcement) => (
              <Link className="notice-link" to="/student/announcements" key={announcement.id}>
                <Badge tone={announcement.category === "Finance" ? "warning" : "info"}>{announcement.category}</Badge>
                <div className="notice-content">
                  <strong className="notice-title">{announcement.title}</strong>
                  <small className="notice-date">{formatDate(announcement.createdAt)}</small>
                </div>
              </Link>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader title="Academic Results" action={<Link to="/student/results" className="text-link">Detailed view <ArrowRight size={15} /></Link>} />
          <div className="result-preview">
            {state.results.filter((result) => result.studentId === studentId).slice(0, 3).map((result) => {
              const course = state.courses.find((item) => item.id === result.courseId);
              return (
                <div key={result.id} className="result-row">
                  <span className="result-course">{course?.code}</span>
                  <strong className="result-score">{result.score}/{result.maxScore}</strong>
                  <Badge tone={gradeTone(result.grade)}>{result.grade}</Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
};

export const StudentProfilePage = () => {
  const { student, studentId, updateStudent } = useStudentData();
  const [draft, setDraft] = useState(() => ({
    firstName: student?.firstName ?? "",
    lastName: student?.lastName ?? "",
    email: student?.email ?? "",
    phone: student?.phone ?? "",
    program: student?.program ?? "",
    semester: student?.semester ?? ""
  }));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const reset = () => {
    setDraft({
      firstName: student?.firstName ?? "",
      lastName: student?.lastName ?? "",
      email: student?.email ?? "",
      phone: student?.phone ?? "",
      program: student?.program ?? "",
      semester: student?.semester ?? ""
    });
    setMessage("");
    setError("");
  };

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.firstName.trim() || !draft.lastName.trim() || !/^\S+@\S+\.\S+$/.test(draft.email)) {
      setError("Enter your first name, last name, and a valid email address.");
      setMessage("");
      return;
    }
    updateStudent(studentId, {
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      program: draft.program.trim(),
      semester: draft.semester.trim()
    });
    setError("");
    setMessage("Profile saved in this browser’s local demo data.");
  };

  return (
    <>
      <PageHeader title="My profile" description="Review the essential details shown in your student record." />
      <div className="profile-layout">
        <Card className="profile-summary">
          <div className="profile-hero">
            <span className="profile-avatar">{(student?.firstName[0] ?? "S") + (student?.lastName[0] ?? "T")}</span>
            <div><h2>{fullName(student)}</h2><p>{student?.studentCode}</p></div>
          </div>
          <dl className="profile-meta">
            <div><dt>Programme</dt><dd>{student?.program}</dd></div>
            <div><dt>Current term</dt><dd>{student?.semester}</dd></div>
            <div><dt>Status</dt><dd><Badge tone="success">{student?.status}</Badge></dd></div>
            <div><dt>Joined</dt><dd>{student ? formatDate(student.joinedDate) : "—"}</dd></div>
          </dl>
        </Card>
        <Card>
          <SectionHeader title="Edit basic details" description="Changes are visible only in this demo browser." />
          <form className="form-grid" onSubmit={save} noValidate>
            <FormField label="First name" htmlFor="first-name"><input id="first-name" className="input" value={draft.firstName} onChange={(event) => setDraft({ ...draft, firstName: event.target.value })} /></FormField>
            <FormField label="Last name" htmlFor="last-name"><input id="last-name" className="input" value={draft.lastName} onChange={(event) => setDraft({ ...draft, lastName: event.target.value })} /></FormField>
            <FormField label="Email address" htmlFor="profile-email"><input id="profile-email" className="input" type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /></FormField>
            <FormField label="Phone number" htmlFor="profile-phone"><input id="profile-phone" className="input" value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} /></FormField>
            <FormField label="Programme" htmlFor="profile-program"><input id="profile-program" className="input" value={draft.program} onChange={(event) => setDraft({ ...draft, program: event.target.value })} /></FormField>
            <FormField label="Semester" htmlFor="profile-semester"><input id="profile-semester" className="input" value={draft.semester} onChange={(event) => setDraft({ ...draft, semester: event.target.value })} /></FormField>
            {error ? <div className="form-full"><Message tone="error">{error}</Message></div> : null}
            {message ? <div className="form-full"><Message tone="success">{message}</Message></div> : null}
            <div className="form-actions form-full"><Button type="button" variant="secondary" onClick={reset}>Reset changes</Button><Button type="submit">Save profile</Button></div>
          </form>
        </Card>
      </div>
    </>
  );
};
