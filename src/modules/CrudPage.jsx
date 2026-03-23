import { useState, useEffect } from "react";
import { Button, Space, Form, Card } from "antd";
import CommonTable from "../components/common/CommonTable";
import CommonModal from "../components/common/CommonModal";
import CommonForm from "../components/common/CommonForm";
import SearchBar from "../components/common/SearchBar";
import { getAll, createItem, updateItem, deleteItem } from "../api/apiService";

export default function CrudPage({ config }) {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [mode, setMode] = useState("add");

  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  /* FETCH DATA */
  const fetchData = async () => {
    const result = await getAll(config.api.replace("/api/", ""));
    setData(result);
    setFiltered(result);
  };

  /* SEARCH */
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    const result = data.filter((item) =>
      item[config.searchField]?.toLowerCase().includes(value.toLowerCase()),
    );

    setFiltered(result);
  };
  /* VIEW */
  const openView = (row) => {
    form.setFieldsValue(row);
    setEditId(row._id);
    setMode("view");
    setOpen(true);
  };

  /* ADD */
  const openAdd = () => {
    form.resetFields();
    setEditId(null);
    setMode("add");
    setOpen(true);
  };

  /* EDIT */
  const openEdit = (row) => {
    form.setFieldsValue(row);
    setEditId(row._id);
    setMode("edit");
    setOpen(true);
  };

  /* SUBMIT */
  const handleSubmit = async (values) => {
    const endpoint = config.api.replace("/api/", "");

    if (editId) {
      await updateItem(endpoint, editId, values);
    } else {
      await createItem(endpoint, values);
    }

    setOpen(false);
    fetchData();
  };

  /* DELETE */
  const handleDelete = async (row) => {
    const endpoint = config.api.replace("/api/", "");
    await deleteItem(endpoint, row._id);
    fetchData();
  };

  /* MODAL FOOTER */
  const footer =
    mode === "view"
      ? [<Button onClick={() => setOpen(false)}>Close</Button>]
      : [
          <Button onClick={() => setOpen(false)}>Cancel</Button>,
          <Button
            type="primary"
            className="primary-btn"
            onClick={() => form.submit()}
          >
            Submit
          </Button>,
        ];

  const handleClose = () => {
    form.resetFields();
    setOpen(false);
  };

  return (
    <div>
      <h2 className="page-title">{config.title}</h2>
      {/* HEADER */}
      <Card variant="borderless" style={{ width: "100%" }}>
        <Space
          style={{
            marginBottom: 20,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <SearchBar value={search} onChange={handleSearch} />
          <Button type="primary" className="primary-btn" onClick={openAdd}>
            Add {config.name}
          </Button>
        </Space>

        {/* TABLE */}
        <CommonTable
          columns={config.columns}
          data={filtered}
          onView={openView}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </Card>
      {/* MODAL */}
      <CommonModal
        width={1500}
        title={editId ? `Update ${config.name}` : `Add ${config.name}`}
        open={open}
        onCancel={handleClose}
        footer={footer}
      >
        <CommonForm
          fields={config.fields}
          form={form}
          onSubmit={handleSubmit}
          disabled={mode === "view"}
        />
      </CommonModal>
    </div>
  );
}
