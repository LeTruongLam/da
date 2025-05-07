import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const LoadingSpinner = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
        size="large"
      />
    </div>
  );
};

export default LoadingSpinner;
