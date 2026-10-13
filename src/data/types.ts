export type UserRole = "student" | "admin";
export type AttendanceStatus = "Present" | "Absent" | "Late";
export type ApplicationStatus = "Pending" | "Approved" | "Rejected";

export interface DemoSession {
  role: UserRole;
  userId: string;
  createdAt: string;
}

export interface Student {
  id: string;
  studentCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  program: string;
  semester: string;
  status: "Active" | "Inactive";
  joinedDate: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  instructor: string;
  term: string;
  credits: number;
  capacity: number;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  schedule: string;
  room: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  courseId: string;
  date: string;
  status: AttendanceStatus;
}

export interface ExamResult {
  id: string;
  studentId: string;
  courseId: string;
  assessment: string;
  score: number;
  maxScore: number;
  grade: string;
  date: string;
  term: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: "Academic" | "Campus" | "Finance" | "General";
  body: string;
  createdAt: string;
  author: string;
  readBy: string[];
}

export interface TimetableEntry {
  id: string;
  courseId: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  startTime: string;
  endTime: string;
  room: string;
}

export interface FeeTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "Paid" | "Due";
}

export interface FeeSummary {
  studentId: string;
  total: number;
  paid: number;
  dueDate: string;
  transactions: FeeTransaction[];
}

export interface StudentApplication {
  id: string;
  studentId: string;
  type: "ID Card Replacement" | "Bonafide Certificate" | "Leave Request";
  reason: string;
  status: ApplicationStatus;
  submittedAt: string;
  decisionNote?: string;
  decidedAt?: string;
}

export interface PortalState {
  students: Student[];
  courses: Course[];
  enrollments: Enrollment[];
  attendance: AttendanceRecord[];
  results: ExamResult[];
  announcements: Announcement[];
  timetable: TimetableEntry[];
  fees: FeeSummary[];
  applications: StudentApplication[];
}

export interface CourseInput {
  code: string;
  title: string;
  instructor: string;
  term: string;
  credits: number;
  capacity: number;
}

export interface ResultInput {
  studentId: string;
  courseId: string;
  assessment: string;
  score: number;
  maxScore: number;
  date: string;
  term: string;
}
