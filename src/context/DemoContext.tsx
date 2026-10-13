import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren
} from "react";
import { ADMIN_DEMO_ID, STUDENT_DEMO_ID } from "../data/seed";
import { repository } from "../data/mockRepository";
import type {
  Announcement,
  ApplicationStatus,
  AttendanceStatus,
  CourseInput,
  DemoSession,
  PortalState,
  ResultInput,
  Student,
  StudentApplication,
  UserRole
} from "../data/types";

interface DemoContextValue {
  state: PortalState;
  session: DemoSession | null;
  signIn: (role: UserRole) => void;
  logout: () => void;
  resetDemoData: () => void;
  updateStudent: (studentId: string, patch: Partial<Student>) => void;
  saveCourse: (courseId: string | null, input: CourseInput) => void;
  setAttendance: (studentId: string, courseId: string, date: string, status: AttendanceStatus) => void;
  saveResult: (resultId: string | null, input: ResultInput) => void;
  saveAnnouncement: (
    announcementId: string | null,
    input: Omit<Announcement, "id" | "readBy" | "createdAt">
  ) => void;
  deleteAnnouncement: (announcementId: string) => void;
  markAnnouncementRead: (announcementId: string, studentId: string) => void;
  createApplication: (input: Pick<StudentApplication, "studentId" | "type" | "reason">) => void;
  decideApplication: (applicationId: string, status: ApplicationStatus, decisionNote?: string) => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export const DemoProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<PortalState>(() => repository.getState());
  const [session, setSession] = useState<DemoSession | null>(() => repository.getSession());

  const refresh = (nextState?: PortalState) => setState(nextState ?? repository.getState());

  const value = useMemo<DemoContextValue>(
    () => ({
      state,
      session,
      signIn: (role) => {
        const nextSession: DemoSession = {
          role,
          userId: role === "student" ? STUDENT_DEMO_ID : ADMIN_DEMO_ID,
          createdAt: new Date().toISOString()
        };
        repository.setSession(nextSession);
        setSession(nextSession);
      },
      logout: () => {
        repository.clearSession();
        setSession(null);
      },
      resetDemoData: () => refresh(repository.resetDemoData()),
      updateStudent: (studentId, patch) => refresh(repository.updateStudent(studentId, patch)),
      saveCourse: (courseId, input) => refresh(repository.saveCourse(courseId, input)),
      setAttendance: (studentId, courseId, date, status) =>
        refresh(repository.setAttendance(studentId, courseId, date, status)),
      saveResult: (resultId, input) => refresh(repository.saveResult(resultId, input)),
      saveAnnouncement: (announcementId, input) =>
        refresh(repository.saveAnnouncement(announcementId, input)),
      deleteAnnouncement: (announcementId) => refresh(repository.deleteAnnouncement(announcementId)),
      markAnnouncementRead: (announcementId, studentId) =>
        refresh(repository.markAnnouncementRead(announcementId, studentId)),
      createApplication: (input) => refresh(repository.createApplication(input)),
      decideApplication: (applicationId, status, decisionNote) =>
        refresh(repository.decideApplication(applicationId, status, decisionNote))
    }),
    [state, session]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
};

export const useDemo = (): DemoContextValue => {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useDemo must be used within DemoProvider.");
  return context;
};
