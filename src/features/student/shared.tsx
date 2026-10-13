import { Badge } from "../../components/ui";
import { useDemo } from "../../context/DemoContext";
import type { ApplicationStatus, Course } from "../../data/types";

export const useStudentData = () => {
  const demo = useDemo();
  const studentId = demo.session?.userId ?? "";
  const student = demo.state.students.find((item) => item.id === studentId);
  return { ...demo, studentId, student };
};

export const applicationStatusTone = (status: ApplicationStatus): "warning" | "success" | "danger" =>
  status === "Pending" ? "warning" : status === "Approved" ? "success" : "danger";

export const CourseTitle = ({ course }: { course: Course | undefined }) => (
  <>
    {course ? (
      <>
        <strong>{course.code}</strong>
        <span>{course.title}</span>
      </>
    ) : (
      <span>Course unavailable</span>
    )}
  </>
);

export const StatusBadge = ({ status }: { status: ApplicationStatus }) => (
  <Badge tone={applicationStatusTone(status)}>{status}</Badge>
);
