// File: UserManagement.tsx

import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Upload,
  Col,
  Row,
  Spin,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  USER_ROLE_LABELS,
  USER_ROLE_COLORS,
  TABLE_PAGE_SIZE,
} from "../../lib/constants";
import {
  getExternalLecturers,
  getInternalLecturers,
} from "@/services/api/teacher";
import { getStudents } from "@/services/api/student";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { createUser, importUsersExcel } from "@/services/api";

interface UserForm {
  email: string;
  name: string;
  role_id: number;
  password: string;
  code: string;
  semester: number;
  year: number;
}

interface UserRecord {
  user_id: number;
  name: string;
  email: string;
  role_name: string;
  isRevoke: boolean;
}

const UserManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importData, setImportData] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [isImporting, setIsImporting] = useState(false);

  const { data: users = [], isLoading } = useQuery<UserRecord[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const [internalLecturers, externalLecturers, students] =
        await Promise.all([
          getInternalLecturers(),
          getExternalLecturers(),
          getStudents(),
        ]);
      return [...internalLecturers, ...externalLecturers, ...students];
    },
  });

  const createUserMutation = useMutation({
    mutationFn: (values: UserForm) => {
      const data = {
        email: values.email,
        password: values.password,
        name: values.name,
        code: values.code,
        isRevoke: false,
        revoke_reason: "",
        semester: values.semester,
        year: values.year,
        role_id: values.role_id,
      };
      return createUser(data);
    },
    onSuccess: () => {
      message.success("Tạo người dùng thành công!");
      setIsModalOpen(false);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });

  const resetImportState = () => {
    setIsImportModalOpen(false);
    setSelectedFile(null);
    setImportData([]);
  };

  const { mutate: importUsers } = useMutation({
    mutationFn: async () => {
      const data = JSON.stringify(importData);
      return importUsersExcel(data);
    },
    onMutate: () => setIsImporting(true),
    onSuccess: () => {
      message.success("Import dữ liệu thành công!");
      resetImportState();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      message.error("Import dữ liệu thất bại!");
      console.error(error);
    },
    onSettled: () => setIsImporting(false),
  });

  const handleImportExcel = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        setImportData(jsonData);
        setIsImportModalOpen(true);
      } catch (error) {
        console.error("Lỗi khi đọc file:", error);
        message.error("Có lỗi xảy ra khi đọc file!");
      }
    };
    reader.readAsArrayBuffer(file);
    return false;
  };

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role_name",
      key: "role_name",
      render: (role: string) => {
        const color = USER_ROLE_COLORS[role] || "gray";
        const text = USER_ROLE_LABELS[role] || role;
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_: any, record: UserRecord) => (
        <Tag color={record.isRevoke ? "red" : "green"}>
          {record.isRevoke ? "Đã bị khóa" : "Hoạt động"}
        </Tag>
      ),
    },
  ];

  return (
    <Card
      title="Quản lý người dùng"
      extra={
        <Space>
          <Upload
            key={selectedFile ? selectedFile.name : "upload"}
            accept=".xlsx,.xls"
            showUploadList={false}
            beforeUpload={handleImportExcel}
          >
            <Button icon={<UploadOutlined />}>Import Excel</Button>
          </Upload>
          {selectedFile && (
            <Button type="primary" onClick={() => importUsers()} loading={isImporting}>
              Xác nhận
            </Button>
          )}
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Thêm người dùng
          </Button>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={users}
        loading={isLoading || isImporting}
        rowKey="user_id"
        pagination={{ pageSize: TABLE_PAGE_SIZE }}
      />

      <Modal
        title="Xác nhận Import"
        open={isImportModalOpen}
        onOk={() => importUsers()}
        onCancel={resetImportState}
        confirmLoading={isImporting}
        width={800}
      >
        <Spin spinning={isImporting} tip="Đang import dữ liệu...">
          <Table
            dataSource={importData}
            columns={[
              { title: "Email", dataIndex: "email", key: "email" },
              { title: "Họ tên", dataIndex: "name", key: "name" },
              { title: "Mật khẩu", dataIndex: "password", key: "password" },
            ]}
            pagination={false}
            scroll={{ y: 400 }}
            rowKey={(record) => record.email}
          />
        </Spin>
      </Modal>

      <Modal
        title="Thêm người dùng mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => createUserMutation.mutate(values)}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true }, { type: "email" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}> 
                <Input.Password />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="name" label="Họ tên" rules={[{ required: true }]}> 
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="code" label="Mã định danh" rules={[{ required: true }]}> 
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="semester" label="Học kỳ" rules={[{ required: true }]}> 
                <Input type="number" min={1} max={3} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="year" label="Năm học" rules={[{ required: true }]}> 
                <Input type="number" min={2000} max={2100} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="role_id" label="Vai trò" rules={[{ required: true }]}> 
                <Select placeholder="Chọn vai trò">
                  <Select.Option value={1}>Sinh viên</Select.Option>
                  <Select.Option value={2}>GV nội bộ</Select.Option>
                  <Select.Option value={3}>GV ngoài</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={createUserMutation.isPending}>Tạo</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default UserManagement;