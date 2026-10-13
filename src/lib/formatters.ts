import type { AttendanceRecord, Course, PortalState, Student } from "../data/types";

export const formatDate = (value: string): string =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value + "T12:00:00"));

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);

export const fullName = (student: Student | undefined): string =>
  student ? student.firstName + " " + student.lastName : "Unknown student";

export const courseLabel = (course: Course | undefined): string =>
  course ? course.code + " · " + course.title : "Unknown course";

export const initials = (name: string): string =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export const attendancePercent = (records: AttendanceRecord[]): number => {
  if (!records.length) return 0;
  const attended = records.filter((record) => record.status !== "Absent").length;
  return Math.round((attended / records.length) * 100);
};

export const gradeTone = (grade: string): "success" | "warning" | "danger" => {
  if (grade.startsWith("A")) return "success";
  if (grade.startsWith("B") || grade.startsWith("C")) return "warning";
  return "danger";
};

export const studentCourses = (state: PortalState, studentId: string): Course[] =>
  state.enrollments
    .filter((enrollment) => enrollment.studentId === studentId)
    .map((enrollment) => state.courses.find((course) => course.id === enrollment.courseId))
    .filter((course): course is Course => Boolean(course));

export const latestDate = (): string => new Date().toISOString().slice(0, 10);
