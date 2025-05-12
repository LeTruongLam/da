import {
  Card,
  Row,
  Col,
  Progress,
  Table,
  Tag,
  Pagination,
  Timeline,
  Button,
  Tabs,
  Space,
  Typography,
  Upload,
  message,
  Rate,
  Form,
  Input,
  Modal,
  DatePicker,
  Select,
  Statistic,
} from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  StarOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  FileAddOutlined,
  DownloadOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { getThesisById, deleteThesis } from "@/services/api/thesis";
import EditThesisModal from "@/components/Modals/EditThesisModal";
import { THESIS_STATUS_LABELS } from "@/lib/constants";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const PAGE_SIZE = 5;

// Định nghĩa các interfaces để tránh lỗi any
interface Student {
  id: string;
  name: string;
  studentId: string;
  progress: number;
  rating: number;
  email?: string;
  phone?: string;
  submittedTasks: SubTask[];
}

interface SubTask {
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

interface Document {
  key: string;
  name: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  url?: string;
}

interface Activity {
  key: string;
  time: string;
  action: string;
  user: string;
  details: string;
}

interface Meeting {
  title: string;
  time: string;
  student: string;
  link: string;
}

interface MeetingFormValues {
  meetingTitle: string;
  meetingDate: dayjs.Dayjs;
  meetingTime: dayjs.Dayjs;
  meetingLink: string;
}

interface ThesisData {
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

// Mock dữ liệu đề tài
const thesisData: ThesisData = {
  id: "1",
  title: "Ứng dụng AI trong giáo dục",
  description:
    "Nghiên cứu và phát triển ứng dụng AI hỗ trợ học tập trong giáo dục.",
  major: "Công nghệ thông tin",
  status: "Đang thực hiện",
  deadline: "2024-08-30",
  student: {
    id: "1",
    name: "Nguyễn Văn A",
    studentId: "20020001",
    progress: 60,
    rating: 4,
    email: "nguyenvana@example.com",
    phone: "0912345678",
    submittedTasks: [
      {
        key: "1",
        name: "Nộp đề cương",
        description:
          "Đề cương nghiên cứu, bao gồm mục tiêu, phạm vi, và phương pháp",
        startDate: "2024-06-01",
        deadline: "2024-06-15",
        status: "completed",
        submittedAt: "2024-06-12",
        feedback: "Tốt, cần bổ sung phần phương pháp nghiên cứu chi tiết hơn.",
        score: 8,
      },
      {
        key: "2",
        name: "Nộp chương 1",
        description:
          "Giới thiệu tổng quan về đề tài, tầm quan trọng và mục tiêu nghiên cứu",
        startDate: "2024-06-16",
        deadline: "2024-07-01",
        status: "completed",
        submittedAt: "2024-06-29",
        feedback:
          "Đã đáp ứng yêu cầu, tuy nhiên cần bổ sung thêm tài liệu tham khảo.",
        score: 7,
      },
      {
        key: "3",
        name: "Nộp chương 2",
        description: "Phương pháp nghiên cứu và thiết kế hệ thống",
        startDate: "2024-07-02",
        deadline: "2024-07-20",
        status: "in_progress",
        submittedAt: "2024-07-15",
        feedback: "Chưa hoàn thiện, cần bổ sung chi tiết về cấu trúc hệ thống.",
        score: 5,
      },
      {
        key: "4",
        name: "Nộp source code demo",
        description: "Source code của ứng dụng demo AI trong giáo dục",
        startDate: "2024-07-05",
        deadline: "2024-07-25",
        status: "late",
        submittedAt: "2024-07-27",
        feedback: "Code chạy được nhưng còn nhiều bugs và thiếu documentation.",
        score: 6,
      },
      {
        key: "5",
        name: "Hoàn thiện báo cáo",
        description: "Chỉnh sửa, hoàn thiện báo cáo và chuẩn bị bảo vệ",
        startDate: "2024-08-01",
        deadline: "2024-08-30",
        status: "not_started",
      },
    ],
  },
  requirements:
    "Yêu cầu sinh viên có kiến thức về Machine Learning, Python và các thư viện AI.",
  objectives:
    "Xây dựng ứng dụng demo minh họa việc ứng dụng AI trong giáo dục.",
  subTasks: [
    {
      key: "1",
      name: "Nộp đề cương",
      startDate: "2024-06-01",
      deadline: "2024-06-15",
      description:
        "Đề cương nghiên cứu, bao gồm mục tiêu, phạm vi, và phương pháp",
    },
    {
      key: "2",
      name: "Nộp chương 1",
      startDate: "2024-06-16",
      deadline: "2024-07-01",
      description:
        "Giới thiệu tổng quan về đề tài, tầm quan trọng và mục tiêu nghiên cứu",
    },
    {
      key: "3",
      name: "Nộp chương 2",
      startDate: "2024-07-02",
      deadline: "2024-07-20",
      description: "Phương pháp nghiên cứu và thiết kế hệ thống",
    },
    {
      key: "4",
      name: "Nộp source code demo",
      startDate: "2024-07-05",
      deadline: "2024-07-25",
      description: "Source code của ứng dụng demo AI trong giáo dục",
    },
    {
      key: "5",
      name: "Hoàn thiện báo cáo",
      startDate: "2024-08-01",
      deadline: "2024-08-30",
      description: "Chỉnh sửa, hoàn thiện báo cáo và chuẩn bị bảo vệ",
    },
  ],
};

// Mock lịch sử hoạt động
const mockActivities: Activity[] = [
  {
    key: "1",
    time: "2024-05-15",
    action: "Tạo đề tài",
    user: "Giảng viên",
    details: "Giảng viên tạo đề tài mới",
  },
  {
    key: "2",
    time: "2024-05-25",
    action: "Sinh viên đăng ký",
    user: "Sinh viên",
    details: "Sinh viên Nguyễn Văn A đăng ký đề tài",
  },
  {
    key: "3",
    time: "2024-05-28",
    action: "Phê duyệt đăng ký",
    user: "Giảng viên",
    details: "Giảng viên chấp nhận yêu cầu đăng ký của sinh viên Nguyễn Văn A",
  },
  {
    key: "4",
    time: "2024-06-12",
    action: "Nộp đề cương",
    user: "Sinh viên",
    details: "Sinh viên Nguyễn Văn A nộp đề cương",
  },
  {
    key: "5",
    time: "2024-06-14",
    action: "Đánh giá đề cương",
    user: "Giảng viên",
    details: "Giảng viên đánh giá đề cương với điểm 8/10",
  },
  {
    key: "6",
    time: "2024-06-29",
    action: "Nộp chương 1",
    user: "Sinh viên",
    details: "Sinh viên Nguyễn Văn A nộp báo cáo chương 1",
  },
  {
    key: "7",
    time: "2024-07-01",
    action: "Đánh giá chương 1",
    user: "Giảng viên",
    details: "Giảng viên đánh giá chương 1 với điểm 7/10",
  },
  {
    key: "8",
    time: "2024-07-10",
    action: "Lên lịch họp",
    user: "Giảng viên",
    details: "Giảng viên lên lịch họp đánh giá tiến độ ngày 15/07/2024",
  },
  {
    key: "9",
    time: "2024-07-15",
    action: "Nộp chương 2",
    user: "Sinh viên",
    details: "Sinh viên Nguyễn Văn A nộp chương 2 (bản nháp)",
  },
  {
    key: "10",
    time: "2024-07-17",
    action: "Đánh giá chương 2",
    user: "Giảng viên",
    details: "Giảng viên yêu cầu chỉnh sửa chương 2",
  },
  {
    key: "11",
    time: "2024-07-27",
    action: "Nộp source code",
    user: "Sinh viên",
    details: "Sinh viên Nguyễn Văn A nộp source code demo (trễ hạn)",
  },
  {
    key: "12",
    time: "2024-07-28",
    action: "Đánh giá source code",
    user: "Giảng viên",
    details: "Giảng viên đánh giá source code với điểm 6/10",
  },
];

// Mock dữ liệu tài liệu liên quan
const mockDocuments: Document[] = [
  // Tài liệu do giảng viên tải lên
  {
    key: "1",
    name: "Hướng dẫn thực hiện đồ án.pdf",
    type: "PDF",
    uploadedBy: "Giảng viên",
    uploadedAt: "2024-05-15",
    size: "1.2MB",
    url: "#",
  },
  {
    key: "2",
    name: "Mẫu báo cáo đồ án.docx",
    type: "Word",
    uploadedBy: "Giảng viên",
    uploadedAt: "2024-05-20",
    size: "0.8MB",
    url: "#",
  },
  // Tài liệu do sinh viên nộp
  {
    key: "3",
    name: "Đề cương đồ án.pdf",
    type: "PDF",
    uploadedBy: "Nguyễn Văn A",
    uploadedAt: "2024-06-12",
    size: "2.1MB",
    url: "#",
  },
  {
    key: "4",
    name: "Báo cáo chương 1.docx",
    type: "Word",
    uploadedBy: "Nguyễn Văn A",
    uploadedAt: "2024-06-29",
    size: "3.5MB",
    url: "#",
  },
  {
    key: "5",
    name: "Báo cáo chương 2 (nháp).docx",
    type: "Word",
    uploadedBy: "Nguyễn Văn A",
    uploadedAt: "2024-07-15",
    size: "4.2MB",
    url: "#",
  },
  {
    key: "6",
    name: "AI-Education-Demo.zip",
    type: "Zip",
    uploadedBy: "Nguyễn Văn A",
    uploadedAt: "2024-07-27",
    size: "8.7MB",
    url: "#",
  },
  {
    key: "7",
    name: "Slide thuyết trình (nháp).pptx",
    type: "PowerPoint",
    uploadedBy: "Nguyễn Văn A",
    uploadedAt: "2024-07-20",
    size: "5.3MB",
    url: "#",
  },
];

const statusColors = {
  "Đang mở": "green",
  "Đang thực hiện": "blue",
  "Đã hoàn thành": "purple",
  "Đã đóng": "red",
};

// Mock lịch họp
const mockMeetings = [
  {
    id: "1",
    title: "Họp khởi động đề tài",
    time: "2024-06-05 10:00",
    student: "Nguyễn Văn A",
    link: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "2",
    title: "Họp đánh giá đề cương",
    time: "2024-06-14 14:00",
    student: "Nguyễn Văn A",
    link: "https://meet.google.com/klm-nopq-rst",
  },
  {
    id: "3",
    title: "Họp đánh giá tiến độ giữa kỳ",
    time: "2024-07-15 14:30",
    student: "Nguyễn Văn A",
    link: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "4",
    title: "Họp chỉnh sửa chương 2",
    time: "2024-07-20 10:00",
    student: "Nguyễn Văn A",
    link: "https://meet.google.com/xyz-mnop-qrs",
  },
];

// Mẫu đề tài chưa có sinh viên đăng ký
const thesisDataNoStudent: ThesisData = {
  id: "2",
  title: "Nghiên cứu Blockchain trong lĩnh vực tài chính",
  description:
    "Phân tích và đánh giá ứng dụng của công nghệ Blockchain trong lĩnh vực tài chính, ngân hàng.",
  major: "Công nghệ thông tin",
  status: "Đang mở",
  deadline: "2024-09-30",
  student: null,
  requirements:
    "Yêu cầu sinh viên có kiến thức về Blockchain, ngôn ngữ lập trình Solidity và kiến thức cơ bản về tài chính.",
  objectives:
    "Xây dựng một hệ thống demo minh họa ứng dụng Blockchain trong giao dịch tài chính an toàn.",
  subTasks: [
    {
      key: "1",
      name: "Nộp đề cương",
      startDate: "2024-06-15",
      deadline: "2024-07-01",
      description:
        "Đề cương nghiên cứu, bao gồm mục tiêu, phạm vi, và phương pháp",
    },
    {
      key: "2",
      name: "Nộp chương 1: Tổng quan",
      startDate: "2024-07-02",
      deadline: "2024-07-20",
      description:
        "Tổng quan về công nghệ Blockchain và ứng dụng trong lĩnh vực tài chính",
    },
    {
      key: "3",
      name: "Nộp chương 2: Phân tích",
      startDate: "2024-07-21",
      deadline: "2024-08-15",
      description: "Phân tích yêu cầu và thiết kế giải pháp",
    },
    {
      key: "4",
      name: "Nộp source code demo",
      startDate: "2024-08-16",
      deadline: "2024-09-15",
      description: "Phát triển và triển khai hệ thống demo",
    },
    {
      key: "5",
      name: "Hoàn thiện báo cáo",
      startDate: "2024-09-16",
      deadline: "2024-09-30",
      description: "Hoàn thiện báo cáo và demo",
    },
  ],
};

const ThesisDetail = () => {
  const navigate = useNavigate();
  const { id: thesisId } = useParams();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "evaluate" ? "2" : "1";

  const [activityPage, setActivityPage] = useState(1);
  const [documentPage, setDocumentPage] = useState(1);
  const [meetingPage, setMeetingPage] = useState(1);
  const [activeTab, setActiveTab] = useState(initialTab);

  const [isEvaluationModalVisible, setIsEvaluationModalVisible] =
    useState(false);
  const [isTaskFeedbackModalVisible, setIsTaskFeedbackModalVisible] =
    useState(false);
  const [isMeetingModalVisible, setIsMeetingModalVisible] = useState(false);
  const [isDocumentUploadModalVisible, setIsDocumentUploadModalVisible] =
    useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isSubtaskModalVisible, setIsSubtaskModalVisible] = useState(false);

  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [currentTask, setCurrentTask] = useState<SubTask | null>(null);
  const [currentSubtask, setCurrentSubtask] = useState<SubTask | null>(null);

  const [evaluationForm] = Form.useForm();
  const [taskFeedbackForm] = Form.useForm();
  const [meetingForm] = Form.useForm();
  const [documentForm] = Form.useForm();
  const [subtaskForm] = Form.useForm();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  // Add a new state for meeting deletion confirmation
  const [isDeleteMeetingModalVisible, setIsDeleteMeetingModalVisible] =
    useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState<Meeting | null>(null);

  // Add states for document deletion and thesis deletion confirmations
  const [isDeleteDocumentModalVisible, setIsDeleteDocumentModalVisible] =
    useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null
  );
  const [isDeleteThesisModalVisible, setIsDeleteThesisModalVisible] =
    useState(false);
  const [isDeletingThesis, setIsDeletingThesis] = useState(false);

  const paged = <T,>(data: T[], page: number) =>
    data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Simulate fetching thesis by id based on the thesisId
  // In a real implementation, this would fetch from API
  // For demo, we'll toggle between the two mock datasets
  const [thesis, setThesis] = useState<ThesisData>(thesisData);

  // Toggle between thesis with student and thesis without student (for demo purposes)
  const toggleThesisDemo = () => {
    setThesis(thesis.id === "1" ? thesisDataNoStudent : thesisData);
  };

  const { data: thesisDataResponse } = useQuery({
    queryKey: ["thesis", thesisId],
    queryFn: () => getThesisById(thesisId as unknown as number),
  });

  const handleUpload = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} tải lên thành công`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} tải lên thất bại.`);
    }
  };

  const openEvaluationModal = (student: Student) => {
    setCurrentStudent(student);
    evaluationForm.setFieldsValue({
      rating: student.rating || 0,
      comment: "",
    });
    setIsEvaluationModalVisible(true);
  };

  const handleEvaluateStudent = (values: {
    rating: number;
    comment: string;
  }) => {
    message.success(
      `Đã đánh giá sinh viên ${currentStudent?.name} với số điểm ${values.rating}/5`
    );
    setIsEvaluationModalVisible(false);
    evaluationForm.resetFields();
  };

  const openTaskFeedbackModal = (student: Student, task: SubTask) => {
    setCurrentStudent(student);
    setCurrentTask(task);
    taskFeedbackForm.setFieldsValue({
      score: task.score || 0,
      feedback: task.feedback || "",
    });
    setIsTaskFeedbackModalVisible(true);
  };

  const handleTaskFeedback = (values: { score: number; feedback: string }) => {
    message.success(
      `Đã đánh giá nhiệm vụ "${currentTask?.name}" của sinh viên ${currentStudent?.name} với điểm ${values.score}`
    );
    setIsTaskFeedbackModalVisible(false);
    taskFeedbackForm.resetFields();
  };

  const openMeetingModal = (student: Student) => {
    setCurrentStudent(student);
    setIsMeetingModalVisible(true);
  };

  const handleScheduleMeeting = (values: MeetingFormValues) => {
    message.success(
      `Đã lên lịch họp với ${
        currentStudent?.name
      } vào ${values.meetingDate.format("DD/MM/YYYY HH:mm")}`
    );
    setIsMeetingModalVisible(false);
    meetingForm.resetFields();
  };

  const openDocumentUploadModal = () => {
    setIsDocumentUploadModalVisible(true);
  };

  const handleDocumentUpload = () => {
    message.success("Đã tải lên tài liệu thành công");
    setIsDocumentUploadModalVisible(false);
    documentForm.resetFields();
  };

  const getTaskStatusTag = (status?: string) => {
    if (!status) return <Tag>Chưa bắt đầu</Tag>;

    const statusConfig = {
      not_started: { color: "default", text: "Chưa bắt đầu" },
      in_progress: { color: "processing", text: "Đang thực hiện" },
      completed: { color: "success", text: "Hoàn thành" },
      late: { color: "error", text: "Trễ hạn" },
    };

    const { color, text } =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.not_started;
    return <Tag color={color}>{text}</Tag>;
  };

  // Pagination function for thesis students
  // const paginationConfig = (dataLength: number) =>
  //   dataLength > 5 ? { pageSize: 5 } : false;

  const openEditModal = () => {
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = (values: {
    title: string;
    description: string;
    requirements: string;
    objectives: string;
    major: string;
    status: string;
    deadline: dayjs.Dayjs;
  }) => {
    message.success("Đã cập nhật thông tin đề tài thành công");
    setIsEditModalVisible(false);

    // Here we would typically update the state with new thesis data
    // For demo purposes, we'll just show a success message
    console.log("Updated thesis data:", values);
  };

  // Function to handle opening the add/edit subtask modal
  const openSubtaskModal = (subtask?: SubTask) => {
    if (subtask) {
      // Edit mode
      setCurrentSubtask(subtask);
      subtaskForm.setFieldsValue({
        name: subtask.name,
        description: subtask.description || "",
        startDate: subtask.startDate ? dayjs(subtask.startDate) : undefined,
        deadline: subtask.deadline ? dayjs(subtask.deadline) : undefined,
      });
    } else {
      // Add mode
      setCurrentSubtask(null);
      subtaskForm.resetFields();
    }
    setIsSubtaskModalVisible(true);
  };

  // Function to handle submitting the subtask form
  const handleSubtaskSubmit = (values: {
    name: string;
    description: string;
    startDate: dayjs.Dayjs;
    deadline: dayjs.Dayjs;
  }) => {
    if (currentSubtask) {
      // Edit mode
      message.success(`Đã cập nhật công việc "${values.name}"`);
    } else {
      // Add mode
      message.success(`Đã thêm công việc mới "${values.name}"`);
    }
    setIsSubtaskModalVisible(false);
    subtaskForm.resetFields();

    // In a real app, you would update the database here
    console.log("Subtask data:", values);
  };

  // Function to handle deleting a subtask
  const openDeleteSubtaskModal = (subtask: SubTask) => {
    setCurrentSubtask(subtask);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteSubtask = () => {
    message.success(`Đã xóa công việc "${currentSubtask?.name}"`);
    setIsDeleteModalVisible(false);
    // In a real app, you would update the database here
  };

  // Add a function to handle opening the delete meeting modal
  const openDeleteMeetingModal = (meeting: Meeting) => {
    setMeetingToDelete(meeting);
    setIsDeleteMeetingModalVisible(true);
  };

  // Add a function to handle deleting a meeting
  const handleDeleteMeeting = () => {
    message.success(`Đã xóa lịch họp "${meetingToDelete?.title}"`);
    setIsDeleteMeetingModalVisible(false);
    // In a real app, you would update the database here
  };

  // Add functions to handle document deletion
  const openDeleteDocumentModal = (document: Document) => {
    setDocumentToDelete(document);
    setIsDeleteDocumentModalVisible(true);
  };

  const handleDeleteDocument = () => {
    message.success(`Đã xóa tài liệu "${documentToDelete?.name}"`);
    setIsDeleteDocumentModalVisible(false);
    // In a real app, you would update the database here
  };

  // Add function to handle thesis deletion confirmation
  const openDeleteThesisModal = () => {
    setIsDeleteThesisModalVisible(true);
  };

  const handleDeleteThesis = async () => {
    setIsDeletingThesis(true);
    try {
      if (!thesisId) {
        message.error("Không tìm thấy ID của đề tài");
        return;
      }

      await deleteThesis(Number(thesisId));
      message.success(`Đã xóa đề tài "${thesis.title}" thành công`);
      navigate("/thesis-management");
    } catch (error) {
      console.error("Error deleting thesis:", error);
      message.error("Đã xảy ra lỗi khi xóa đề tài. Vui lòng thử lại sau.");
    } finally {
      setIsDeletingThesis(false);
      setIsDeleteThesisModalVisible(false);
    }
  };

  return (
    <Card title="Chi tiết đề tài" style={{ maxWidth: 1200, margin: "0 auto" }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card
            type="inner"
            title={<Title level={4}>{thesisDataResponse?.title || "--"}</Title>}
            extra={
              <Space>
                <Button icon={<EditOutlined />} onClick={openEditModal}>
                  Chỉnh sửa
                </Button>
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  onClick={openDeleteThesisModal}
                >
                  Xóa
                </Button>
                <Button type="dashed" onClick={toggleThesisDemo}>
                  {thesis.student ? "Demo: Không có SV" : "Demo: Có SV"}
                </Button>
              </Space>
            }
          >
            <Row gutter={24}>
              <Col span={16}>
                <Paragraph>
                  <Text strong>Mô tả: </Text>
                  {thesisDataResponse?.description || "--"}
                </Paragraph>
              </Col>
              <Col span={8}>
                <Paragraph>
                  <Text strong>Chuyên ngành: </Text>
                  {thesisDataResponse?.major.majorName || "--"}
                </Paragraph>
                <Paragraph>
                  <Text strong>Trạng thái: </Text>
                  <Tag
                    color={
                      statusColors[thesis.status as keyof typeof statusColors]
                    }
                  >
                    {thesisDataResponse?.status
                      ? THESIS_STATUS_LABELS[
                          thesisDataResponse?.status as keyof typeof THESIS_STATUS_LABELS
                        ]
                      : "--"}
                  </Tag>
                </Paragraph>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Tổng quan" key="1">
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <Card
                    title="Sinh viên đăng ký"
                    extra={
                      !thesis.student && (
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={() => navigate("/approve-requests")}
                        >
                          Thêm sinh viên
                        </Button>
                      )
                    }
                  >
                    {thesis.student ? (
                      <Row gutter={24}>
                        <Col span={16}>
                          <Title level={5}>
                            <UserOutlined /> {thesis.student.name} (
                            {thesis.student.studentId})
                          </Title>
                          {thesis.student.email && (
                            <Paragraph>
                              <Text strong>Email: </Text>
                              {thesis.student.email}
                            </Paragraph>
                          )}
                          {thesis.student.phone && (
                            <Paragraph>
                              <Text strong>SĐT: </Text>
                              {thesis.student.phone}
                            </Paragraph>
                          )}
                        </Col>
                        <Col span={8}>
                          <div>
                            <Text strong>Tiến độ: </Text>
                            <Progress
                              percent={thesis.student.progress}
                              size="small"
                              status={
                                thesis.student.progress < 40
                                  ? "exception"
                                  : "active"
                              }
                            />
                          </div>
                          <div style={{ marginTop: 16 }}>
                            <Text strong>Đánh giá: </Text>
                            <Rate
                              disabled
                              defaultValue={thesis.student.rating}
                            />
                          </div>
                          <Space style={{ marginTop: 24 }}>
                            <Button
                              icon={<StarOutlined />}
                              onClick={() =>
                                thesis.student &&
                                openEvaluationModal(thesis.student)
                              }
                              disabled={!thesis.student}
                            >
                              Đánh giá
                            </Button>
                            <Button
                              icon={<CalendarOutlined />}
                              onClick={() =>
                                thesis.student &&
                                openMeetingModal(thesis.student)
                              }
                              disabled={!thesis.student}
                            >
                              Lịch họp
                            </Button>
                          </Space>
                        </Col>
                      </Row>
                    ) : (
                      <div style={{ textAlign: "center", padding: "30px 0" }}>
                        <p>Chưa có sinh viên đăng ký đề tài này</p>
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={() => navigate("/approve-requests")}
                        >
                          Thêm sinh viên
                        </Button>
                      </div>
                    )}
                  </Card>
                </Col>

                <Col span={24}>
                  <Card
                    title="Các công việc"
                    extra={
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => openSubtaskModal()}
                      >
                        Thêm công việc
                      </Button>
                    }
                  >
                    <Table
                      columns={[
                        {
                          title: "Tên công việc",
                          dataIndex: "name",
                          key: "name",
                          render: (text) => (
                            <Space>
                              <FileTextOutlined />
                              {text}
                            </Space>
                          ),
                        },
                        {
                          title: "Ngày bắt đầu",
                          dataIndex: "startDate",
                          key: "startDate",
                        },
                        {
                          title: "Deadline",
                          dataIndex: "deadline",
                          key: "deadline",
                        },
                        {
                          title: "Mô tả",
                          dataIndex: "description",
                          key: "description",
                          ellipsis: true,
                          width: 300,
                        },
                        {
                          title: "Trạng thái",
                          key: "status",
                          render: (_, record) => {
                            const studentTask =
                              thesis.student?.submittedTasks.find(
                                (task) => task.key === record.key
                              );
                            return studentTask ? (
                              getTaskStatusTag(studentTask.status)
                            ) : (
                              <Tag>Chưa bắt đầu</Tag>
                            );
                          },
                        },
                        {
                          title: "Thao tác",
                          key: "action",
                          render: (_, record) => (
                            <Space>
                              <Button
                                type="link"
                                icon={<EditOutlined />}
                                onClick={() => openSubtaskModal(record)}
                              >
                                Chỉnh sửa
                              </Button>
                              <Button
                                type="link"
                                icon={<DeleteOutlined />}
                                danger
                                onClick={() => openDeleteSubtaskModal(record)}
                              >
                                Xóa
                              </Button>
                            </Space>
                          ),
                        },
                      ]}
                      dataSource={thesis.subTasks}
                      pagination={false}
                      rowKey="key"
                    />
                  </Card>
                </Col>

                <Col span={12}>
                  <Card
                    title="Tài liệu"
                    extra={
                      <Button
                        type="primary"
                        icon={<FileAddOutlined />}
                        onClick={openDocumentUploadModal}
                      >
                        Tải lên
                      </Button>
                    }
                  >
                    <Table
                      columns={[
                        {
                          title: "Tên tài liệu",
                          dataIndex: "name",
                          key: "name",
                          render: (text, record) => (
                            <Space>
                              <FileTextOutlined />
                              <a
                                href={record.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {text}
                              </a>
                            </Space>
                          ),
                        },
                        { title: "Kích thước", dataIndex: "size", key: "size" },
                        {
                          title: "Thao tác",
                          key: "action",
                          render: (_, record) => (
                            <Space>
                              <Button type="link" icon={<DownloadOutlined />}>
                                Tải xuống
                              </Button>
                              <Button
                                type="link"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => openDeleteDocumentModal(record)}
                              >
                                Xóa
                              </Button>
                            </Space>
                          ),
                        },
                      ]}
                      dataSource={paged(mockDocuments, documentPage)}
                      pagination={false}
                      size="small"
                    />
                    {mockDocuments.length > PAGE_SIZE && (
                      <Pagination
                        current={documentPage}
                        total={mockDocuments.length}
                        pageSize={PAGE_SIZE}
                        onChange={setDocumentPage}
                        size="small"
                        style={{ marginTop: 16, textAlign: "right" }}
                      />
                    )}
                  </Card>
                </Col>

                <Col span={12}>
                  <Card
                    title="Lịch họp"
                    extra={
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsMeetingModalVisible(true)}
                      >
                        Đặt lịch mới
                      </Button>
                    }
                  >
                    <Table
                      columns={[
                        { title: "Tiêu đề", dataIndex: "title", key: "title" },
                        { title: "Thời gian", dataIndex: "time", key: "time" },
                        {
                          title: "Sinh viên",
                          dataIndex: "student",
                          key: "student",
                        },
                        {
                          title: "Thao tác",
                          key: "action",
                          render: (_, record) => (
                            <Space>
                              <Button
                                type="link"
                                href={record.link}
                                target="_blank"
                              >
                                Tham gia
                              </Button>
                              <Button
                                type="link"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => openDeleteMeetingModal(record)}
                              >
                                Xóa
                              </Button>
                            </Space>
                          ),
                        },
                      ]}
                      dataSource={paged(mockMeetings, meetingPage)}
                      pagination={false}
                      size="small"
                    />
                    {mockMeetings.length > PAGE_SIZE && (
                      <Pagination
                        current={meetingPage}
                        total={mockMeetings.length}
                        pageSize={PAGE_SIZE}
                        onChange={setMeetingPage}
                        size="small"
                        style={{ marginTop: 16, textAlign: "right" }}
                      />
                    )}
                  </Card>
                </Col>
              </Row>
            </TabPane>

            <TabPane
              tab="Đánh giá sinh viên"
              key="2"
              disabled={!currentStudent && thesis.student === null}
            >
              {currentStudent ? (
                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <Card>
                      <Row gutter={24}>
                        <Col span={16}>
                          <Title level={5}>
                            <UserOutlined /> {currentStudent.name} (
                            {currentStudent.studentId})
                          </Title>
                          {currentStudent.email && (
                            <Paragraph>
                              <Text strong>Email: </Text>
                              {currentStudent.email}
                            </Paragraph>
                          )}
                          {currentStudent.phone && (
                            <Paragraph>
                              <Text strong>SĐT: </Text>
                              {currentStudent.phone}
                            </Paragraph>
                          )}
                        </Col>
                        <Col span={8} style={{ textAlign: "right" }}>
                          <Space direction="vertical" align="end">
                            <div>
                              <Text strong>Đánh giá hiện tại: </Text>
                              <Rate
                                disabled
                                value={currentStudent.rating}
                                style={{ marginLeft: 8 }}
                                className={
                                  currentStudent.rating === 0
                                    ? "not-rated"
                                    : "active"
                                }
                              />
                            </div>
                            <Space style={{ marginTop: 16 }}>
                              <Button
                                type="primary"
                                icon={<StarOutlined />}
                                onClick={() =>
                                  openEvaluationModal(currentStudent)
                                }
                              >
                                Đánh giá
                              </Button>
                              <Button
                                icon={<CalendarOutlined />}
                                onClick={() => openMeetingModal(currentStudent)}
                              >
                                Lịch họp
                              </Button>
                            </Space>
                          </Space>
                        </Col>
                      </Row>
                    </Card>
                  </Col>

                  <Col span={24}>
                    <Card title="Các nhiệm vụ và tiến độ">
                      <Table
                        columns={[
                          {
                            title: "Nhiệm vụ",
                            dataIndex: "name",
                            key: "name",
                            render: (text, record) => (
                              <Space>
                                {record.status === "completed" ? (
                                  <CheckCircleOutlined
                                    style={{ color: "green" }}
                                  />
                                ) : record.status === "late" ? (
                                  <ExclamationCircleOutlined
                                    style={{ color: "red" }}
                                  />
                                ) : (
                                  <ClockCircleOutlined />
                                )}
                                {text}
                              </Space>
                            ),
                          },
                          {
                            title: "Mô tả",
                            dataIndex: "description",
                            key: "description",
                            ellipsis: true,
                            width: 200,
                          },
                          {
                            title: "Deadline",
                            dataIndex: "deadline",
                            key: "deadline",
                          },
                          {
                            title: "Ngày nộp",
                            dataIndex: "submittedAt",
                            key: "submittedAt",
                            render: (text) => text || "--",
                          },
                          {
                            title: "Trạng thái",
                            dataIndex: "status",
                            key: "status",
                            render: (status) => getTaskStatusTag(status),
                          },
                          {
                            title: "Điểm",
                            dataIndex: "score",
                            key: "score",
                            render: (score) =>
                              score !== undefined ? score : "--",
                          },
                          {
                            title: "Thao tác",
                            key: "action",
                            render: (_, record) => (
                              <Space>
                                {record.status === "completed" ||
                                record.status === "late" ? (
                                  <Button
                                    type="link"
                                    icon={<CommentOutlined />}
                                    onClick={() =>
                                      openTaskFeedbackModal(
                                        currentStudent,
                                        record
                                      )
                                    }
                                  >
                                    Đánh giá
                                  </Button>
                                ) : (
                                  <Button type="link" disabled>
                                    Chưa nộp
                                  </Button>
                                )}
                                {record.status === "completed" ||
                                record.status === "late" ? (
                                  <Button
                                    type="link"
                                    icon={<DownloadOutlined />}
                                  >
                                    Tải xuống
                                  </Button>
                                ) : null}
                              </Space>
                            ),
                          },
                        ]}
                        dataSource={currentStudent.submittedTasks}
                        pagination={false}
                        rowKey="key"
                      />
                    </Card>
                  </Col>

                  <Col span={24}>
                    <Card title="Tài liệu sinh viên đã nộp">
                      <Table
                        columns={[
                          {
                            title: "Tên tài liệu",
                            dataIndex: "name",
                            key: "name",
                            render: (text, record) => (
                              <Space>
                                <FileTextOutlined />
                                <a
                                  href={record.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {text}
                                </a>
                              </Space>
                            ),
                          },
                          {
                            title: "Loại tài liệu",
                            dataIndex: "type",
                            key: "type",
                          },
                          {
                            title: "Ngày nộp",
                            dataIndex: "uploadedAt",
                            key: "uploadedAt",
                          },
                          {
                            title: "Kích thước",
                            dataIndex: "size",
                            key: "size",
                          },
                          {
                            title: "Thao tác",
                            key: "action",
                            render: (_, record) => (
                              <Space>
                                <Button type="link" icon={<DownloadOutlined />}>
                                  Tải xuống
                                </Button>
                                <Button
                                  type="link"
                                  icon={<CommentOutlined />}
                                  onClick={() =>
                                    message.info(
                                      `Đánh giá tài liệu: ${record.name}`
                                    )
                                  }
                                >
                                  Nhận xét
                                </Button>
                              </Space>
                            ),
                          },
                        ]}
                        dataSource={mockDocuments.filter(
                          (doc) => doc.uploadedBy === currentStudent.name
                        )}
                        pagination={false}
                        rowKey="key"
                      />
                    </Card>
                  </Col>

                  <Col span={24}>
                    <Card title="Đánh giá tiến độ thực hiện đồ án">
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <Statistic
                            title="Tiến độ hoàn thành"
                            value={currentStudent.progress}
                            suffix="%"
                            valueStyle={{
                              color:
                                currentStudent.progress < 40
                                  ? "red"
                                  : currentStudent.progress < 70
                                  ? "orange"
                                  : "green",
                            }}
                          />
                          <Progress
                            percent={currentStudent.progress}
                            status={
                              currentStudent.progress < 40
                                ? "exception"
                                : "active"
                            }
                            style={{ marginTop: 8 }}
                          />
                        </Col>
                        <Col span={12}>
                          <Statistic
                            title="Số nhiệm vụ đã hoàn thành"
                            value={
                              currentStudent.submittedTasks.filter(
                                (task) => task.status === "completed"
                              ).length
                            }
                            suffix={`/ ${currentStudent.submittedTasks.length}`}
                          />
                        </Col>
                        <Col span={24} style={{ marginTop: 16 }}>
                          <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() =>
                              message.info(
                                `Cập nhật tiến độ cho sinh viên: ${currentStudent.name}`
                              )
                            }
                          >
                            Cập nhật tiến độ
                          </Button>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
              ) : (
                <div style={{ textAlign: "center", padding: "50px 0" }}>
                  <Title level={4}>
                    Vui lòng chọn sinh viên để xem chi tiết đánh giá
                  </Title>
                </div>
              )}
            </TabPane>

            <TabPane tab="Lịch sử hoạt động" key="3">
              <Card>
                <Timeline
                  items={paged(mockActivities, activityPage).map(
                    (activity) => ({
                      color: activity.user === "Giảng viên" ? "blue" : "green",
                      children: (
                        <>
                          <p>
                            <strong>{activity.action}</strong> bởi{" "}
                            {activity.user} - {activity.time}
                          </p>
                          <p>{activity.details}</p>
                        </>
                      ),
                    })
                  )}
                />
                {mockActivities.length > PAGE_SIZE && (
                  <Pagination
                    current={activityPage}
                    total={mockActivities.length}
                    pageSize={PAGE_SIZE}
                    onChange={setActivityPage}
                    style={{ marginTop: 16, textAlign: "right" }}
                  />
                )}
              </Card>
            </TabPane>
          </Tabs>
        </Col>
      </Row>

      {/* Modal đánh giá sinh viên */}
      <Modal
        title={`Đánh giá sinh viên ${currentStudent?.name}`}
        open={isEvaluationModalVisible}
        onCancel={() => setIsEvaluationModalVisible(false)}
        onOk={() => evaluationForm.submit()}
        okText="Lưu đánh giá"
        cancelText="Hủy"
      >
        <Form
          form={evaluationForm}
          layout="vertical"
          onFinish={handleEvaluateStudent}
        >
          <Form.Item
            name="rating"
            label="Đánh giá (1-5 sao)"
            rules={[{ required: true, message: "Vui lòng đánh giá" }]}
          >
            <Rate />
          </Form.Item>
          <Form.Item
            name="comment"
            label="Nhận xét"
            rules={[{ required: true, message: "Vui lòng nhập nhận xét" }]}
          >
            <TextArea rows={4} placeholder="Nhập nhận xét của bạn" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal đánh giá nhiệm vụ */}
      <Modal
        title={`Đánh giá nhiệm vụ: ${currentTask?.name}`}
        open={isTaskFeedbackModalVisible}
        onCancel={() => setIsTaskFeedbackModalVisible(false)}
        onOk={() => taskFeedbackForm.submit()}
        okText="Lưu đánh giá"
        cancelText="Hủy"
      >
        <Form
          form={taskFeedbackForm}
          layout="vertical"
          onFinish={handleTaskFeedback}
        >
          <Form.Item
            name="score"
            label="Điểm (0-10)"
            rules={[{ required: true, message: "Vui lòng cho điểm" }]}
          >
            <Select>
              {Array.from({ length: 11 }).map((_, i) => (
                <Select.Option key={i} value={i}>
                  {i}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="feedback"
            label="Nhận xét"
            rules={[{ required: true, message: "Vui lòng nhập nhận xét" }]}
          >
            <TextArea rows={4} placeholder="Nhập nhận xét của bạn" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal lên lịch họp */}
      <Modal
        title={`Đặt lịch họp với ${currentStudent?.name || "sinh viên"}`}
        open={isMeetingModalVisible}
        onCancel={() => {
          setIsMeetingModalVisible(false);
          meetingForm.resetFields();
        }}
        onOk={() => meetingForm.submit()}
        okText="Đặt lịch"
        cancelText="Hủy"
      >
        <Form
          form={meetingForm}
          layout="vertical"
          onFinish={handleScheduleMeeting}
        >
          <Form.Item
            name="meetingTitle"
            label="Tiêu đề cuộc họp"
            rules={[
              { required: true, message: "Vui lòng nhập tiêu đề cuộc họp" },
            ]}
          >
            <Input placeholder="Nhập tiêu đề cuộc họp" />
          </Form.Item>
          <Form.Item
            name="meetingDate"
            label="Thời gian"
            rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
          >
            <DatePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="meetingLink"
            label="Link Google Meet"
            rules={[
              { required: true, message: "Vui lòng nhập link Google Meet" },
            ]}
          >
            <Input placeholder="https://meet.google.com/..." />
          </Form.Item>
          <Form.Item name="description" label="Nội dung cuộc họp">
            <TextArea rows={4} placeholder="Mô tả nội dung cuộc họp" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal tải lên tài liệu */}
      <Modal
        title="Tải lên tài liệu"
        open={isDocumentUploadModalVisible}
        onCancel={() => {
          setIsDocumentUploadModalVisible(false);
          documentForm.resetFields();
        }}
        onOk={() => documentForm.submit()}
        okText="Tải lên"
        cancelText="Hủy"
      >
        <Form
          form={documentForm}
          layout="vertical"
          onFinish={handleDocumentUpload}
        >
          <Form.Item
            name="documentTitle"
            label="Tiêu đề tài liệu"
            rules={[
              { required: true, message: "Vui lòng nhập tiêu đề tài liệu" },
            ]}
          >
            <Input placeholder="Nhập tiêu đề tài liệu" />
          </Form.Item>
          <Form.Item
            name="documentType"
            label="Loại tài liệu"
            rules={[{ required: true, message: "Vui lòng chọn loại tài liệu" }]}
          >
            <Select placeholder="Chọn loại tài liệu">
              <Select.Option value="reference">
                Tài liệu tham khảo
              </Select.Option>
              <Select.Option value="template">Mẫu báo cáo</Select.Option>
              <Select.Option value="guide">Hướng dẫn</Select.Option>
              <Select.Option value="other">Khác</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="documentFile"
            label="Tập tin"
            rules={[{ required: true, message: "Vui lòng chọn tập tin" }]}
          >
            <Upload.Dragger
              name="files"
              action="/upload"
              onChange={handleUpload}
              beforeUpload={() => false}
              maxCount={1}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">
                Nhấp hoặc kéo thả tập tin vào khu vực này
              </p>
              <p className="ant-upload-hint">
                Hỗ trợ tải lên một tập tin duy nhất.
              </p>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <TextArea rows={4} placeholder="Mô tả tài liệu (không bắt buộc)" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Replace the Edit Thesis Modal with the new component */}
      <EditThesisModal
        visible={isEditModalVisible}
        thesis={thesis}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleEditSubmit}
      />

      {/* Add the Modal for adding/editing subtasks */}
      <Modal
        title={currentSubtask ? "Chỉnh sửa công việc" : "Thêm công việc mới"}
        open={isSubtaskModalVisible}
        onCancel={() => {
          setIsSubtaskModalVisible(false);
          subtaskForm.resetFields();
        }}
        onOk={() => subtaskForm.submit()}
        okText={currentSubtask ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
      >
        <Form
          form={subtaskForm}
          layout="vertical"
          onFinish={handleSubtaskSubmit}
        >
          <Form.Item
            name="name"
            label="Tên công việc"
            rules={[{ required: true, message: "Vui lòng nhập tên công việc" }]}
          >
            <Input placeholder="Nhập tên công việc" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả công việc" },
            ]}
          >
            <TextArea rows={3} placeholder="Nhập mô tả chi tiết về công việc" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Ngày bắt đầu"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày bắt đầu" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="deadline"
                label="Deadline"
                rules={[{ required: true, message: "Vui lòng chọn deadline" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Add the Modal for confirming subtask deletion */}
      <Modal
        title="Xác nhận xóa"
        open={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={handleDeleteSubtask}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa công việc "{currentSubtask?.name}"?</p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>

      {/* Add the Meeting Delete Confirmation Modal at the end of the component */}
      <Modal
        title="Xác nhận xóa lịch họp"
        open={isDeleteMeetingModalVisible}
        onCancel={() => setIsDeleteMeetingModalVisible(false)}
        onOk={handleDeleteMeeting}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa lịch họp "{meetingToDelete?.title}"?</p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>

      {/* Add Document Delete Confirmation Modal */}
      <Modal
        title="Xác nhận xóa tài liệu"
        open={isDeleteDocumentModalVisible}
        onCancel={() => setIsDeleteDocumentModalVisible(false)}
        onOk={handleDeleteDocument}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa tài liệu "{documentToDelete?.name}"?</p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>

      {/* Add Thesis Delete Confirmation Modal */}
      <Modal
        title="Xác nhận xóa đề tài"
        open={isDeleteThesisModalVisible}
        onCancel={() => setIsDeleteThesisModalVisible(false)}
        onOk={handleDeleteThesis}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true, loading: isDeletingThesis }}
        confirmLoading={isDeletingThesis}
      >
        <p>Bạn có chắc chắn muốn xóa đề tài "{thesis.title}"?</p>
        <p>Tất cả thông tin liên quan đến đề tài này sẽ bị xóa vĩnh viễn.</p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>
    </Card>
  );
};

export default ThesisDetail;
