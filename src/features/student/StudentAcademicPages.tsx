import { useState } from "react";
import { FileText, GraduationCap, MapPin, Search } from "lucide-react";
import { MetricCard, ProgressBar, SectionHeader } from "../../components/data-display";
import { Badge, Card, EmptyState, FormField } from "../../components/ui";
import { PageHeader } from "../../components/layout/AppShell";
import {
  attendancePercent,
  courseLabel,
  formatDate,
  gradeTone,
  studentCourses
} from "../../lib/formatters";
import { CourseTitle, useStudentData } from "./shared";

export const StudentCoursesPage = () => {
  const { state, studentId } = useStudentData();
  const [query, setQuery] = useState("");
  const courses = studentCourses(state, studentId);
  const visible = courses.filter((course) =>
    (course.code + " " + course.title + " " + course.instructor).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <PageHeader title="My courses" description="Your active enrolments for the current academic term." />
      <Card className="toolbar-card">
        <div className="search-input"><Search size={18} /><input aria-label="Search enrolled courses" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search course, code, or instructor" /></div>
        <span className="muted">{visible.length} of {courses.length} courses</span>
      </Card>
      {visible.length ? (
        <div className="course-grid">
          {visible.map((course) => {
            const enrollment = state.enrollments.find((item) => item.studentId === studentId && item.courseId === course.id);
            return (
              <Card className="course-card" key={course.id}>
                <div className="course-card-top"><Badge tone="info">{course.code}</Badge><span>{course.credits} credits</span></div>
                <h2>{course.title}</h2>
                <p>{course.instructor}</p>
                <dl>
                  <div><dt>Schedule</dt><dd>{enrollment?.schedule}</dd></div>
                  <div><dt>Room</dt><dd>{enrollment?.room}</dd></div>
                  <div><dt>Term</dt><dd>{course.term}</dd></div>
                </dl>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState title="No courses found" description="Try a different course code, title, or instructor name." />
      )}
    </>
  );
};

export const StudentAttendancePage = () => {
  const { state, studentId } = useStudentData();
  const [courseId, setCourseId] = useState("all");
  const courses = studentCourses(state, studentId);
  const records = state.attendance
    .filter((record) => record.studentId === studentId && (courseId === "all" || record.courseId === courseId))
    .sort((left, right) => right.date.localeCompare(left.date));
  const overall = attendancePercent(records);

  return (
    <>
      <PageHeader title="Attendance" description="A local demonstration of course-level attendance records." />
      <div className="attendance-hero">
        <Card className="attendance-score">
          <span className="score-label">Overall in selected view</span>
          <strong className="score-value">{overall}%</strong>
          <p className="score-detail">Present and late are counted as attended.</p>
          <ProgressBar value={overall} tone={overall >= 75 ? "teal" : "amber"} />
        </Card>
        <Card>
          <SectionHeader title="Filter records" description="Change the course to update the calculation and log." />
          <FormField label="Course" htmlFor="attendance-course">
            <select id="attendance-course" className="input" value={courseId} onChange={(event) => setCourseId(event.target.value)}>
              <option value="all">All enrolled courses</option>
              {courses.map((course) => <option key={course.id} value={course.id}>{course.code} · {course.title}</option>)}
            </select>
          </FormField>
        </Card>
      </div>
      <Card>
        <SectionHeader title="Attendance log" description={records.length + " records shown"} />
        {records.length ? (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Date</th><th>Course</th><th>Status</th></tr></thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td>{formatDate(record.date)}</td>
                    <td>{courseLabel(state.courses.find((course) => course.id === record.courseId))}</td>
                    <td><Badge tone={record.status === "Absent" ? "danger" : record.status === "Late" ? "warning" : "success"}>{record.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No attendance records" description="No records match the selected course." />
        )}
      </Card>
    </>
  );
};

export const StudentResultsPage = () => {
  const { state, studentId } = useStudentData();
  const [query, setQuery] = useState("");
  const results = state.results
    .filter((result) => result.studentId === studentId)
    .filter((result) => (result.assessment + " " + courseLabel(state.courses.find((course) => course.id === result.courseId))).toLowerCase().includes(query.toLowerCase()))
    .sort((left, right) => right.date.localeCompare(left.date));
  const average = results.length
    ? Math.round(results.reduce((sum, result) => sum + (result.score / result.maxScore) * 100, 0) / results.length)
    : 0;

  return (
    <>
      <PageHeader title="Exam results" description="Sample academic results for the current term. Grades are demo values, not official records." />
      <div className="metric-grid compact-metrics">
        <MetricCard label="Average score" value={average + "%"} detail="Across visible assessments" icon={<GraduationCap size={21} />} tone="indigo" />
        <MetricCard label="Assessments" value={results.length} detail="Results in this term" icon={<FileText size={21} />} tone="teal" />
      </div>
      <Card>
        <div className="table-toolbar">
          <SectionHeader title="Assessment record" description="Search by course or assessment." />
          <div className="search-input compact-search"><Search size={18} /><input aria-label="Search exam results" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search results" /></div>
        </div>
        {results.length ? (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Course</th><th>Assessment</th><th>Score</th><th>Grade</th><th>Date</th></tr></thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id}>
                    <td>{courseLabel(state.courses.find((course) => course.id === result.courseId))}</td>
                    <td>{result.assessment}</td>
                    <td><strong>{result.score}/{result.maxScore}</strong></td>
                    <td><Badge tone={gradeTone(result.grade)}>{result.grade}</Badge></td>
                    <td>{formatDate(result.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No results found" description="Try a different search term." />
        )}
      </Card>
    </>
  );
};

export const StudentAnnouncementsPage = () => {
  const { state, studentId, markAnnouncementRead } = useStudentData();
  const [category, setCategory] = useState("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const notices = state.announcements.filter((announcement) => category === "All" || announcement.category === category);

  const toggle = (id: string) => {
    const next = openId === id ? null : id;
    setOpenId(next);
    if (next) markAnnouncementRead(id, studentId);
  };

  return (
    <>
      <PageHeader title="Announcements" description="Institutional notices shared in this frontend demo." />
      <div className="filter-row" aria-label="Filter announcements">
        {["All", "Academic", "Campus", "Finance", "General"].map((item) => (
          <button type="button" className={"filter-chip " + (category === item ? "filter-chip-active" : "")} key={item} onClick={() => setCategory(item)}>{item}</button>
        ))}
      </div>
      <div className="announcement-list">
        {notices.map((announcement) => {
          const isOpen = openId === announcement.id;
          const unread = !announcement.readBy.includes(studentId);
          return (
            <Card className={"announcement-card " + (unread ? "announcement-unread" : "")} key={announcement.id}>
              <button className="announcement-summary" type="button" onClick={() => toggle(announcement.id)} aria-expanded={isOpen}>
                <div><Badge tone={announcement.category === "Finance" ? "warning" : "info"}>{announcement.category}</Badge>{unread ? <span className="unread-marker">New</span> : null}</div>
                <h2>{announcement.title}</h2>
                <p>{formatDate(announcement.createdAt)} · {announcement.author}</p>
              </button>
              {isOpen ? <div className="announcement-body"><p>{announcement.body}</p></div> : null}
            </Card>
          );
        })}
      </div>
      {!notices.length ? <EmptyState title="No announcements in this category" description="Choose another category to see the latest notices." /> : null}
    </>
  );
};

export const StudentTimetablePage = () => {
  const { state, studentId } = useStudentData();
  const courses = studentCourses(state, studentId);
  const entries = state.timetable.filter((entry) => courses.some((course) => course.id === entry.courseId));
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <>
      <PageHeader title="Timetable" description="Your weekly class schedule for Autumn 2026." />
      <Card className="timetable-card">
        <div className="timetable-grid">
          {days.map((day) => (
            <div className="timetable-day" key={day}>
              <h2>{day}</h2>
              {entries.filter((entry) => entry.day === day).map((entry) => {
                const course = state.courses.find((item) => item.id === entry.courseId);
                return (
                  <div className="timetable-entry" key={entry.id}>
                    <span>{entry.startTime}–{entry.endTime}</span>
                    <strong>{course?.code}</strong>
                    <p>{course?.title}</p>
                    <small><MapPin size={13} /> {entry.room}</small>
                  </div>
                );
              })}
              {!entries.some((entry) => entry.day === day) ? <p className="no-class">No scheduled class</p> : null}
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <SectionHeader title="At a glance" description="A compact list for narrow screens and quick checking." />
        <div className="agenda-list">
          {entries.map((entry) => {
            const course = state.courses.find((item) => item.id === entry.courseId);
            return (
              <div className="agenda-item" key={entry.id}>
                <span className="agenda-day">{entry.day.slice(0, 3)}</span>
                <div><CourseTitle course={course} /><small>{entry.startTime}–{entry.endTime} · {entry.room}</small></div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
};
