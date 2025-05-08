import type { Dayjs } from "dayjs";

export interface Student {
  id: string;
  name: string;
  studentId: string;
  progress: number;
  rating: number;
  email?: string;
  phone?: string;
  submittedTasks: SubTask[];
}

export interface SubTask {
  key: string;
  name: string;
  description?: string;
  startDate: string;
  deadline: string;
  status?: "not_started" | "in_progress" | "completed" | "late";
  submittedAt?: string;
  feedback?: string;
  score?: number;
}

export interface Document {
  key: string;
  name: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  url?: string;
}

export interface Activity {
  key: string;
  time: string;
  action: string;
  user: string;
  details: string;
}

export interface Meeting {
  title: string;
  time: string;
  student: string;
  link: string;
}

export interface MeetingFormValues {
  meetingTitle: string;
  meetingDate: Dayjs;
  meetingTime: Dayjs;
  meetingLink: string;
}

export interface ThesisData {
  id: string;
  title: string;
  description: string;
  major: string;
  status: string;
  deadline: string;
  student: Student | null;
  requirements: string;
  objectives: string;
  subTasks: SubTask[];
}
