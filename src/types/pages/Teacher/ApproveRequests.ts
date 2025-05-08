export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  studentId: string;
  major: string;
  gpa: number;
}

export interface RequestData {
  id: string;
  thesisId: string;
  thesisTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  date: string;
  status: string;
  message: string;
}

export interface FeedbackFormValues {
  status: string;
  message: string;
}
