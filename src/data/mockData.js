export const MOCK_STUDENTS = [
  {
    id: "STU-2024-089",
    studentId: "2024CS1089",
    name: "Aarav Sharma",
    email: "aarav.sharma@college.edu",
    rollNumber: "24-CS-089",
    department: "Computer Science & Engineering",
    course: "B.Tech in CSE (AI & ML)",
    semester: "6th Semester (Year 3, Section B)",
    contactNumber: "+91 98765 43210",
    parentContact: "+91 98111 22233",
    address: "Room 304, Block C, Campus Boys Hostel, College Road",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    mentor: "Prof. Ananya Desai",
    hod: "Dr. Vikram Mehta",
    warden: "Mr. Suresh Rao",
    leaveBalances: {
      Casual: { total: 10, used: 0, remaining: 10, color: "accent-purple" },
      Medical: { total: 12, used: 0, remaining: 12, color: "accent-blue" },
      Emergency: { total: 5, used: 0, remaining: 5, color: "accent-pink" }
    }
  }
];

export const MOCK_SUBJECTS = [
  { id: "cs401", name: "CS401: Advanced Operating Systems", faculty: "Dr. R. Gupta" },
  { id: "cs402", name: "CS402: Compiler Design & Optimization", faculty: "Prof. M. Verma" },
  { id: "cs403", name: "CS403: Deep Learning & Neural Networks", faculty: "Dr. S. Kulkarni" },
  { id: "cs404", name: "CS404: Modern Web Architecture", faculty: "Prof. P. Nair" },
  { id: "cs405", name: "CS405: Cloud & DevOps Systems Lab", faculty: "Mr. D. Joshi" }
];

export const MOCK_AUTHORITIES = [
  { id: "mentor", name: "Class Mentor (Prof. Ananya Desai)", role: "Class Mentor", email: "ananya.d@college.edu" },
  { id: "hod", name: "HOD CSE (Dr. Vikram Mehta)", role: "HOD", email: "vikram.m@college.edu" },
  { id: "warden", name: "Hostel Warden (Mr. Suresh Rao)", role: "Warden", email: "suresh.r@college.edu" }
];

export const INITIAL_LEAVE_APPLICATIONS = [];

