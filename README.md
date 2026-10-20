# JPRN — Smart Dashboard Portal

A premium, frontend-only demo for Student and Admin management. This project showcases a refined educational SaaS interface with local-first data persistence.

## 🚀 Features

### Student Experience
- **Personalized Dashboard**: Overview of attendance, courses, fees, and requests.
- **Academic Records**: Detailed views for courses, attendance logs, and exam results.
- **Communications**: Institutional announcements with read/unread tracking.
- **Planning**: Weekly academic timetable.
- **Financials**: Fee summary and payment history overview.
- **Student Services**: Application system for certificates, ID replacements, and leave requests.

### Administrator Experience
- **Institutional Overview**: High-level stats on students, courses, and pending requests.
- **Student Management**: Search, filter, and edit student records.
- **Course Management**: Full CRUD operations for the course catalogue.
- **Academic Operations**: Update attendance and record exam results for any student.
- **Communications**: Create and manage institutional announcements.
- **Request Processing**: Review, approve, or reject student applications.
- **System Settings**: Local demo data reset.

## 🛠 Tech Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Custom CSS Design System (Tokens + Globals)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Data**: Local Mock Repository with `localStorage` persistence

## 📖 How to Explore

### Installation & Launch
\`\`\`bash
npm install
npm run dev
\`\`\`

### Demo Roles
Use the login page to enter the portal:
- **Student Demo**: \`student@JPRN.demo\` / \`JPRN2026\`
- **Admin Demo**: \`admin@JPRN.demo\` / \`JPRN2026\`

### Data Persistence
All changes made during the session (e.g., updating a profile, approving a request) are saved to the browser's \`localStorage\`. To return to the original seed state, use the **Reset local demo data** action in the Admin Settings.

## ⚠️ Project Scope Note
**This is a frontend-only demonstration.** 
- No real backend or database is connected.
- No live authentication or real account security is implemented.
- No real payment processing is active.
- Data is not shared across different browsers or devices.
