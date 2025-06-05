// --- Giữ nguyên phần import như cũ ---
import React, { useState, useEffect } from "react";
import {
  Modal,
  Steps,
  Form,
  DatePicker,
  Select,
  Button,
  message,
  Spin,
  Checkbox,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PERIODS } from "@/lib/constants";
import {
  getTeachersCouncil,
  getRequestCouncil,
  type TeachersCouncilResponse,
  type RequestCouncilResponse,
  createCouncil,
} from "@/services/api/councils";

const { Step } = Steps;
const { Text } = Typography;

type SlotModalType = {
  open: boolean;
  onCancel: () => void;
  refetchAll: () => void;
};

type SlotFormValues = {
  date: dayjs.Dayjs;
  slot: number;
};

const MAX_SELECTED_TEACHERS = 5;
const MAX_SELECTED_REQUESTS = 10;

const SlotModal = ({ open, onCancel, refetchAll }: SlotModalType) => {
  const [form] = Form.useForm<SlotFormValues>();
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState<SlotFormValues | null>(null);
  const [selectedTeachers, setSelectedTeachers] = useState<number[]>([]);
  const [selectedTeachersString, setSelectedTeachersString] = useState("");

  const [requestList, setRequestList] = useState<RequestCouncilResponse[]>([]);
  const [selectedRequestIds, setSelectedRequestIds] = useState<number[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const {
    data: teachersList,
    isLoading: isLoadingTeachersList,
    refetch,
  } = useQuery<TeachersCouncilResponse[]>({
    queryKey: [
      "teachersCouncil",
      formData?.date?.format("YYYY-MM-DD"),
      formData?.slot,
    ],
    queryFn: () => {
      if (!formData) return Promise.resolve([]);
      return getTeachersCouncil({
        date: formData.date.format("YYYY-MM-DD"),
        session: String(formData.slot),
      });
    },
    enabled: false,
  });

  const { mutate: createCouncilMutate, isPending: isCreatingCouncil } =
    useMutation({
      mutationFn: async () => {
        if (!formData || selectedRequestIds.length === 0) {
          return Promise.reject("Dữ liệu không đầy đủ");
        }

        const list_Member = `${selectedTeachersString}/${formData.slot}`;

        const requestList = `${selectedRequestIds.join("/")}`;

        return createCouncil(1, {
          requestIds: requestList,
          list_Member,
          date: formData.date.toISOString(),
        });
      },
      onSuccess: () => {
        message.success("Tạo hội đồng thành công!");
        onCancel();
        resetState();
        refetchAll();
      },
      onError: () => {
        message.error("Tạo hội đồng thất bại, vui lòng thử lại.");
      },
    });

  useEffect(() => {
    if (current === 1 && formData) {
      refetch();
      setSelectedTeachers([]);
      setSelectedTeachersString("");
    }
  }, [current, formData, refetch]);

  useEffect(() => {
    if (current === 2 && selectedTeachersString) {
      setLoadingRequests(true);
      getRequestCouncil({ listMember: selectedTeachersString })
        .then((res) => {
          setRequestList(res);
          setSelectedRequestIds([]);
        })
        .catch(() => {
          message.error("Lấy danh sách request thất bại");
          setRequestList([]);
        })
        .finally(() => {
          setLoadingRequests(false);
        });
    }
  }, [current, selectedTeachersString]);

  const next = async () => {
    if (current === 0) {
      try {
        const values = await form.validateFields();
        setFormData(values);
        setCurrent(1);
      } catch {
        message.warning("Vui lòng điền đầy đủ thông tin.");
      }
    } else if (current === 1) {
      if (selectedTeachers.length !== MAX_SELECTED_TEACHERS) {
        message.warning(
          `Vui lòng chọn đúng ${MAX_SELECTED_TEACHERS} giáo viên.`
        );
        return;
      }
      setSelectedTeachersString(selectedTeachers.join("/"));
      setCurrent(2);
    }
  };

  const prev = () => {
    if (current === 0) {
      onCancel();
      resetState();
    } else {
      setCurrent(current - 1);
    }
  };

  const resetState = () => {
    setCurrent(0);
    form.resetFields();
    setFormData(null);
    setSelectedTeachers([]);
    setSelectedTeachersString("");
    setRequestList([]);
    setSelectedRequestIds([]);
  };

  const handleConfirm = () => {
    if (selectedRequestIds.length === 0) {
      message.warning("Vui lòng chọn ít nhất 1 request hội đồng.");
      return;
    }
    if (selectedRequestIds.length > MAX_SELECTED_REQUESTS) {
      message.warning(
        `Chỉ được chọn tối đa ${MAX_SELECTED_REQUESTS} request hội đồng.`
      );
      return;
    }
    createCouncilMutate();
  };

  const onCheckboxChange = (checkedValues: number[]) => {
    if (checkedValues.length > MAX_SELECTED_TEACHERS) {
      message.warning(
        `Bạn chỉ được chọn tối đa ${MAX_SELECTED_TEACHERS} giáo viên.`
      );
      return;
    }
    setSelectedTeachers(checkedValues);
  };

  const onRequestCheckboxChange = (checkedValues: number[]) => {
    if (checkedValues.length > MAX_SELECTED_REQUESTS) {
      message.warning(
        `Chỉ được chọn tối đa ${MAX_SELECTED_REQUESTS} request hội đồng.`
      );
      return;
    }
    setSelectedRequestIds(checkedValues);
  };

  const steps = [
    {
      title: "Chọn thời gian",
      content: (
        <Form form={form} layout="vertical">
          <Form.Item
            label="Ngày"
            name="date"
            rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            label="Khung giờ"
            name="slot"
            rules={[{ required: true, message: "Vui lòng chọn khung giờ" }]}
          >
            <Select
              placeholder="Chọn khung giờ"
              options={PERIODS.map((preriod) => ({
                label: preriod.label,
                value: preriod.value,
              }))}
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Chọn giáo viên",
      content: isLoadingTeachersList ? (
        <Spin />
      ) : teachersList && teachersList.length > 0 ? (
        <>
          <Text>Chọn đúng {MAX_SELECTED_TEACHERS} giáo viên:</Text>
          <Checkbox.Group
            style={{ display: "block", marginTop: 12 }}
            value={selectedTeachers}
            onChange={onCheckboxChange}
          >
            {teachersList.map((teacher) => (
              <Checkbox
                key={teacher.user_id}
                value={teacher.user_id}
                style={{ display: "block", marginBottom: 8 }}
              >
                {teacher.name} ({teacher.code}) - {teacher.email}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </>
      ) : (
        <Text>Không có giảng viên nào trong khung giờ này.</Text>
      ),
    },
    {
      title: "Xác nhận",
      content: (
        <div>
          <p>
            <strong>Ngày:</strong> {formData?.date.format("DD/MM/YYYY")}
          </p>
          <p>
            <strong>Giáo viên đã chọn:</strong>
          </p>
          <ul>
            {teachersList
              ?.filter((t) => selectedTeachers.includes(t.user_id))
              .map((teacher) => (
                <li key={teacher.user_id}>
                  {teacher.name} ({teacher.code}) - {teacher.email}
                </li>
              ))}
          </ul>
          <p>
            <strong>
              Chọn Request Hội đồng (1 - {MAX_SELECTED_REQUESTS}):
            </strong>
          </p>
          {loadingRequests ? (
            <Spin />
          ) : requestList.length === 0 ? (
            <Text>Không có request nào phù hợp.</Text>
          ) : (
            <Checkbox.Group
              value={selectedRequestIds}
              onChange={onRequestCheckboxChange}
              style={{ display: "block" }}
            >
              {requestList.map((request) => (
                <Checkbox
                  key={request.request_id}
                  value={request.request_id}
                  style={{
                    display: "block",
                    marginBottom: 8,
                    padding: 12,
                    border: "1px solid #d9d9d9",
                    borderRadius: 6,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "bold", marginBottom: 4 }}>
                      📝 Đề tài: {request.thesis_title}
                    </div>
                    <div style={{ color: "#555" }}>
                      👨‍🏫 Giảng viên hướng dẫn: {request.lecturer_name}
                    </div>
                  </div>
                </Checkbox>
              ))}
            </Checkbox.Group>
          )}
        </div>
      ),
    },
  ];

  return (
    <Modal
      open={open}
      title="Tạo lịch hội đồng"
      onCancel={() => {
        onCancel();
        resetState();
      }}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Steps current={current} style={{ marginBottom: 24 }}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <div style={{ minHeight: 200 }}>{steps[current].content}</div>

      <div style={{ marginTop: 24, textAlign: "right" }}>
        {current > 0 && (
          <Button style={{ marginRight: 8 }} onClick={prev}>
            Quay lại
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button
            type="primary"
            onClick={next}
            disabled={
              current === 1 && selectedTeachers.length !== MAX_SELECTED_TEACHERS
            }
          >
            Tiếp theo
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            loading={isCreatingCouncil}
            onClick={handleConfirm}
          >
            Xác nhận
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default SlotModal;
