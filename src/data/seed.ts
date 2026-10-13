import type { PortalState } from "./types";

export const STUDENT_DEMO_ID = "STU-1001";
export const ADMIN_DEMO_ID = "ADM-01";

export const seedPortalState: PortalState = {
  students: [
    {
      id: "STU-1001",
      studentCode: "JRN24CSE001",
      firstName: "Aarav",
      lastName: "Menon",
      email: "aarav.menon@demo.jerone.edu",
      phone: "+91 98765 21045",
      program: "B.Tech Computer Science",
      semester: "Semester 5",
      status: "Active",
      joinedDate: "2024-07-08"
    },
    {
      id: "STU-1002",
      studentCode: "JRN24CSE002",
      firstName: "Kavya",
      lastName: "Nair",
      email: "kavya.nair@demo.jerone.edu",
      phone: "+91 98765 21046",
      program: "B.Tech Computer Science",
      semester: "Semester 5",
      status: "Active",
      joinedDate: "2024-07-08"
    },
    {
      id: "STU-1003",
      studentCode: "JRN24DS003",
      firstName: "Rohan",
      lastName: "Shah",
      email: "rohan.shah@demo.jerone.edu",
      phone: "+91 98765 21047",
      program: "B.Sc Data Science",
      semester: "Semester 3",
      status: "Active",
      joinedDate: "2025-07-14"
    },
    {
      id: "STU-1004",
      studentCode: "JRN23BBA004",
      firstName: "Meera",
      lastName: "Iyer",
      email: "meera.iyer@demo.jerone.edu",
      phone: "+91 98765 21048",
      program: "BBA",
      semester: "Semester 5",
      status: "Inactive",
      joinedDate: "2023-07-11"
    }
  ],
  courses: [
    {
      id: "CRS-101",
      code: "CS501",
      title: "Distributed Systems",
      instructor: "Dr. Priya Raman",
      term: "Autumn 2026",
      credits: 4,
      capacity: 48
    },
    {
      id: "CRS-102",
      code: "CS502",
      title: "Human Computer Interaction",
      instructor: "Prof. Karan Bose",
      term: "Autumn 2026",
      credits: 3,
      capacity: 42
    },
    {
      id: "CRS-103",
      code: "CS503",
      title: "Applied Machine Learning",
      instructor: "Dr. Nisha Kapoor",
      term: "Autumn 2026",
      credits: 4,
      capacity: 40
    },
    {
      id: "CRS-104",
      code: "DS301",
      title: "Data Storytelling",
      instructor: "Prof. Vikram Das",
      term: "Autumn 2026",
      credits: 3,
      capacity: 36
    }
  ],
  enrollments: [
    { id: "ENR-001", studentId: "STU-1001", courseId: "CRS-101", schedule: "Mon & Wed · 09:00", room: "Lab 204" },
    { id: "ENR-002", studentId: "STU-1001", courseId: "CRS-102", schedule: "Tue & Thu · 11:00", room: "Block B · 312" },
    { id: "ENR-003", studentId: "STU-1001", courseId: "CRS-103", schedule: "Mon & Fri · 14:00", room: "Lab 118" },
    { id: "ENR-004", studentId: "STU-1002", courseId: "CRS-101", schedule: "Mon & Wed · 09:00", room: "Lab 204" },
    { id: "ENR-005", studentId: "STU-1002", courseId: "CRS-102", schedule: "Tue & Thu · 11:00", room: "Block B · 312" },
    { id: "ENR-006", studentId: "STU-1003", courseId: "CRS-104", schedule: "Wed & Fri · 10:00", room: "Studio 02" }
  ],
  attendance: [
    { id: "ATT-001", studentId: "STU-1001", courseId: "CRS-101", date: "2026-10-01", status: "Present" },
    { id: "ATT-002", studentId: "STU-1001", courseId: "CRS-101", date: "2026-10-03", status: "Present" },
    { id: "ATT-003", studentId: "STU-1001", courseId: "CRS-101", date: "2026-10-06", status: "Late" },
    { id: "ATT-004", studentId: "STU-1001", courseId: "CRS-101", date: "2026-10-08", status: "Absent" },
    { id: "ATT-005", studentId: "STU-1001", courseId: "CRS-102", date: "2026-10-02", status: "Present" },
    { id: "ATT-006", studentId: "STU-1001", courseId: "CRS-102", date: "2026-10-05", status: "Present" },
    { id: "ATT-007", studentId: "STU-1001", courseId: "CRS-102", date: "2026-10-07", status: "Present" },
    { id: "ATT-008", studentId: "STU-1001", courseId: "CRS-103", date: "2026-10-01", status: "Present" },
    { id: "ATT-009", studentId: "STU-1001", courseId: "CRS-103", date: "2026-10-04", status: "Absent" },
    { id: "ATT-010", studentId: "STU-1001", courseId: "CRS-103", date: "2026-10-07", status: "Present" },
    { id: "ATT-011", studentId: "STU-1002", courseId: "CRS-101", date: "2026-10-01", status: "Present" },
    { id: "ATT-012", studentId: "STU-1002", courseId: "CRS-101", date: "2026-10-03", status: "Present" },
    { id: "ATT-013", studentId: "STU-1002", courseId: "CRS-102", date: "2026-10-02", status: "Late" },
    { id: "ATT-014", studentId: "STU-1003", courseId: "CRS-104", date: "2026-10-03", status: "Present" }
  ],
  results: [
    { id: "RES-001", studentId: "STU-1001", courseId: "CRS-101", assessment: "Midterm", score: 84, maxScore: 100, grade: "A", date: "2026-09-18", term: "Autumn 2026" },
    { id: "RES-002", studentId: "STU-1001", courseId: "CRS-102", assessment: "Design Sprint", score: 44, maxScore: 50, grade: "A", date: "2026-09-24", term: "Autumn 2026" },
    { id: "RES-003", studentId: "STU-1001", courseId: "CRS-103", assessment: "Model Evaluation", score: 72, maxScore: 100, grade: "B+", date: "2026-09-29", term: "Autumn 2026" },
    { id: "RES-004", studentId: "STU-1002", courseId: "CRS-101", assessment: "Midterm", score: 91, maxScore: 100, grade: "A+", date: "2026-09-18", term: "Autumn 2026" },
    { id: "RES-005", studentId: "STU-1003", courseId: "CRS-104", assessment: "Narrative Lab", score: 38, maxScore: 50, grade: "A-", date: "2026-09-21", term: "Autumn 2026" }
  ],
  announcements: [
    {
      id: "ANN-001",
      title: "Mid-semester advising opens this week",
      category: "Academic",
      body: "Book your advising slot by Friday. Your programme coordinator will share confirmed timings in the calendar.",
      createdAt: "2026-10-08",
      author: "Academic Office",
      readBy: ["STU-1001"]
    },
    {
      id: "ANN-002",
      title: "Library extends weekend study hours",
      category: "Campus",
      body: "The central library will remain open until 20:00 on Saturdays through the assessment period.",
      createdAt: "2026-10-06",
      author: "Campus Services",
      readBy: []
    },
    {
      id: "ANN-003",
      title: "Tuition statement now available",
      category: "Finance",
      body: "Your current tuition statement is available in the Fees module. This is a demo notice and does not request payment.",
      createdAt: "2026-10-02",
      author: "Finance Office",
      readBy: ["STU-1001", "STU-1002"]
    }
  ],
  timetable: [
    { id: "TT-001", courseId: "CRS-101", day: "Monday", startTime: "09:00", endTime: "10:30", room: "Lab 204" },
    { id: "TT-002", courseId: "CRS-102", day: "Tuesday", startTime: "11:00", endTime: "12:30", room: "Block B · 312" },
    { id: "TT-003", courseId: "CRS-101", day: "Wednesday", startTime: "09:00", endTime: "10:30", room: "Lab 204" },
    { id: "TT-004", courseId: "CRS-102", day: "Thursday", startTime: "11:00", endTime: "12:30", room: "Block B · 312" },
    { id: "TT-005", courseId: "CRS-103", day: "Friday", startTime: "14:00", endTime: "15:30", room: "Lab 118" }
  ],
  fees: [
    {
      studentId: "STU-1001",
      total: 98000,
      paid: 74000,
      dueDate: "2026-11-15",
      transactions: [
        { id: "FEE-001", date: "2026-07-12", description: "Semester tuition instalment", amount: 50000, status: "Paid" },
        { id: "FEE-002", date: "2026-08-12", description: "Academic services fee", amount: 24000, status: "Paid" },
        { id: "FEE-003", date: "2026-11-15", description: "Final tuition instalment", amount: 24000, status: "Due" }
      ]
    },
    {
      studentId: "STU-1002",
      total: 98000,
      paid: 98000,
      dueDate: "2026-11-15",
      transactions: [
        { id: "FEE-004", date: "2026-07-12", description: "Semester tuition", amount: 98000, status: "Paid" }
      ]
    }
  ],
  applications: [
    {
      id: "APP-001",
      studentId: "STU-1001",
      type: "Bonafide Certificate",
      reason: "Required for a scholarship document submission.",
      status: "Pending",
      submittedAt: "2026-10-09"
    },
    {
      id: "APP-002",
      studentId: "STU-1002",
      type: "Leave Request",
      reason: "Medical appointment during the Thursday class.",
      status: "Approved",
      submittedAt: "2026-10-03",
      decisionNote: "Attendance exemption recorded for the stated date.",
      decidedAt: "2026-10-04"
    }
  ]
};
