import { Modal } from "antd";

interface DeleteConfirmModalProps {
  visible: boolean;
  title: string;
  description: string;
  itemName?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  visible,
  title,
  description,
  itemName,
  loading = false,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      onOk={onConfirm}
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{ danger: true, loading }}
      confirmLoading={loading}
    >
      {itemName && <p>Bạn có chắc chắn muốn xóa {itemName}?</p>}
      <p>{description}</p>
    </Modal>
  );
};

export default DeleteConfirmModal;
