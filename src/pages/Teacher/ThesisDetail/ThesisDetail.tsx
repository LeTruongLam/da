import { Card, Row, Col, Tabs, Form, message, Spin } from "antd";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getThesisById,
  deleteThesis,
  type ThesisDetailResponse,
} from "@/services/api/thesis";
import EditThesisModal from "@/components/modals/EditThesisModal";

import {
  ThesisHeader,
  StudentCard,
  TasksTable,
  DocumentsTable,
  MeetingsTable,
  StudentEvaluation,
  EvaluationModal,
  TaskFeedbackModal,
  MeetingModal,
  DocumentUploadModal,
  SubtaskModal,
  DeleteConfirmModal,
} from "./components";

// Import types separately with type keyword
import type {
  Student,
  SubTask,
  Document,
  Meeting,
  MeetingFormValues,
  SubtaskFormValues,
} from "./components";

const { TabPane } = Tabs;
const PAGE_SIZE = 5;

// Extend SubTask to include feedback and score which are needed
interface ExtendedSubTask extends SubTask {
  submittedAt?: string;
  feedback?: string;
  score?: number;
}

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
];

// Mock lịch họp
const mockMeetings: Meeting[] = [
  {
    id: "1",
    title: "Họp khởi động đề tài",
    time: "2024-06-05 10:00",
    student: "Nguyễn Văn A",
    link: "https://meet.google.com/abc-defg-hij",
  },
];

// Mẫu đề tài chưa có sinh viên đăng ký

// Define the type for API response

const ThesisDetail = () => {
  const navigate = useNavigate();
  const { id: thesisId } = useParams();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "evaluate" ? "2" : "1";
  const queryClient = useQueryClient();

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
  const [currentTask, setCurrentTask] = useState<ExtendedSubTask | null>(null);
  const [currentSubtask, setCurrentSubtask] = useState<SubTask | null>(null);

  const [evaluationForm] = Form.useForm();
  const [taskFeedbackForm] = Form.useForm();
  const [meetingForm] = Form.useForm();
  const [documentForm] = Form.useForm();
  const [subtaskForm] = Form.useForm();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const [isDeleteMeetingModalVisible, setIsDeleteMeetingModalVisible] =
    useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState<Meeting | null>(null);

  const [isDeleteDocumentModalVisible, setIsDeleteDocumentModalVisible] =
    useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null
  );
  const [isDeleteThesisModalVisible, setIsDeleteThesisModalVisible] =
    useState(false);
  const [isDeletingThesis, setIsDeletingThesis] = useState(false);

  const [thesis, setThesis] = useState([]);

  // Add loading states for various API calls
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [meetingsLoading, setMeetingsLoading] = useState(false);

  const { data: thesisDataResponse, isLoading } = useQuery<
    ThesisDetailResponse,
    Error
  >({
    queryKey: ["thesis", thesisId],
    queryFn: () => getThesisById(thesisId as unknown as number),
  });

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

  const openTaskFeedbackModal = (student: Student, task: ExtendedSubTask) => {
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

  const openEditModal = () => {
    setIsEditModalVisible(true);
  };

  const openSubtaskModal = (subtask?: SubTask) => {
    if (subtask) {
      setCurrentSubtask(subtask);
      subtaskForm.setFieldsValue({
        name: subtask.name,
        description: subtask.description || "",
        startDate: subtask.startDate ? dayjs(subtask.startDate) : undefined,
        deadline: subtask.deadline ? dayjs(subtask.deadline) : undefined,
        status: subtask.status || "not_started",
      });
    } else {
      setCurrentSubtask(null);
      subtaskForm.resetFields();
      subtaskForm.setFieldsValue({
        status: "not_started",
      });
    }
    setIsSubtaskModalVisible(true);
  };

  const handleSubtaskSubmit = (values: SubtaskFormValues) => {
    const formattedValues = {
      ...values,
      startDate: values.startDate.format("YYYY-MM-DD"),
      deadline: values.deadline.format("YYYY-MM-DD"),
    };

    if (currentSubtask) {
      message.success(
        `Đã cập nhật công việc "${values.name}" với trạng thái ${values.status}`
      );
    } else {
      message.success(`Đã thêm công việc mới "${values.name}"`);
    }
    setIsSubtaskModalVisible(false);
    subtaskForm.resetFields();
  };

  const openDeleteSubtaskModal = (subtask: SubTask) => {
    setCurrentSubtask(subtask);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteSubtask = () => {
    message.success(`Đã xóa công việc "${currentSubtask?.name}"`);
    setIsDeleteModalVisible(false);
  };

  const openDeleteMeetingModal = (meeting: Meeting) => {
    setMeetingToDelete(meeting);
    setIsDeleteMeetingModalVisible(true);
  };

  const handleDeleteMeeting = () => {
    message.success(`Đã xóa lịch họp "${meetingToDelete?.title}"`);
    setIsDeleteMeetingModalVisible(false);
  };

  const openDeleteDocumentModal = (document: Document) => {
    setDocumentToDelete(document);
    setIsDeleteDocumentModalVisible(true);
  };

  const handleDeleteDocument = () => {
    message.success(`Đã xóa tài liệu "${documentToDelete?.name}"`);
    setIsDeleteDocumentModalVisible(false);
  };

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
      message.success(
        `Đã xóa đề tài "${thesisDataResponse?.title}" thành công`
      );
      queryClient.invalidateQueries({ queryKey: ["myTheses"] });
      navigate("/thesis-management");
    } catch (error) {
      console.error("Error deleting thesis:", error);
      message.error("Đã xảy ra lỗi khi xóa đề tài. Vui lòng thử lại sau.");
    } finally {
      setIsDeletingThesis(false);
      setIsDeleteThesisModalVisible(false);
    }
  };

  const handleUpdateProgress = (student: Student) => {
    message.info(`Cập nhật tiến độ cho sinh viên: ${student.name}`);
  };

  const handleCommentDocument = (document: Document) => {
    message.info(`Nhận xét tài liệu: ${document.name}`);
  };

  // Add functions to use the loading states
  const loadDocuments = () => {
    setDocumentsLoading(true);
    // Simulate API call to load documents
    setTimeout(() => {
      setDocumentsLoading(false);
    }, 800);
  };

  const loadMeetings = () => {
    setMeetingsLoading(true);
    // Simulate API call to load meetings
    setTimeout(() => {
      setMeetingsLoading(false);
    }, 800);
  };

  // Use these functions in useEffect to load data when component mounts
  useEffect(() => {
    loadDocuments();
    loadMeetings();
  }, []);

  return (
    <Spin spinning={isLoading}>
      <Card title="Chi tiết đề tài" style={{ margin: "0 auto" }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <ThesisHeader
              id={thesisDataResponse?.thesis_id.toString() || "--"}
              title={thesisDataResponse?.title || "--"}
              description={thesisDataResponse?.description || "--"}
              status={thesisDataResponse?.status || "--"}
              onEdit={openEditModal}
              onDelete={openDeleteThesisModal}
            />
          </Col>

          <Col span={24}>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="Tổng quan" key="1">
                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <StudentCard
                      student={thesis.student}
                      onEvaluate={openEvaluationModal}
                      onScheduleMeeting={openMeetingModal}
                      onAddStudent={() => navigate("/approve-requests")}
                    />
                  </Col>

                  <Col span={24}>
                    <TasksTable
                      tasks={thesis.subTasks}
                      student={thesis.student}
                      onAddTask={() => openSubtaskModal()}
                      onEditTask={openSubtaskModal}
                      onDeleteTask={openDeleteSubtaskModal}
                    />
                  </Col>

                  <Col span={12}>
                    <DocumentsTable
                      documents={mockDocuments}
                      currentPage={documentPage}
                      pageSize={PAGE_SIZE}
                      onUpload={openDocumentUploadModal}
                      onDelete={openDeleteDocumentModal}
                      onPageChange={setDocumentPage}
                      loading={documentsLoading}
                    />
                  </Col>

                  <Col span={12}>
                    <MeetingsTable
                      meetings={mockMeetings}
                      currentPage={meetingPage}
                      pageSize={PAGE_SIZE}
                      onAddMeeting={() => setIsMeetingModalVisible(true)}
                      onDeleteMeeting={openDeleteMeetingModal}
                      onPageChange={setMeetingPage}
                      loading={meetingsLoading}
                    />
                  </Col>
                </Row>
              </TabPane>

              <TabPane
                tab="Đánh giá sinh viên"
                key="2"
                disabled={!thesis.student}
              >
                <StudentEvaluation
                  student={thesis.student}
                  documents={mockDocuments}
                  onEvaluate={openEvaluationModal}
                  onScheduleMeeting={openMeetingModal}
                  onTaskFeedback={openTaskFeedbackModal}
                  onUpdateProgress={handleUpdateProgress}
                  onComment={handleCommentDocument}
                />
              </TabPane>
            </Tabs>
          </Col>
        </Row>

        {/* Modals */}
        <EvaluationModal
          visible={isEvaluationModalVisible}
          student={currentStudent}
          onCancel={() => setIsEvaluationModalVisible(false)}
          onSubmit={handleEvaluateStudent}
          form={evaluationForm}
        />

        <TaskFeedbackModal
          visible={isTaskFeedbackModalVisible}
          task={currentTask}
          onCancel={() => setIsTaskFeedbackModalVisible(false)}
          onSubmit={handleTaskFeedback}
          form={taskFeedbackForm}
        />

        <MeetingModal
          visible={isMeetingModalVisible}
          student={currentStudent}
          onCancel={() => setIsMeetingModalVisible(false)}
          onSubmit={handleScheduleMeeting}
          form={meetingForm}
        />

        <DocumentUploadModal
          visible={isDocumentUploadModalVisible}
          onCancel={() => setIsDocumentUploadModalVisible(false)}
          onSubmit={handleDocumentUpload}
          form={documentForm}
        />

        <EditThesisModal
          visible={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
        />

        <SubtaskModal
          visible={isSubtaskModalVisible}
          subtask={currentSubtask}
          onCancel={() => setIsSubtaskModalVisible(false)}
          onSubmit={handleSubtaskSubmit}
          form={subtaskForm}
        />

        {/* Confirmation Modals */}
        <DeleteConfirmModal
          visible={isDeleteModalVisible}
          title="Xác nhận xóa"
          description="Hành động này không thể hoàn tác."
          itemName={`công việc "${currentSubtask?.name}"`}
          onCancel={() => setIsDeleteModalVisible(false)}
          onConfirm={handleDeleteSubtask}
        />

        <DeleteConfirmModal
          visible={isDeleteMeetingModalVisible}
          title="Xác nhận xóa lịch họp"
          description="Hành động này không thể hoàn tác."
          itemName={`lịch họp "${meetingToDelete?.title}"`}
          onCancel={() => setIsDeleteMeetingModalVisible(false)}
          onConfirm={handleDeleteMeeting}
        />

        <DeleteConfirmModal
          visible={isDeleteDocumentModalVisible}
          title="Xác nhận xóa tài liệu"
          description="Hành động này không thể hoàn tác."
          itemName={`tài liệu "${documentToDelete?.name}"`}
          onCancel={() => setIsDeleteDocumentModalVisible(false)}
          onConfirm={handleDeleteDocument}
        />

        <DeleteConfirmModal
          visible={isDeleteThesisModalVisible}
          title="Xác nhận xóa đề tài"
          description="Tất cả thông tin liên quan đến đề tài này sẽ bị xóa vĩnh viễn."
          itemName={`đề tài "${thesisDataResponse?.title}"`}
          loading={isDeletingThesis}
          onCancel={() => setIsDeleteThesisModalVisible(false)}
          onConfirm={handleDeleteThesis}
        />
      </Card>
    </Spin>
  );
};

export default ThesisDetail;
