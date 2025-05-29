// components/modals/SelectLecturerModal.tsx
import { createRequest, type RequestDataRequest } from "@/services/api/request";
import {
  getExternalLecturers,
  getInternalLecturers,
  type TeacherResponse,
} from "@/services/api/teacher";
import type { RootState } from "@/store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Form, message, Modal, Select } from "antd";
import { useSelector } from "react-redux";

interface SelectLecturerModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  thesis_id: number;
  refetch?: () => void;
}

const SelectLecturerModal = ({
  isModalOpen,
  setIsModalOpen,
  thesis_id,
  refetch,
}: SelectLecturerModalProps) => {
  const [form] = Form.useForm();
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: internalLecturers = [] } = useQuery<TeacherResponse[]>({
    queryKey: ["internalLecturers"],
    queryFn: getInternalLecturers,
  });

  const { data: externalLecturers = [] } = useQuery<TeacherResponse[]>({
    queryKey: ["externalLecturers"],
    queryFn: getExternalLecturers,
  });

  const filteredTeachers = [...internalLecturers, ...externalLecturers];

  const { mutate: handleCreateRequestMutation, isPending } = useMutation({
    mutationFn: (data: RequestDataRequest) => createRequest(data),
    onSuccess: () => {
      message.success("Gửi yêu cầu thành công!");
      setIsModalOpen(false);
      form.resetFields();
      refetch?.();
    },
    onError: () => {
      message.error("Gửi yêu cầu thất bại!");
      setIsModalOpen(false);
    },
  });

  const handleModalOk = () => {
    const value = {
      thesis_id: thesis_id,
      student_id: user?.user_id,
      lecturer_id: form.getFieldValue("teacherId") as number,
    };

    handleCreateRequestMutation(value as RequestDataRequest, {});
  };

  return (
    <Modal
      title="Chọn giáo viên để gửi yêu cầu"
      open={isModalOpen}
      onOk={handleModalOk}
      onCancel={() => setIsModalOpen(false)}
      okText="Gửi yêu cầu"
      cancelText="Hủy"
      cancelButtonProps={{ disabled: isPending }}
      confirmLoading={isPending}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="teacherId"
          label="Chọn giáo viên"
          rules={[{ required: true, message: "Vui lòng chọn giáo viên" }]}
        >
          <Select
            disabled={isPending}
            showSearch
            placeholder="Tìm và chọn giáo viên"
            filterOption={(input, option) =>
              (option?.label as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            options={filteredTeachers.map((teacher) => ({
              label: teacher.name,
              value: teacher.user_id,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SelectLecturerModal;
