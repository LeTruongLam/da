import { Card, Row, Col, Tabs, Form, message, Spin } from "antd";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
  StudentEvaluation,
  EvaluationModal,
  TaskFeedbackModal,
  DocumentUploadModal,
  DeleteConfirmModal,
} from "./components";

// Import types separately with type keyword
import type { Student, SubTask, Document } from "./components";
import { getTasks } from "@/services/api/task";

const { TabPane } = Tabs;
const PAGE_SIZE = 5;

// Extend SubTask to include feedback and score which are needed
interface ExtendedSubTask extends SubTask {
  submittedAt?: string;
  feedback?: string;
  score?: number;
}

const ThesisDetail = () => {
  const navigate = useNavigate();
  const { id: thesisId } = useParams();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "evaluate" ? "2" : "1";
  const queryClient = useQueryClient();

  const [documentPage, setDocumentPage] = useState(1);
  const [activeTab, setActiveTab] = useState(initialTab);

  const [isEvaluationModalVisible, setIsEvaluationModalVisible] =
    useState(false);
  const [isTaskFeedbackModalVisible, setIsTaskFeedbackModalVisible] =
    useState(false);
  const [isDocumentUploadModalVisible, setIsDocumentUploadModalVisible] =
    useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [currentTask, setCurrentTask] = useState<ExtendedSubTask | null>(null);

  const [evaluationForm] = Form.useForm();
  const [taskFeedbackForm] = Form.useForm();
  const [documentForm] = Form.useForm();

  const [isDeleteDocumentModalVisible, setIsDeleteDocumentModalVisible] =
    useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null
  );
  const [isDeleteThesisModalVisible, setIsDeleteThesisModalVisible] =
    useState(false);
  const [isDeletingThesis, setIsDeletingThesis] = useState(false);

  const [thesis, setThesis] = useState<ThesisDetailResponse | null>(null);

  // Add loading states for various API calls
  const [documentsLoading, setDocumentsLoading] = useState(false);

  const { data: thesisDataResponse, isLoading } = useQuery<
    ThesisDetailResponse,
    Error
  >({
    queryKey: ["thesis", thesisId],
    queryFn: () => getThesisById(thesisId as unknown as number),
  });

  const {
    data: tasksData,
    isLoading: tasksLoading,
    refetch: refetchTasks,
  } = useQuery({
    queryKey: ["tasks", thesisId],
    queryFn: async () => {
      const response = await getTasks();
      return response;
    },
  });

  useEffect(() => {
    if (thesisDataResponse) {
      setThesis(thesisDataResponse);
    }
  }, [thesisDataResponse]);

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

  // Use these functions in useEffect to load data when component mounts
  useEffect(() => {
    loadDocuments();
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
                      onEvaluate={openEvaluationModal}
                      onAddStudent={() => navigate("/approve-requests")}
                    />
                  </Col>

                  <Col span={24}>
                    <TasksTable
                      tasks={tasksData || []}
                      refetchTasks={refetchTasks}
                      tasksLoading={tasksLoading}
                    />
                  </Col>

                  <Col span={24}>
                    <DocumentsTable
                      documents={thesis?.materials || []}
                      currentPage={documentPage}
                      pageSize={PAGE_SIZE}
                      onUpload={openDocumentUploadModal}
                      onDelete={openDeleteDocumentModal}
                      onPageChange={setDocumentPage}
                      loading={documentsLoading}
                    />
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab="Đánh giá sinh viên" key="2">
                <StudentEvaluation
                  student={null}
                  documents={[]}
                  onEvaluate={openEvaluationModal}
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
