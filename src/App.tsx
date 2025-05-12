import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { App as AntdApp } from "antd";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
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
import { USER_ROLES } from "./lib/constants";

const App = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <AntdApp>
      <BrowserRouter>
        <Routes>
          {!user ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <Route path="/" element={<Layout />}>
              {/* Dashboard động theo vai trò */}
              {user.role === USER_ROLES.STUDENT && (
                <Route index element={<StudentDashboard />} />
              )}
              {user.role === USER_ROLES.LECTURER && (
                <Route index element={<TeacherDashboard />} />
              )}
              {user.role === USER_ROLES.ADMIN && (
                <Route index element={<UserManagement />} />
              )}

              {/* Routes cho Sinh viên */}
              {user.role === USER_ROLES.STUDENT && (
                <>
                  <Route path="thesis-list" element={<ThesisList />} />
                  <Route path="teacher-list" element={<TeacherList />} />
                  <Route path="my-thesis/:id" element={<ThesisDetail />} />
                </>
              )}

              {/* Routes cho Giảng viên */}
              {user.role === USER_ROLES.LECTURER && (
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
                  <Route
                    path="approve-requests"
                    element={<ApproveRequests />}
                  />
                  <Route
                    path="student-thesis-detail/:studentId"
                    element={<TeacherThesisDetail />}
                  />
                  <Route
                    path="meeting-approval"
                    element={<MeetingApproval />}
                  />
                </>
              )}

              {/* Routes cho Admin */}
              {user.role === USER_ROLES.ADMIN && (
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
    </AntdApp>
  );
};

export default App;
