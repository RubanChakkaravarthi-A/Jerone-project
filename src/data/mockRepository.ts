import { seedPortalState } from "./seed";
import type {
  Announcement,
  ApplicationStatus,
  AttendanceStatus,
  Course,
  CourseInput,
  DemoSession,
  PortalState,
  ResultInput,
  Student,
  StudentApplication
} from "./types";

const DATA_KEY = "jprn.portal.state.v1";
const SESSION_KEY = "jprn.portal.session.v1";
const SESSION_MAX_AGE_MS = 30 * 60 * 1000;

let memoryState: PortalState | undefined;
let memorySession: DemoSession | null | undefined;

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const canUseStorage = (): boolean =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const safeRead = <T,>(key: string): T | null => {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const safeWrite = <T,>(key: string, value: T): void => {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The portal stays usable even when browser storage is unavailable.
  }
};

const readState = (): PortalState => {
  const stored = safeRead<PortalState>(DATA_KEY);
  if (stored && Array.isArray(stored.students) && Array.isArray(stored.courses)) {
    return stored;
  }
  if (!memoryState) memoryState = clone(seedPortalState);
  return memoryState;
};

const writeState = (state: PortalState): PortalState => {
  const snapshot = clone(state);
  memoryState = snapshot;
  safeWrite(DATA_KEY, snapshot);
  return clone(snapshot);
};

const nextId = (prefix: string, ids: string[]): string => {
  const maximum = ids.reduce((highest, id) => {
    const value = Number(id.replace(/\D/g, ""));
    return Number.isFinite(value) ? Math.max(highest, value) : highest;
  }, 0);
  return prefix + String(maximum + 1).padStart(3, "0");
};

const gradeFor = (score: number, maxScore: number): string => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  return "F";
};

export const repository = {
  getState(): PortalState {
    return clone(readState());
  },

  resetDemoData(): PortalState {
    return writeState(clone(seedPortalState));
  },

  getSession(): DemoSession | null {
    const session = safeRead<DemoSession>(SESSION_KEY) ?? memorySession ?? null;
    if (!session) return null;
    if (Date.now() - new Date(session.createdAt).getTime() > SESSION_MAX_AGE_MS) {
      this.clearSession();
      return null;
    }
    return clone(session);
  },

  setSession(session: DemoSession): DemoSession {
    memorySession = clone(session);
    safeWrite(SESSION_KEY, memorySession);
    return clone(memorySession);
  },

  clearSession(): void {
    memorySession = null;
    if (canUseStorage()) {
      try {
        window.localStorage.removeItem(SESSION_KEY);
      } catch {
        // Ignore browser privacy-mode storage failures.
      }
    }
  },

  updateStudent(studentId: string, patch: Partial<Student>): PortalState {
    const state = readState();
    const target = state.students.find((student) => student.id === studentId);
    if (!target) throw new Error("Student record not found.");
    Object.assign(target, patch);
    return writeState(state);
  },

  createStudent(input: Omit<Student, "id" | "studentCode" | "joinedDate">): PortalState {
    const state = readState();
    const id = nextId("STU-", state.students.map((student) => student.id));
    const code = "JRN" + new Date().getFullYear() + input.program.slice(0, 3).toUpperCase() + String(state.students.length + 1).padStart(3, "0");
    state.students.push({ ...input, id, studentCode: code, joinedDate: new Date().toISOString().slice(0, 10) });
    return writeState(state);
  },

  saveCourse(courseId: string | null, input: CourseInput): PortalState {
    const state = readState();
    const normalizedCode = input.code.trim().toUpperCase();
    if (!normalizedCode || !input.title.trim() || !input.instructor.trim()) {
      throw new Error("Course code, title, and instructor are required.");
    }
    if (input.credits < 1 || input.capacity < 1) {
      throw new Error("Credits and capacity must be positive values.");
    }
    const collision = state.courses.find(
      (course) => course.code.toUpperCase() === normalizedCode && course.id !== courseId
    );
    if (collision) throw new Error("A course already uses this course code.");
    if (courseId) {
      const target = state.courses.find((course) => course.id === courseId);
      if (!target) throw new Error("Course not found.");
      Object.assign(target, { ...input, code: normalizedCode });
    } else {
      const id = nextId("CRS-", state.courses.map((course) => course.id));
      state.courses.push({ ...input, id, code: normalizedCode });
    }
    return writeState(state);
  },

  setAttendance(studentId: string, courseId: string, date: string, status: AttendanceStatus): PortalState {
    const state = readState();
    const existing = state.attendance.find(
      (record) => record.studentId === studentId && record.courseId === courseId && record.date === date
    );
    if (existing) {
      existing.status = status;
    } else {
      state.attendance.push({
        id: nextId("ATT-", state.attendance.map((record) => record.id)),
        studentId,
        courseId,
        date,
        status
      });
    }
    return writeState(state);
  },

  saveResult(resultId: string | null, input: ResultInput): PortalState {
    if (!input.assessment.trim() || !input.date || !input.term.trim()) {
      throw new Error("Assessment, date, and term are required.");
    }
    if (input.maxScore <= 0 || input.score < 0 || input.score > input.maxScore) {
      throw new Error("Score must be between zero and the maximum score.");
    }
    const state = readState();
    const payload = { ...input, assessment: input.assessment.trim(), term: input.term.trim(), grade: gradeFor(input.score, input.maxScore) };
    if (resultId) {
      const target = state.results.find((result) => result.id === resultId);
      if (!target) throw new Error("Result record not found.");
      Object.assign(target, payload);
    } else {
      state.results.push({
        id: nextId("RES-", state.results.map((result) => result.id)),
        ...payload
      });
    }
    return writeState(state);
  },

  saveAnnouncement(announcementId: string | null, input: Omit<Announcement, "id" | "readBy" | "createdAt">): PortalState {
    const state = readState();
    if (!input.title.trim() || !input.body.trim()) {
      throw new Error("Announcement title and message are required.");
    }
    if (announcementId) {
      const target = state.announcements.find((announcement) => announcement.id === announcementId);
      if (!target) throw new Error("Announcement not found.");
      target.title = input.title.trim();
      target.category = input.category;
      target.body = input.body.trim();
      target.author = input.author.trim() || "Academic Office";
    } else {
      state.announcements.unshift({
        id: nextId("ANN-", state.announcements.map((announcement) => announcement.id)),
        title: input.title.trim(),
        category: input.category,
        body: input.body.trim(),
        author: input.author.trim() || "Academic Office",
        createdAt: new Date().toISOString().slice(0, 10),
        readBy: []
      });
    }
    return writeState(state);
  },

  deleteAnnouncement(announcementId: string): PortalState {
    const state = readState();
    state.announcements = state.announcements.filter((announcement) => announcement.id !== announcementId);
    return writeState(state);
  },

  markAnnouncementRead(announcementId: string, studentId: string): PortalState {
    const state = readState();
    const target = state.announcements.find((announcement) => announcement.id === announcementId);
    if (!target) throw new Error("Announcement not found.");
    if (!target.readBy.includes(studentId)) target.readBy.push(studentId);
    return writeState(state);
  },

  createApplication(input: Pick<StudentApplication, "studentId" | "type" | "reason">): PortalState {
    if (!input.reason.trim() || input.reason.trim().length < 12) {
      throw new Error("Please provide at least 12 characters explaining the request.");
    }
    const state = readState();
    state.applications.unshift({
      id: nextId("APP-", state.applications.map((application) => application.id)),
      studentId: input.studentId,
      type: input.type,
      reason: input.reason.trim(),
      status: "Pending",
      submittedAt: new Date().toISOString().slice(0, 10)
    });
    return writeState(state);
  },

  decideApplication(applicationId: string, status: ApplicationStatus, decisionNote?: string): PortalState {
    const state = readState();
    const target = state.applications.find((application) => application.id === applicationId);
    if (!target) throw new Error("Application not found.");
    if (status === "Rejected" && !decisionNote?.trim()) {
      throw new Error("A short reason is required when rejecting a request.");
    }
    target.status = status;
    target.decisionNote = decisionNote?.trim() || (status === "Approved" ? "Approved in this local demo." : undefined);
    target.decidedAt = new Date().toISOString().slice(0, 10);
    return writeState(state);
  }
};

export const getCourse = (state: PortalState, courseId: string): Course | undefined =>
  state.courses.find((course) => course.id === courseId);
