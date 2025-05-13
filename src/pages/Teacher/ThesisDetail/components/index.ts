// Thesis info components
export { default as ThesisHeader } from "./ThesisHeader";
export { default as StudentCard } from "./StudentCard";
export { default as TasksTable } from "./TasksTable";
export { default as DocumentsTable } from "./DocumentsTable";
export { default as MeetingsTable } from "./MeetingsTable";
export { default as ActivityTimeline } from "./ActivityTimeline";
export { default as StudentEvaluation } from "./StudentEvaluation";

// Modal components
export { default as EvaluationModal } from "./EvaluationModal";
export { default as TaskFeedbackModal } from "./TaskFeedbackModal";
export { default as MeetingModal } from "./MeetingModal";
export { default as DocumentUploadModal } from "./DocumentUploadModal";
export { default as SubtaskModal } from "./SubtaskModal";
export { default as DeleteConfirmModal } from "./DeleteConfirmModal";

// Types
export type { Student } from "./StudentCard";
export type { SubTask } from "./TasksTable";
export type { Document } from "./DocumentsTable";
export type { Meeting } from "./MeetingsTable";
export type { Activity } from "./ActivityTimeline";
export type { MeetingFormValues } from "./MeetingModal";
export type { SubtaskFormValues } from "./SubtaskModal";
