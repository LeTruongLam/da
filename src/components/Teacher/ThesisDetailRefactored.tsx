/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Card, Tabs, Form, Row, Col, message, Spin, Empty } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import {
  ThesisHeader,
  StudentSection,
  SubtaskSection,
  DocumentSection,
  MeetingSection,
  ActivityHistory,
  StudentEvaluation,
  EvaluationModal,
  TaskFeedbackModal,
  MeetingModal,
  DocumentUploadModal,
  SubtaskModal,
  ConfirmationModal,
} from "./";
import { deleteThesis } from "@/services/api/thesis";

const { TabPane } = Tabs;
const PAGE_SIZE = 5;

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

// Define interfaces used in child components
interface DocumentType {
  key: string;
  name: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  url?: string;
}

interface MeetingType {
  key: string;
  id: string;
  title: string;
  time: string;
  student: string;
  link: string;
}

interface ActivityType {
  key: string;
  time: string;
  action: string;
  user: string;
  details: string;
}

interface ThesisData {
  thesisId: number;
  id: string;
  title: string;
  description: string;
  student: {
    id: string;
    name: string;
    email: string;
    studentId: string;
    progress: number;
    rating: number;
    submittedTasks: SubTask[];
  } | null;
  status: string;
  deadline: string;
  major: string;
  requirements: string;
  objectives: string;
}

const ThesisDetailRefactored: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  // Tab state
  const [activeTab, setActiveTab] = useState("1");

  // Pagination states
  const [documentPage, setDocumentPage] = useState(1);
  const [meetingPage, setMeetingPage] = useState(1);
  const [activityPage, setActivityPage] = useState(1);

  // Current item states
  const [currentStudent, setCurrentStudent] = useState<any>(null);
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [currentSubtask, setCurrentSubtask] = useState<any>(null);
  const [documentToDelete, setDocumentToDelete] = useState<any>(null);
  const [meetingToDelete, setMeetingToDelete] = useState<any>(null);

  // Modal visibility states
  const [isEvaluationModalVisible, setIsEvaluationModalVisible] =
    useState(false);
  const [isTaskFeedbackModalVisible, setIsTaskFeedbackModalVisible] =
    useState(false);
  const [isMeetingModalVisible, setIsMeetingModalVisible] = useState(false);
  const [isDocumentUploadModalVisible, setIsDocumentUploadModalVisible] =
    useState(false);
  const [isSubtaskModalVisible, setIsSubtaskModalVisible] = useState(false);
  const [isDeleteSubtaskModalVisible, setIsDeleteSubtaskModalVisible] =
    useState(false);
  const [isDeleteDocumentModalVisible, setIsDeleteDocumentModalVisible] =
    useState(false);
  const [isDeleteMeetingModalVisible, setIsDeleteMeetingModalVisible] =
    useState(false);
  const [isDeleteThesisModalVisible, setIsDeleteThesisModalVisible] =
    useState(false);

  // Form instances
  const [evaluationForm] = Form.useForm();
  const [taskFeedbackForm] = Form.useForm();
  const [meetingForm] = Form.useForm();
  const [documentForm] = Form.useForm();
  const [subtaskForm] = Form.useForm();

  // Fetch thesis data
  const { data: thesis, isLoading: thesisLoading } = useQuery({
    queryKey: ["thesis", id],
    queryFn: () => {
      if (!id) return null;
      // Replace with mock data
      return Promise.resolve<ThesisData>({
        thesisId: 1,
        id: id,
        title: "Phát triển ứng dụng web",
        description: "Mô tả đề tài...",
        student: {
          id: "S001",
          name: "Nguyễn Văn A",
          email: "student@example.com",
          studentId: "SV001",
          progress: 60,
          rating: 4,
          submittedTasks: [],
        },
        status: "in_progress",
        deadline: "2024-09-30",
        major: "Công nghệ thông tin",
        requirements: "Yêu cầu...",
        objectives: "Mục tiêu...",
      });
    },
    enabled: !!id,
  });

  // Fetch documents with mock data
  const { data: documents = [], isLoading: documentsLoading } = useQuery<
    DocumentType[]
  >({
    queryKey: ["documents", id],
    queryFn: () => {
      if (!id) return [];
      // Mock data for documents
      return Promise.resolve<DocumentType[]>([
        {
          key: "1",
          name: "Đề cương đồ án.pdf",
          type: "PDF",
          uploadedBy: "Nguyễn Văn A",
          uploadedAt: "2024-06-12",
          size: "2.1MB",
          url: "#",
        },
        {
          key: "2",
          name: "Báo cáo chương 1.docx",
          type: "DOCX",
          uploadedBy: "Nguyễn Văn A",
          uploadedAt: "2024-06-29",
          size: "3.5MB",
          url: "#",
        },
      ]);
    },
    enabled: !!id,
  });

  // Fetch meetings with mock data
  const { data: meetings = [], isLoading: meetingsLoading } = useQuery<
    MeetingType[]
  >({
    queryKey: ["meetings", id],
    queryFn: () => {
      if (!id) return [];
      // Mock data for meetings
      return Promise.resolve<MeetingType[]>([
        {
          key: "1",
          id: "1",
          title: "Họp khởi động đề tài",
          time: "2024-06-05 10:00",
          student: "Nguyễn Văn A",
          link: "https://meet.google.com/abc-defg-hij",
        },
        {
          key: "2",
          id: "2",
          title: "Họp đánh giá tiến độ",
          time: "2024-07-15 14:30",
          student: "Nguyễn Văn A",
          link: "https://meet.google.com/xyz-mnop-qrs",
        },
      ]);
    },
    enabled: !!id,
  });

  // Fetch activities with mock data
  const { data: activities = [], isLoading: activitiesLoading } = useQuery<
    ActivityType[]
  >({
    queryKey: ["activities", id],
    queryFn: () => {
      if (!id) return [];
      // Mock data for activities
      return Promise.resolve<ActivityType[]>([
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
          details:
            "Giảng viên chấp nhận yêu cầu đăng ký của sinh viên Nguyễn Văn A",
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
      ]);
    },
    enabled: !!id,
  });

  // Handler functions
  const openEvaluationModal = (student: any) => {
    setCurrentStudent(student);
    evaluationForm.setFieldsValue({
      rating: student.rating || 0,
      comment: "",
    });
    setIsEvaluationModalVisible(true);
  };

  const handleEvaluateStudent = (values: any) => {
    console.log("Evaluated student:", values);
    setIsEvaluationModalVisible(false);
  };

  const openTaskFeedbackModal = (student: any, task: any) => {
    setCurrentStudent(student);
    setCurrentTask(task);
    taskFeedbackForm.setFieldsValue({
      score: task.score || 0,
      feedback: task.feedback || "",
    });
    setIsTaskFeedbackModalVisible(true);
  };

  const handleTaskFeedback = (values: any) => {
    console.log("Task feedback:", values);
    setIsTaskFeedbackModalVisible(false);
  };

  const openMeetingModal = (student: any) => {
    setCurrentStudent(student);
    setIsMeetingModalVisible(true);
  };

  const handleScheduleMeeting = (values: any) => {
    console.log("Schedule meeting:", values);
    setIsMeetingModalVisible(false);
  };

  const openDocumentUploadModal = () => {
    setIsDocumentUploadModalVisible(true);
  };

  const handleDocumentUpload = () => {
    console.log("Document uploaded");
    setIsDocumentUploadModalVisible(false);
  };

  const openSubtaskModal = (subtask?: any) => {
    if (subtask) {
      setCurrentSubtask(subtask);
      subtaskForm.setFieldsValue({
        name: subtask.name,
        description: subtask.description || "",
        startDate: subtask.startDate ? new Date(subtask.startDate) : undefined,
        deadline: subtask.deadline ? new Date(subtask.deadline) : undefined,
      });
    } else {
      setCurrentSubtask(null);
      subtaskForm.resetFields();
    }
    setIsSubtaskModalVisible(true);
  };

  const handleSubtaskSubmit = (values: any) => {
    console.log("Subtask submitted:", values);
    setIsSubtaskModalVisible(false);
  };

  const openDeleteSubtaskModal = (subtask: any) => {
    setCurrentSubtask(subtask);
    setIsDeleteSubtaskModalVisible(true);
  };

  const handleDeleteSubtask = () => {
    console.log("Deleted subtask:", currentSubtask);
    setIsDeleteSubtaskModalVisible(false);
  };

  const openDeleteDocumentModal = (document: any) => {
    setDocumentToDelete(document);
    setIsDeleteDocumentModalVisible(true);
  };

  const handleDeleteDocument = () => {
    console.log("Deleted document:", documentToDelete);
    setIsDeleteDocumentModalVisible(false);
  };

  const openDeleteMeetingModal = (meeting: any) => {
    setMeetingToDelete(meeting);
    setIsDeleteMeetingModalVisible(true);
  };

  const handleDeleteMeeting = () => {
    console.log("Deleted meeting:", meetingToDelete);
    setIsDeleteMeetingModalVisible(false);
  };

  const openDeleteThesisModal = () => {
    setIsDeleteThesisModalVisible(true);
  };

  const handleDeleteThesis = async () => {
    try {
      if (!thesis) return;
      // Call the deleteThesis API service
      const response: { success: boolean } = await deleteThesis(
        thesis.thesisId
      );
      if (response.success) {
        message.success(`Đã xóa đề tài "${thesis.title}"`);
        // Invalidate the myTheses query to refresh the list when navigating back
        queryClient.invalidateQueries({ queryKey: ["myTheses"] });
        navigate("/thesis-management");
      } else {
        message.error("Không thể xóa đề tài. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Error deleting thesis:", error);
      message.error("Đã xảy ra lỗi khi xóa đề tài. Vui lòng thử lại sau.");
    } finally {
      setIsDeleteThesisModalVisible(false);
    }
  };

  const openEditModal = () => {
    // This function is likely supposed to be defined elsewhere
    console.log("Edit modal should be opened");
  };

  const handleUpload = (info: any) => {
    console.log("Upload info:", info);
  };

  if (thesisLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" tip="Đang tải thông tin đồ án..." />
      </div>
    );
  }

  if (!thesis) {
    return (
      <Empty
        description="Không tìm thấy thông tin đồ án"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <Card title="Chi tiết đề tài" style={{ maxWidth: 1200, margin: "0 auto" }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <ThesisHeader
            thesis={thesis}
            openEditModal={openEditModal}
            openDeleteThesisModal={openDeleteThesisModal}
          />
        </Col>

        <Col span={24}>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Tổng quan" key="1">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  {thesis.student ? (
                    <StudentSection
                      student={thesis.student}
                      onViewDetails={() => setActiveTab("2")}
                      onEvaluate={openEvaluationModal}
                      onScheduleMeeting={openMeetingModal}
                      onAddStudent={() => console.log("Add student")}
                    />
                  ) : (
                    <Empty description="Chưa có sinh viên đăng ký đề tài này" />
                  )}
                </Col>

                <Col span={24}>
                  {documentsLoading ? (
                    <Spin tip="Đang tải tài liệu..." />
                  ) : (
                    <SubtaskSection
                      subTasks={[]}
                      onAddSubtask={() => openSubtaskModal()}
                      onEditSubtask={openSubtaskModal}
                      onDeleteSubtask={openDeleteSubtaskModal}
                    />
                  )}
                </Col>

                <Col span={12}>
                  {documentsLoading ? (
                    <Spin tip="Đang tải tài liệu..." />
                  ) : (
                    <DocumentSection
                      documents={documents}
                      page={documentPage}
                      pageSize={PAGE_SIZE}
                      onPageChange={setDocumentPage}
                      onUpload={openDocumentUploadModal}
                      onDelete={openDeleteDocumentModal}
                    />
                  )}
                </Col>

                <Col span={12}>
                  {meetingsLoading ? (
                    <Spin tip="Đang tải lịch họp..." />
                  ) : (
                    <MeetingSection
                      meetings={meetings}
                      page={meetingPage}
                      pageSize={PAGE_SIZE}
                      onPageChange={setMeetingPage}
                      onAddMeeting={() =>
                        thesis.student && openMeetingModal(thesis.student)
                      }
                      onDeleteMeeting={openDeleteMeetingModal}
                    />
                  )}
                </Col>

                <Col span={24}>
                  {activitiesLoading ? (
                    <Spin tip="Đang tải hoạt động..." />
                  ) : (
                    <ActivityHistory
                      activities={activities}
                      currentPage={activityPage}
                      pageSize={PAGE_SIZE}
                      onPageChange={setActivityPage}
                    />
                  )}
                </Col>
              </Row>
            </TabPane>

            <TabPane
              tab="Đánh giá sinh viên"
              key="2"
              disabled={!thesis.student}
            >
              {thesis.student && (
                <StudentEvaluation
                  student={thesis.student}
                  onEvaluate={openEvaluationModal}
                  onScheduleMeeting={openMeetingModal}
                  onTaskFeedback={openTaskFeedbackModal}
                />
              )}
            </TabPane>
          </Tabs>
        </Col>
      </Row>

      {/* Modals */}
      <EvaluationModal
        visible={isEvaluationModalVisible}
        onCancel={() => setIsEvaluationModalVisible(false)}
        form={evaluationForm}
        student={currentStudent}
        onFinish={handleEvaluateStudent}
      />

      <TaskFeedbackModal
        visible={isTaskFeedbackModalVisible}
        onCancel={() => setIsTaskFeedbackModalVisible(false)}
        form={taskFeedbackForm}
        task={currentTask}
        onFinish={handleTaskFeedback}
      />

      <MeetingModal
        visible={isMeetingModalVisible}
        onCancel={() => setIsMeetingModalVisible(false)}
        form={meetingForm}
        student={currentStudent}
        onFinish={handleScheduleMeeting}
      />

      <DocumentUploadModal
        visible={isDocumentUploadModalVisible}
        onCancel={() => setIsDocumentUploadModalVisible(false)}
        form={documentForm}
        onFinish={handleDocumentUpload}
        handleUpload={handleUpload}
      />

      <SubtaskModal
        visible={isSubtaskModalVisible}
        onCancel={() => setIsSubtaskModalVisible(false)}
        form={subtaskForm}
        currentSubtask={currentSubtask}
        onFinish={handleSubtaskSubmit}
      />

      <ConfirmationModal
        visible={isDeleteSubtaskModalVisible}
        onCancel={() => setIsDeleteSubtaskModalVisible(false)}
        onConfirm={handleDeleteSubtask}
        title="Xác nhận xóa công việc"
        content={`Bạn có chắc chắn muốn xóa công việc "${currentSubtask?.name}" không?`}
      />

      <ConfirmationModal
        visible={isDeleteDocumentModalVisible}
        onCancel={() => setIsDeleteDocumentModalVisible(false)}
        onConfirm={handleDeleteDocument}
        title="Xác nhận xóa tài liệu"
        content={`Bạn có chắc chắn muốn xóa tài liệu "${documentToDelete?.name}" không?`}
      />

      <ConfirmationModal
        visible={isDeleteMeetingModalVisible}
        onCancel={() => setIsDeleteMeetingModalVisible(false)}
        onConfirm={handleDeleteMeeting}
        title="Xác nhận xóa lịch họp"
        content={`Bạn có chắc chắn muốn xóa lịch họp "${meetingToDelete?.title}" không?`}
      />

      <ConfirmationModal
        visible={isDeleteThesisModalVisible}
        onCancel={() => setIsDeleteThesisModalVisible(false)}
        onConfirm={handleDeleteThesis}
        title="Xác nhận xóa đề tài"
        content={`Bạn có chắc chắn muốn xóa đề tài "${thesis.title}" không?`}
      />
    </Card>
  );
};

export default ThesisDetailRefactored;
