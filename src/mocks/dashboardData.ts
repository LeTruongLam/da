// Mock data cho dashboard (dựa trên database)

export const statistics = {
  totalProjects: 24,
  completedProjects: 10,
  totalStudents: 60,
  totalLecturers: 12,
  totalMaterials: 120,
};

export const projects = Array.from({ length: 10 }).map((_, i) => ({
  key: String(i + 1),
  title: `Đề tài số ${i + 1}: Ứng dụng công nghệ ${
    i % 2 === 0 ? "AI" : "Blockchain"
  } trong giáo dục`,
  student: `Sinh viên ${String.fromCharCode(65 + i)}`,
  lecturer: `TS. Giảng viên ${String.fromCharCode(65 + i)}`,
  status: i % 3 === 0 ? "Hoàn thành" : "Đang thực hiện",
  tasks: 5 + (i % 4),
  progress: i % 3 === 0 ? 100 : 40 + ((i * 6) % 60),
}));

export const tasks = Array.from({ length: 15 }).map((_, i) => ({
  key: String(i + 1),
  name: `Công việc ${i + 1}`,
  project: `Đề tài số ${1 + (i % 10)}`,
  student: `Sinh viên ${String.fromCharCode(65 + (i % 10))}`,
  status: i % 4 === 0 ? "Hoàn thành" : "Chưa hoàn thành",
  due: `2024-06-${10 + (i % 10)}`,
}));

export const meetings = Array.from({ length: 8 }).map((_, i) => ({
  key: String(i + 1),
  time: `2024-06-${12 + i} ${9 + (i % 3)}:00`,
  student: `Sinh viên ${String.fromCharCode(65 + (i % 10))}`,
  mentor: `TS. Giảng viên ${String.fromCharCode(65 + (i % 10))}`,
  link: `https://meet.example.com/${i + 1}`,
  note: `Nội dung họp ${i + 1}`,
}));

export const notifications = Array.from({ length: 12 }).map((_, i) => ({
  key: String(i + 1),
  title:
    i % 2 === 0
      ? `Lịch họp mới với ${String.fromCharCode(65 + (i % 10))}`
      : `Cập nhật Task 'Công việc ${i + 1}'`,
  message:
    i % 2 === 0
      ? `Bạn có lịch họp mới với ${String.fromCharCode(65 + (i % 10))} vào ${
          9 + (i % 3)
        }:00 ngày 2024-06-${
          12 + (i % 10)
        }. Vui lòng chuẩn bị báo cáo tiến độ và các câu hỏi cần thảo luận trước khi tham gia buổi họp.`
      : `Task 'Công việc ${i + 1}' đã được ${
          i % 3 === 0 ? "hoàn thành" : "tạo mới"
        }. ${
          i % 3 === 0
            ? "Hãy kiểm tra kết quả và phản hồi nếu có yêu cầu chỉnh sửa."
            : "Hãy bắt đầu thực hiện công việc này và cập nhật tiến độ thường xuyên."
        }`,
  type: i % 2 === 0 ? "meeting" : "task",
  status: i % 4 === 0 ? "unread" : "read",
  sent: `2024-06-${5 + (i % 10)} ${10 + (i % 5)}:00`,
}));
