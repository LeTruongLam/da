// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { useSelector } from "react-redux";
// import { Spin, Empty, Button, Card, Typography, Result } from "antd";
// import { FileTextOutlined, PlusOutlined } from "@ant-design/icons";
// import type { RootState } from "../store";
// import { api } from "../services/api";

// const { Title, Text } = Typography;

// const MyThesis = () => {
//   const navigate = useNavigate();
//   const user = useSelector((state: RootState) => state.auth.user);

//   // Fetch my theses
//   const { data: myTheses = [], isLoading } = useQuery({
//     queryKey: ["myTheses", user?.id],
//     queryFn: () => api.getMyTheses(user?.id || ""),
//     enabled: !!user?.id,
//   });

//   // Redirect to the thesis detail page if there's exactly one thesis
//   useEffect(() => {
//     if (!isLoading && myTheses.length === 1) {
//       navigate(`/my-thesis/${myTheses[0].id}`);
//     }
//   }, [myTheses, isLoading, navigate]);

//   if (isLoading) {
//     return (
//       <div style={{ textAlign: "center", padding: "100px 0" }}>
//         <Spin size="large" />
//         <div style={{ marginTop: 16 }}>
//           <Text>Đang tải thông tin đồ án...</Text>
//         </div>
//       </div>
//     );
//   }

//   if (myTheses.length === 0) {
//     return (
//       <Result
//         status="info"
//         title="Bạn chưa đăng ký đề tài đồ án"
//         subTitle="Vui lòng xem danh sách đề tài và đăng ký một đề tài để bắt đầu."
//         extra={
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             onClick={() => navigate("/thesis-list")}
//           >
//             Xem danh sách đề tài
//           </Button>
//         }
//       />
//     );
//   }

//   // If there are multiple theses (rare case), show a list to choose from
//   return (
//     <div style={{ maxWidth: 800, margin: "0 auto" }}>
//       <Card
//         title={
//           <Title level={4}>
//             <FileTextOutlined /> Đồ án của tôi
//           </Title>
//         }
//       >
//         {myTheses.length > 1 ? (
//           <>
//             <Text>Vui lòng chọn một đề tài:</Text>
//             <div style={{ marginTop: 16 }}>
//               {myTheses.map((thesis) => (
//                 <Card
//                   key={thesis.id}
//                   hoverable
//                   style={{ marginBottom: 16, cursor: "pointer" }}
//                   onClick={() => navigate(`/my-thesis/${thesis.id}`)}
//                 >
//                   <Card.Meta
//                     title={thesis.title}
//                     description={
//                       <>
//                         <Text>
//                           Giảng viên hướng dẫn: {thesis.supervisor.name}
//                         </Text>
//                         <br />
//                         <Text>Deadline: {thesis.deadline}</Text>
//                       </>
//                     }
//                   />
//                 </Card>
//               ))}
//             </div>
//           </>
//         ) : (
//           <Empty description="Không tìm thấy thông tin đồ án" />
//         )}
//       </Card>
//     </div>
//   );
// };

// export default MyThesis;
