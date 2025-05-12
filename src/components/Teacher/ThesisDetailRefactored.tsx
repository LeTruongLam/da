/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Card, Tabs, Form, Row, Col, message } from "antd";
import { useNavigate } from "react-router-dom";
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
import { styles } from "./styles";
import { deleteThesis } from "@/services/api/thesis";

const { TabPane } = Tabs;
const PAGE_SIZE = 5;

// Example mock data for demo purposes - define here to avoid the import error
const mockDocuments = [
  // Add some mock documents here
];

const mockMeetings = [
  // Add some mock meetings here
];

const mockActivities = [
  // Add some mock activities here
];

const ThesisDetailRefactored: React.FC = () => {
  const navigate = useNavigate();

  // Tab state
  const [activeTab, setActiveTab] = useState("1");

  // Pagination states
  const [documentPage, setDocumentPage] = useState(1);
  const [meetingPage, setMeetingPage] = useState(1);
  const [activityPage, setActivityPage] = useState(1);

  // Current item states
  const [currentStudent, setCurrentStudent] = useState(thesisData.student);
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
  const [setIsEditModalVisible] = useState(false);

  // Form instances
  const [evaluationForm] = Form.useForm();
  const [taskFeedbackForm] = Form.useForm();
  const [meetingForm] = Form.useForm();
  const [documentForm] = Form.useForm();
  const [subtaskForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Thesis data state
  const [thesis, setThesis] = useState(thesisData);

  // Demo toggle
  const toggleThesisDemo = () => {
    setThesis({
      ...thesis,
      student: thesis.student ? null : thesisData.student,
    });
    setCurrentStudent(thesis.student ? null : thesisData.student);
  };

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
      // Call the deleteThesis API service
      const response: { success: boolean } = await deleteThesis(
        thesis.thesisId
      );
      if (response.success) {
        message.success(`Đã xóa đề tài "${thesis.title}"`);
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
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = (values: any) => {
    console.log("Edited thesis:", values);
    setIsEditModalVisible(false);
  };

  const handleUpload = (info: any) => {
    console.log("Upload info:", info);
  };

  return (
    <Card title="Chi tiết đề tài" style={{ maxWidth: 1200, margin: "0 auto" }}>
      <Row gutter={styles.rowGutter}>
        <Col span={24}>
          <ThesisHeader
            thesis={thesis}
            openEditModal={openEditModal}
            openDeleteThesisModal={openDeleteThesisModal}
            toggleThesisDemo={toggleThesisDemo}
          />
        </Col>

        <Col span={24}>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Tổng quan" key="1">
              <Row gutter={styles.rowGutter}>
                <Col span={24}>
                  <StudentSection
                    student={thesis.student}
                    onViewDetails={() => setActiveTab("2")}
                    onEvaluate={openEvaluationModal}
                    onScheduleMeeting={openMeetingModal}
                    onAddStudent={() => console.log("Add student")}
                  />
                </Col>

                <Col span={24}>
                  <SubtaskSection
                    subTasks={thesis.subTasks}
                    onAddSubtask={() => openSubtaskModal()}
                    onEditSubtask={openSubtaskModal}
                    onDeleteSubtask={openDeleteSubtaskModal}
                  />
                </Col>

                <Col span={12}>
                  <DocumentSection
                    documents={mockDocuments}
                    page={documentPage}
                    pageSize={PAGE_SIZE}
                    onPageChange={setDocumentPage}
                    onUpload={openDocumentUploadModal}
                    onDelete={openDeleteDocumentModal}
                  />
                </Col>

                <Col span={12}>
                  <MeetingSection
                    meetings={mockMeetings}
                    page={meetingPage}
                    pageSize={PAGE_SIZE}
                    onPageChange={setMeetingPage}
                    onAddMeeting={() => openMeetingModal(thesis.student)}
                    onDeleteMeeting={openDeleteMeetingModal}
                  />
                </Col>

                <Col span={24}>
                  <ActivityHistory
                    activities={mockActivities}
                    currentPage={activityPage}
                    pageSize={PAGE_SIZE}
                    onPageChange={setActivityPage}
                  />
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
