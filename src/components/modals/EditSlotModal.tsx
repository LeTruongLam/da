import React, { useState, useEffect } from "react";
import {
  Modal,
  Steps,
  Button,
  message,
  Spin,
  Checkbox,
  Typography,
} from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getTeachersCouncil,
  getCouncilById,
  updateCouncil,
  type TeachersCouncilResponse,
} from "@/services/api/councils";

const { Step } = Steps;
const { Text } = Typography;

type EditSlotModalType = {
  open: boolean;
  id: number | null;
  onCancel: () => void;
  refetchAll: () => void;
};

const MAX_SELECTED_TEACHERS = 5;

const EditSlotModal = ({
  open,
  onCancel,
  refetchAll,
  id,
}: EditSlotModalType) => {
  const [selectedTeachers, setSelectedTeachers] = useState<number[]>([]);

  const {
    data: councilData,
    isLoading: isLoadingCouncil,
    refetch,
  } = useQuery({
    queryKey: ["councilById", id],
    queryFn: () => getCouncilById(id as number),
    enabled: open && !!id,
  });

  const { data: teachersList, isLoading: isLoadingTeachersList } = useQuery<
    TeachersCouncilResponse[]
  >({
    queryKey: ["teachersCouncil-edit", id],
    queryFn: () =>
      getTeachersCouncil({
        date: councilData?.date as string,
        listMember: councilData?.list_Member,
      }),
    enabled: open && !!id && !!councilData,
  });

  useEffect(() => {
    if (open && councilData?.members) {
      const listChecker = councilData.members.map((member) => member.user_id);
      setSelectedTeachers(listChecker);
    }
  }, [open, councilData]);

  const { mutate: updateCouncilMutate, isPending: isUpdating } = useMutation({
    mutationFn: (data: {
      id: number;
      payload: { list_Member: string; requst_Id: string; date: string };
    }) => updateCouncil(data.id, data.payload),
    onSuccess: () => {
      message.success("Cập nhật hội đồng thành công.");
      refetchAll();
      onCancel();
      refetch();
    },
    onError: () => {
      message.error("Cập nhật hội đồng thất bại.");
    },
  });

  const onCheckboxChange = (checkedValues: number[]) => {
    if (checkedValues.length > MAX_SELECTED_TEACHERS) {
      message.warning(
        `Bạn chỉ được chọn tối đa ${MAX_SELECTED_TEACHERS} giáo viên.`
      );
      return;
    }
    setSelectedTeachers(checkedValues);
  };

  const handleSave = () => {
    if (!id || !councilData?.date) {
      message.warning("Thiếu dữ liệu hội đồng.");
      return;
    }

    if (selectedTeachers.length !== MAX_SELECTED_TEACHERS) {
      message.warning(`Vui lòng chọn đúng ${MAX_SELECTED_TEACHERS} giáo viên.`);
      return;
    }

    const list_Member = selectedTeachers.join("/");
    const requst_Id = councilData.request_id?.toString() ?? "";

    const listMemberArr = councilData?.list_Member.split("/");
    const afterListMember = listMemberArr.slice(5, 8);

    updateCouncilMutate({
      id,
      payload: {
        list_Member: `${list_Member}/${afterListMember.join("/")}`,
        requst_Id,
        date: councilData.date,
      },
    });
  };

  return (
    <Modal
      open={open}
      title="Sửa thông tin hội đồng"
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Steps current={0} style={{ marginBottom: 24 }}>
        <Step title="Chọn giáo viên" />
      </Steps>

      <div style={{ minHeight: 200 }}>
        {isLoadingCouncil || isLoadingTeachersList ? (
          <Spin />
        ) : teachersList && teachersList.length > 0 ? (
          <>
            <Text>Chọn đúng {MAX_SELECTED_TEACHERS} giáo viên:</Text>
            <Checkbox.Group
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
            <Text
              type={
                selectedTeachers.length !== MAX_SELECTED_TEACHERS
                  ? "danger"
                  : "success"
              }
              style={{ display: "block", marginTop: 12 }}
            >
              {selectedTeachers.length !== MAX_SELECTED_TEACHERS
                ? `Bạn cần chọn đúng ${MAX_SELECTED_TEACHERS} giáo viên (đã chọn ${selectedTeachers.length}).`
                : `Đã chọn đủ ${MAX_SELECTED_TEACHERS} giáo viên.`}
            </Text>
          </>
        ) : (
          <Text>Không có giáo viên nào phù hợp.</Text>
        )}
      </div>

      <div style={{ marginTop: 24, textAlign: "right" }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>
          Hủy
        </Button>
        <Button
          type="primary"
          loading={isUpdating}
          disabled={selectedTeachers.length !== MAX_SELECTED_TEACHERS}
          onClick={handleSave}
        >
          Lưu
        </Button>
      </div>
    </Modal>
  );
};

export default EditSlotModal;
