import { Table, Space } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

export default function CommonTable({
  columns,
  data,
  onView,
  onEdit,
  onDelete,
  rowSelection,
  onDownload,
}) {
  const actionColumn = {
    title: "",
    width: 60,
    render: (_, row) => (
      <Space>
        <div className="table-icon">
          <EyeOutlined onClick={() => onView(row)} />
        </div>
        <div className="table-icon">
          <EditOutlined onClick={() => onEdit(row)} />
        </div>
        <div className="table-icon">
          <DeleteOutlined onClick={() => onDelete(row)} />
        </div>
        {onDownload && (
          <div className="table-icon">
            <DownloadOutlined onClick={() => onDownload(row)} />
          </div>
        )}
      </Space>
    ),
  };

  const serialColumn = {
    title: "S No",
    render: (_, __, index) => index + 1,
  };

  const finalColumns = [actionColumn, serialColumn, ...columns];

  return (
    <Table
      columns={finalColumns}
      dataSource={data}
      rowKey="_id"
      bordered
      pagination={{ pageSize: 10 }}
      rowSelection={rowSelection}
      scroll={{ x: "max-content" }}
    />
  );
}
