// lib/mockData.js

// Mock user data
export const user = {
  name: "Shubham Kasture",
  targetRole: "Aspiring Senior Frontend Engineer",
  avatarUrl: "https://i.pravatar.cc/150?u=shubham", // Placeholder avatar
};

// Mock interview history for the line chart
export const interviewHistory = [
  { id: 1, date: "Aug 15", role: "Jr. React Dev", score: 6.5 },
  { id: 2, date: "Aug 22", role: "Jr. React Dev", score: 7.0 },
  { id: 3, date: "Sep 01", role: "Frontend Dev", score: 7.2 },
  { id: 4, date: "Sep 09", role: "Frontend Dev", score: 8.0 },
  { id: 5, date: "Sep 15", role: "Python Backend", score: 7.5 },
  { id: 6, date: "Sep 22", role: "React Developer", score: 8.5 },
];

// Mock skills breakdown for the radar chart
export const skillsData = [
  { skill: "Communication", score: 8, fullMark: 10 },
  { skill: "Problem-Solving", score: 9, fullMark: 10 },
  { skill: "JavaScript", score: 8.5, fullMark: 10 },
  { skill: "React", score: 9, fullMark: 10 },
  { skill: "CSS", score: 7, fullMark: 10 },
  { skill: "System Design", score: 6, fullMark: 10 },
];