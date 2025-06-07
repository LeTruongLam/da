/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, Table, Flex, Input } from "antd";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getTaskFinnalList,
  type TaskFinnalResponse,
} from "@/services/api/task";

const FinnalSubmitTaskManagement = () => {
  const [searchKeyword, setSearchKeyword] = useState("");

  const { data: finnalTasksData = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ["get-finnal-tasks"],
    queryFn: () => getTaskFinnalList(),
  });

  const finnalTasksDataFiltered = finnalTasksData?.filter(
    (task: TaskFinnalResponse) => {
      const keyword = searchKeyword.toLowerCase();
      return (
        task?.thesis_title?.toLowerCase().includes(keyword) ||
        task?.student_name?.toLowerCase().includes(keyword) ||
        task?.lecturer_name?.toLowerCase().includes(keyword)
      );
    }
  );

  const renderColumns = () => [
    {
      title: "Tên đề tài",
      dataIndex: "thesis_title",
      key: "thesis_title",
    },
    {
      title: "Sinh viên thực hiện",
      dataIndex: "student_name",
      key: "student_name",
    },
    {
      title: "Giáo viên hướng dẫn",
      dataIndex: "lecturer_name",
      key: "lecturer_name",
    },
    {
      title: "Bài nộp của sinh viên",
      dataIndex: "file_name",
      key: "file_name",
      render: (_: any, record: TaskFinnalResponse) => (
        <a href={record.file_path} target="_blank" rel="noopener noreferrer">
          {record.file_name}
        </a>
      ),
    },
  ];

  return (
    <Card title="Quản lý bài nộp cuối cùng">
      <Flex justify="space-between" align="center" className="mb-4">
        <Input
          placeholder="Tìm theo tên đề tài, sinh viên, giáo viên"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ width: 300 }}
        />
      </Flex>

      <Table
        columns={renderColumns()}
        dataSource={finnalTasksDataFiltered}
        rowKey="id"
        loading={isLoadingAll}
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default FinnalSubmitTaskManagement;
