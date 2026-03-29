import { Table, Space, Popconfirm } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  CheckOutlined,
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
    render: (_, row) =>
      row?.isActive ? (
        <Space>
          <div className="table-icon">
            <EyeOutlined onClick={() => onView(row)} />
          </div>
          <div className="table-icon">
            <EditOutlined onClick={() => onEdit(row)} />
          </div>
          <div className="table-icon">
            <Popconfirm
              title="Are you sure?"
              description="Do you want to delete this invoice?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => onDelete(row)}
            >
              <DeleteOutlined />
            </Popconfirm>
          </div>
          {onDownload && (
            <div className="table-icon">
              <DownloadOutlined onClick={() => onDownload(row)} />
            </div>
          )}
        </Space>
      ) : (
        <Space>
          <div className="table-icon">
            <EyeOutlined onClick={() => onView(row)} />
          </div>
          <div className="table-icon">
            <Popconfirm
              title="Are you sure?"
              description="Do you want to restore this invoice?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => onDelete(row)}
            >
              <CheckOutlined />
            </Popconfirm>
          </div>
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
