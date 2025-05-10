// Mock API service for the thesis management system
import { message } from "antd";
import { API_CONFIG } from "./api/config";

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  department?: string;
  studentId?: string;
  teacherId?: string;
}

interface Thesis {
  id: string;
  title: string;
  description: string;
  supervisor: {
    id: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    expertise: string;
  };
  students?: Array<{
    id: string;
    name: string;
    email: string;
    studentId: string;
  }>;
  status: string;
  deadline: string;
  objectives: string;
  requirements: string;
  progress?: number;
  createdAt: string;
}

interface Meeting {
  id: string;
  title: string;
  purpose: string;
  date: string;
  time: string;
  thesisId: string;
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  status: string;
  link?: string;
  createdAt: string;
}

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    name: "Sinh viên",
    email: "student@example.edu.vn",
    role: "student",
    studentId: "SV001",
  },
  {
    id: "2",
    name: "Giảng viên",
    email: "teacher@example.edu.vn",
    role: "teacher",
    department: "Công nghệ thông tin",
    teacherId: "GV001",
  },
  {
    id: "3",
    name: "Admin",
    email: "admin@example.edu.vn",
    role: "admin",
  },
];

const mockTheses: Thesis[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `thesis${i + 1}`,
  title: `Đề tài nghiên cứu ${i + 1}: ${
    i % 3 === 0
      ? "Ứng dụng AI trong giáo dục"
      : i % 3 === 1
      ? "Phát triển ứng dụng IoT"
      : "Xây dựng mô hình học máy"
  }`,
  description: `Mô tả chi tiết về đề tài nghiên cứu ${i + 1}`,
  supervisor: {
    id: "2",
    name: "TS. Nguyễn Văn A",
    email: "nguyenvana@example.edu.vn",
    phone: "0987654321",
    department: "Công nghệ thông tin",
    expertise: "Trí tuệ nhân tạo, Học máy",
  },
  students:
    i < 5
      ? [
          {
            id: "1",
            name: "Sinh viên",
            email: "student@example.edu.vn",
            studentId: "SV001",
          },
        ]
      : [],
  status: i < 3 ? "in_progress" : i < 7 ? "available" : "completed",
  deadline: `2024-${9 + (i % 3)}-${10 + (i % 20)}`,
  objectives: `Mục tiêu của đề tài nghiên cứu ${i + 1}`,
  requirements: `Yêu cầu của đề tài nghiên cứu ${i + 1}`,
  progress: i < 3 ? Math.floor(Math.random() * 100) : 0,
  createdAt: `2024-0${1 + (i % 6)}-${1 + (i % 28)}`,
}));

const mockMeetings: Meeting[] = [
  {
    id: "meeting1",
    title: "Thảo luận về đề cương",
    purpose: "Thảo luận các nội dung sẽ thực hiện trong đề tài",
    date: "2024-07-15",
    time: "14:30",
    thesisId: "thesis1",
    teacherId: "2",
    teacherName: "TS. Nguyễn Văn A",
    studentId: "1",
    studentName: "Sinh viên",
    status: "approved",
    link: "https://meet.google.com/abc-defg-hij",
    createdAt: "2024-07-10",
  },
  {
    id: "meeting2",
    title: "Báo cáo tiến độ chương 1",
    purpose: "Trình bày kết quả chương 1 và kế hoạch tiếp theo",
    date: "2024-07-25",
    time: "10:00",
    thesisId: "thesis1",
    teacherId: "2",
    teacherName: "TS. Nguyễn Văn A",
    studentId: "1",
    studentName: "Sinh viên",
    status: "pending",
    createdAt: "2024-07-12",
  },
];

const mockTeachers = Array.from({ length: 10 }).map((_, i) => ({
  id: `teacher${i + 1}`,
  name: `TS. ${i % 2 === 0 ? "Nguyễn" : "Trần"} ${
    i % 3 === 0 ? "Văn" : i % 3 === 1 ? "Thị" : "Minh"
  } ${String.fromCharCode(65 + i)}`,
  email: `teacher${i + 1}@example.edu.vn`,
  phone: `098765432${i}`,
  department:
    i % 3 === 0
      ? "Công nghệ thông tin"
      : i % 3 === 1
      ? "Khoa học máy tính"
      : "Kỹ thuật phần mềm",
  expertise:
    i % 4 === 0
      ? "Trí tuệ nhân tạo, Học máy"
      : i % 4 === 1
      ? "IoT, Edge Computing"
      : i % 4 === 2
      ? "An toàn thông tin, Blockchain"
      : "Xử lý ngôn ngữ tự nhiên, Big Data",
  thesisCount: Math.floor(Math.random() * 5) + 1,
  availableSlots: Math.floor(Math.random() * 3) + 1,
}));

// Mock API service
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  // Auth
  login: async (email: string, password: string): Promise<User> => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Email hoặc mật khẩu không đúng");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Thesis
  getTheses: async (): Promise<Thesis[]> => {
    await delay(800);
    return mockTheses.filter((thesis) => thesis.status === "available");
  },

  getMyTheses: async (studentId: string): Promise<Thesis[]> => {
    await delay(800);
    return mockTheses.filter(
      (thesis) =>
        thesis.students?.some((student) => student.id === studentId) &&
        thesis.status === "in_progress"
    );
  },

  getTeacherTheses: async (teacherId: string): Promise<Thesis[]> => {
    await delay(800);
    return mockTheses.filter((thesis) => thesis.supervisor.id === teacherId);
  },

  registerThesis: async (
    thesisId: string,
    studentId: string
  ): Promise<void> => {
    await delay(800);
    // In a real app, you would update the thesis object
    message.success(
      "Đăng ký đề tài thành công! Vui lòng chờ giảng viên xác nhận."
    );
  },

  // Teachers
  getTeachers: async (): Promise<any[]> => {
    await delay(800);
    return mockTeachers;
  },

  // Meetings
  getMeetings: async (studentId: string): Promise<Meeting[]> => {
    await delay(800);
    return mockMeetings.filter((meeting) => meeting.studentId === studentId);
  },

  getTeacherMeetings: async (teacherId: string): Promise<Meeting[]> => {
    await delay(800);
    return mockMeetings.filter((meeting) => meeting.teacherId === teacherId);
  },

  scheduleMeeting: async (
    title: string,
    purpose: string,
    date: string,
    time: string,
    thesisId: string,
    teacherId: string,
    teacherName: string,
    studentId: string,
    studentName: string
  ): Promise<void> => {
    await delay(800);
    // In a real app, you would create a new meeting
    mockMeetings.push({
      id: `meeting${mockMeetings.length + 1}`,
      title,
      purpose,
      date,
      time,
      thesisId,
      teacherId,
      teacherName,
      studentId,
      studentName,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
  },

  approveMeeting: async (
    meetingId: string,
    meetingLink: string
  ): Promise<void> => {
    await delay(800);
    // In a real app, you would update the meeting
    const meeting = mockMeetings.find((m) => m.id === meetingId);
    if (meeting) {
      meeting.status = "approved";
      meeting.link = meetingLink;
    }
  },

  rejectMeeting: async (meetingId: string): Promise<void> => {
    await delay(800);
    // In a real app, you would update the meeting
    const meeting = mockMeetings.find((m) => m.id === meetingId);
    if (meeting) {
      meeting.status = "rejected";
    }
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    await delay(800);
    return mockUsers;
  },
};
