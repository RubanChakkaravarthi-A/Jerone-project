import { useState, type FormEvent } from "react";
import { BookOpen, CheckSquare, Edit3, GraduationCap, Plus, Search } from "lucide-react";
import { MetricCard, SectionHeader } from "../../components/data-display";
import { Badge, Button, Card, EmptyState, FormField, Message, Modal } from "../../components/ui";
import { PageHeader } from "../../components/layout/AppShell";
import type { Course, CourseInput, ResultInput } from "../../data/types";
import { courseLabel, formatDate, fullName } from "../../lib/formatters";
import { useAdminData } from "./shared";

const emptyCourse = (): CourseInput => ({
  code: "",
  title: "",
  instructor: "",
  term: "Autumn 2026",
  credits: 3,
  capacity: 40
});

export const AdminCoursesPage = () => {
  const { state, saveCourse } = useAdminData();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [draft, setDraft] = useState<CourseInput>(emptyCourse);
  const [error, setError] = useState("");
  const courses = state.courses.filter((course) =>
    (course.code + " " + course.title + " " + course.instructor).toLowerCase().includes(query.toLowerCase())
  );

  const openEditor = (course?: Course) => {
    setEditing(course ?? null);
    setDraft(course ? {
      code: course.code,
      title: course.title,
      instructor: course.instructor,
      term: course.term,
      credits: course.credits,
      capacity: course.capacity
    } : emptyCourse());
    setError("");
    setOpen(true);
  };

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      saveCourse(editing?.id ?? null, draft);
      setOpen(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save the course.");
    }
  };

  return (
    <>
      <PageHeader title="Course management" description="Maintain a consistent local course catalogue for the current demo term." action={<Button type="button" onClick={() => openEditor()}><Plus size={18} /> Add course</Button>} />
      <Card className="toolbar-card">
        <div className="search-input"><Search size={18} /><input aria-label="Search courses" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search course code, title, or instructor" /></div>
        <span className="muted">{courses.length} courses</span>
      </Card>
      <Card>
        <SectionHeader title="Course catalogue" description="Duplicate course codes are prevented in this demo." />
        {courses.length ? <div className="table-wrap"><table><thead><tr><th>Course</th><th>Instructor</th><th>Term</th><th>Credits</th><th>Capacity</th><th aria-label="Actions" /></tr></thead><tbody>{courses.map((course) => <tr key={course.id}><td><strong>{course.code}</strong><br /><small>{course.title}</small></td><td>{course.instructor}</td><td>{course.term}</td><td>{course.credits}</td><td>{course.capacity}</td><td><button className="table-action" type="button" onClick={() => openEditor(course)}><Edit3 size={15} /> Edit</button></td></tr>)}</tbody></table></div> : <EmptyState title="No courses found" description="Try another search term or add a course." />}
      </Card>
      <Modal open={open} title={editing ? "Edit course" : "Add course"} onClose={() => setOpen(false)}>
        <form className="modal-form form-grid" onSubmit={save} noValidate>
          <FormField label="Course code" htmlFor="course-code"><input id="course-code" className="input" value={draft.code} onChange={(event) => setDraft({ ...draft, code: event.target.value })} placeholder="CS504" /></FormField>
          <FormField label="Course title" htmlFor="course-title"><input id="course-title" className="input" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} /></FormField>
          <FormField label="Instructor" htmlFor="course-instructor"><input id="course-instructor" className="input" value={draft.instructor} onChange={(event) => setDraft({ ...draft, instructor: event.target.value })} /></FormField>
          <FormField label="Term" htmlFor="course-term"><input id="course-term" className="input" value={draft.term} onChange={(event) => setDraft({ ...draft, term: event.target.value })} /></FormField>
          <FormField label="Credits" htmlFor="course-credits"><input id="course-credits" className="input" type="number" min="1" value={draft.credits} onChange={(event) => setDraft({ ...draft, credits: Number(event.target.value) })} /></FormField>
          <FormField label="Capacity" htmlFor="course-capacity"><input id="course-capacity" className="input" type="number" min="1" value={draft.capacity} onChange={(event) => setDraft({ ...draft, capacity: Number(event.target.value) })} /></FormField>
          {error ? <div className="form-full"><Message tone="error">{error}</Message></div> : null}
          <div className="modal-actions form-full"><Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit">Save course</Button></div>
        </form>
      </Modal>
    </>
  );
};

export const AdminAttendancePage = () => {
  const { state, setAttendance } = useAdminData();
  const [courseId, setCourseId] = useState(state.courses[0]?.id ?? "");
  const [date, setDate] = useState("2026-10-13");
  const [message, setMessage] = useState("");
  const course = state.courses.find((item) => item.id === courseId);
  const roster = state.students.filter((student) => state.enrollments.some((enrollment) => enrollment.courseId === courseId && enrollment.studentId === student.id));

  const updateStatus = (studentId: string, status: "Present" | "Absent" | "Late") => {
    setAttendance(studentId, courseId, date, status);
    setMessage("Attendance saved for " + date + " in local demo data.");
  };

  return (
    <>
      <PageHeader title="Attendance management" description="Select a course and date, then update the sample roster." />
      <div className="attendance-hero">
        <Card>
          <SectionHeader title="Class selection" description="These changes update student-facing attendance summaries." />
          <div className="inline-fields">
            <FormField label="Course" htmlFor="admin-attendance-course"><select id="admin-attendance-course" className="input" value={courseId} onChange={(event) => setCourseId(event.target.value)}>{state.courses.map((item) => <option key={item.id} value={item.id}>{item.code} · {item.title}</option>)}</select></FormField>
            <FormField label="Date" htmlFor="admin-attendance-date"><input id="admin-attendance-date" className="input" type="date" value={date} onChange={(event) => setDate(event.target.value)} /></FormField>
          </div>
        </Card>
        <Card className="attendance-score"><span>Selected class</span><strong>{roster.length}</strong><p>{course ? course.code + " · " + course.title : "Choose a course"}</p></Card>
      </div>
      <Card>
        <SectionHeader title="Attendance roster" description="Changes are saved immediately in this browser." />
        {message ? <Message tone="success">{message}</Message> : null}
        {roster.length ? <div className="table-wrap"><table><thead><tr><th>Student</th><th>Programme</th><th>Attendance status</th></tr></thead><tbody>{roster.map((student) => {
          const record = state.attendance.find((item) => item.studentId === student.id && item.courseId === courseId && item.date === date);
          return <tr key={student.id}><td><strong>{fullName(student)}</strong><br /><small>{student.studentCode}</small></td><td>{student.program}</td><td><select className="input status-select" value={record?.status ?? "Present"} aria-label={"Attendance status for " + fullName(student)} onChange={(event) => updateStatus(student.id, event.target.value as "Present" | "Absent" | "Late")}><option>Present</option><option>Late</option><option>Absent</option></select></td></tr>;
        })}</tbody></table></div> : <EmptyState title="No enrolments for this course" description="Choose another course to review its roster." />}
      </Card>
    </>
  );
};

const newResult = (courseId: string, studentId: string): ResultInput => ({
  studentId,
  courseId,
  assessment: "",
  score: 0,
  maxScore: 100,
  date: "2026-10-13",
  term: "Autumn 2026"
});

export const AdminResultsPage = () => {
  const { state, saveResult } = useAdminData();
  const [courseId, setCourseId] = useState(state.courses[0]?.id ?? "");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ResultInput>(() => newResult(courseId, state.students[0]?.id ?? ""));
  const [error, setError] = useState("");
  const results = state.results.filter((result) => result.courseId === courseId).sort((left, right) => right.date.localeCompare(left.date));
  const students = state.students.filter((student) => state.enrollments.some((enrollment) => enrollment.courseId === courseId && enrollment.studentId === student.id));

  const openEditor = (resultId?: string) => {
    const result = state.results.find((item) => item.id === resultId);
    setEditingId(result?.id ?? null);
    setDraft(result ? {
      studentId: result.studentId,
      courseId: result.courseId,
      assessment: result.assessment,
      score: result.score,
      maxScore: result.maxScore,
      date: result.date,
      term: result.term
    } : newResult(courseId, students[0]?.id ?? ""));
    setError("");
    setOpen(true);
  };

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      saveResult(editingId, draft);
      setOpen(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save the result.");
    }
  };

  return (
    <>
      <PageHeader title="Exam results management" description="Create or edit sample assessments with validated score bounds." action={<Button type="button" onClick={() => openEditor()}><Plus size={18} /> Add result</Button>} />
      <Card className="toolbar-card">
        <FormField label="Course" htmlFor="admin-results-course"><select id="admin-results-course" className="input compact-select" value={courseId} onChange={(event) => setCourseId(event.target.value)}>{state.courses.map((course) => <option key={course.id} value={course.id}>{course.code} · {course.title}</option>)}</select></FormField>
        <span className="muted">{results.length} result records</span>
      </Card>
      <Card>
        <SectionHeader title={courseLabel(state.courses.find((course) => course.id === courseId))} description="Grades are calculated from the entered percentage in this local demo." />
        {results.length ? <div className="table-wrap"><table><thead><tr><th>Student</th><th>Assessment</th><th>Score</th><th>Grade</th><th>Date</th><th aria-label="Actions" /></tr></thead><tbody>{results.map((result) => <tr key={result.id}><td>{fullName(state.students.find((student) => student.id === result.studentId))}</td><td>{result.assessment}</td><td>{result.score}/{result.maxScore}</td><td><Badge tone={result.grade.startsWith("A") ? "success" : result.grade.startsWith("B") ? "warning" : "danger"}>{result.grade}</Badge></td><td>{formatDate(result.date)}</td><td><button className="table-action" type="button" onClick={() => openEditor(result.id)}><Edit3 size={15} /> Edit</button></td></tr>)}</tbody></table></div> : <EmptyState title="No results for this course" description="Add a sample assessment record to begin." />}
      </Card>
      <Modal open={open} title={editingId ? "Edit result" : "Add result"} onClose={() => setOpen(false)}>
        <form className="modal-form form-grid" onSubmit={save} noValidate>
          <FormField label="Course" htmlFor="result-course"><select id="result-course" className="input" value={draft.courseId} onChange={(event) => setDraft({ ...draft, courseId: event.target.value })}>{state.courses.map((course) => <option key={course.id} value={course.id}>{course.code} · {course.title}</option>)}</select></FormField>
          <FormField label="Student" htmlFor="result-student"><select id="result-student" className="input" value={draft.studentId} onChange={(event) => setDraft({ ...draft, studentId: event.target.value })}>{state.students.map((student) => <option key={student.id} value={student.id}>{fullName(student)}</option>)}</select></FormField>
          <FormField label="Assessment" htmlFor="result-assessment"><input id="result-assessment" className="input" value={draft.assessment} onChange={(event) => setDraft({ ...draft, assessment: event.target.value })} placeholder="Midterm" /></FormField>
          <FormField label="Date" htmlFor="result-date"><input id="result-date" className="input" type="date" value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} /></FormField>
          <FormField label="Score" htmlFor="result-score"><input id="result-score" className="input" type="number" min="0" value={draft.score} onChange={(event) => setDraft({ ...draft, score: Number(event.target.value) })} /></FormField>
          <FormField label="Maximum score" htmlFor="result-max-score"><input id="result-max-score" className="input" type="number" min="1" value={draft.maxScore} onChange={(event) => setDraft({ ...draft, maxScore: Number(event.target.value) })} /></FormField>
          <FormField label="Term" htmlFor="result-term"><input id="result-term" className="input" value={draft.term} onChange={(event) => setDraft({ ...draft, term: event.target.value })} /></FormField>
          {error ? <div className="form-full"><Message tone="error">{error}</Message></div> : null}
          <div className="modal-actions form-full"><Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit">Save result</Button></div>
        </form>
      </Modal>
    </>
  );
};
