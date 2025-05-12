import { Card, Form, Input, Button, message, Spin, Select } from "antd";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createThesis } from "@/services/api/thesis";
import type { ThesisCreateRequest } from "@/services/api/thesis";
import { getMajors } from "@/services/api/major";
import type { Major } from "@/services/api/major";
import { useNavigate } from "react-router-dom";

interface FormValues {
  title: string;
  description?: string;
  majorId: number;
}

const CreateThesis = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch majors using React Query
  const { data: majors = [], isLoading: isLoadingMajors } = useQuery({
    queryKey: ["majors"],
    queryFn: getMajors,
  });

  // Create thesis mutation
  const createThesisMutation = useMutation({
    mutationFn: (data: ThesisCreateRequest) => createThesis(data),
    onSuccess: () => {
      message.success("Tạo đề tài thành công!");
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ["theses"] });
      queryClient.invalidateQueries({ queryKey: ["myTheses"] });
      navigate("/thesis-management");
    },
    onError: (error: Error) => {
      message.error(`Tạo đề tài thất bại: ${error.message}`);
    },
  });

  const onFinish = (values: FormValues) => {
    const thesisData: ThesisCreateRequest = {
      title: values.title,
      description: values.description || "",
      majorId: values.majorId,
    };

    createThesisMutation.mutate(thesisData);
  };

  // Show loading overlay when processing
  const isSubmitting = createThesisMutation.isPending;

  return (
    <div style={{ position: "relative" }}>
      {isSubmitting && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Spin size="large" tip="Đang tạo đề tài..." />
        </div>
      )}
      <Card title="Tạo mới đề tài" style={{ maxWidth: 900, margin: "0 auto" }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          disabled={isSubmitting}
        >
          <Form.Item
            name="title"
            label="Tiêu đề đề tài"
            rules={[{ required: true, message: "Nhập tiêu đề!" }]}
          >
            <Input placeholder="Nhập tiêu đề đề tài" />
          </Form.Item>

          <Form.Item
            name="majorId"
            label="Chuyên ngành"
            rules={[{ required: true, message: "Chọn chuyên ngành!" }]}
          >
            <Select
              placeholder="Chọn chuyên ngành"
              loading={isLoadingMajors}
              options={majors.map((major: Major) => ({
                label: major.majorName,
                value: major.majorId,
              }))}
            />
          </Form.Item>

          <Form.Item name="description" label="Mô tả đề tài">
            <Input.TextArea rows={3} placeholder="Mô tả chi tiết đề tài..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Tạo đề tài
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateThesis;
