export interface Meeting {
  id: string;
  title: string;
  purpose: string;
  date: string;
  time: string;
  thesisId: string;
  thesisTitle: string;
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  status: string;
  link?: string;
  feedback?: string;
}

export interface UpdateMeetingValues {
  status: string;
  link?: string;
  feedback?: string;
}
