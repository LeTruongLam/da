import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import StudentDashboard from "@/pages/Student/Dashboard";
import TeacherDashboard from "@/pages/Teacher/Dashboard";
import ThesisList from "@/pages/Student/ThesisList";
import ThesisDetail from "@/pages/Student/ThesisDetail";
import ThesisManagement from "@/pages/Teacher/ThesisManagement";
import CreateThesis from "@/pages/Teacher/CreateThesis";
import UserManagement from "@/pages/Admin/UserManagement";
import SystemSettings from "@/pages/Admin/SystemSettings";
import ApproveRequests from "@/pages/Teacher/ApproveRequests";
import TeacherThesisDetail from "@/pages/Teacher/ThesisDetail";
import TeacherList from "@/pages/Student/TeacherList";
import MeetingApproval from "@/pages/Teacher/MeetingApproval";
import SystemNotifications from "@/pages/Admin/SystemNotifications";

const App = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        {!user ? (
          <Route path="*" element={<Login />} />
        ) : (
          <Route path="/" element={<Layout />}>
            {/* Dashboard động theo vai trò */}
            {user.role === "student" && (
              <Route index element={<StudentDashboard />} />
            )}
            {user.role === "teacher" && (
              <Route index element={<TeacherDashboard />} />
            )}
            {user.role === "admin" && (
              <Route index element={<UserManagement />} />
            )}

            {/* Routes cho Sinh viên */}
            {user.role === "student" && (
              <>
                <Route path="thesis-list" element={<ThesisList />} />
                <Route path="teacher-list" element={<TeacherList />} />
                <Route path="my-thesis/:id" element={<ThesisDetail />} />
              </>
            )}

            {/* Routes cho Giảng viên */}
            {user.role === "teacher" && (
              <>
                <Route
                  path="thesis-management"
                  element={<ThesisManagement />}
                />
                <Route path="create-thesis" element={<CreateThesis />} />
                <Route
                  path="thesis-detail/:id"
                  element={<TeacherThesisDetail />}
                />
                <Route path="approve-requests" element={<ApproveRequests />} />
                <Route
                  path="student-thesis-detail/:studentId"
                  element={<TeacherThesisDetail />}
                />
                <Route path="meeting-approval" element={<MeetingApproval />} />
              </>
            )}

            {/* Routes cho Admin */}
            {user.role === "admin" && (
              <>
                <Route path="user-management" element={<UserManagement />} />
                <Route path="system-settings" element={<SystemSettings />} />
                <Route
                  path="system-notifications"
                  element={<SystemNotifications />}
                />
              </>
            )}

            {/* Redirect về trang chủ nếu không tìm thấy route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
