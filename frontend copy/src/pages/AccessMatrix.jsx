import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  message,
  Popconfirm
} from "antd";
import axios from "axios";

const AccessMatrix = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  /* ================= SERVICES CONFIG ================= */
  const services = [
    { label: "Monitoring & Diagnostics", name: "monitoring" },
    { label: "Database Management", name: "database_mgmt" },
    { label: "EDI Management", name: "edi_mgmt" },
    { label: "Application Management", name: "app_mgmt" },
    { label: "Release Management", name: "release_mgmt" },
    { label: "Ops View Analytics", name: "ops_view" },
    { label: "Automated Testing", name: "automated_testing" },
    { label: "Extensions Management", name: "extensions_mgmt" },
    { label: "Service Desk", name: "service_desk" }
  ];

  /* ================= BOOLEAN NORMALIZER ================= */
  const normalizeBool = (v) => {
    if (v === true || v === 1) return true;

    if (typeof v === "string") {
      return ["true", "yes", "y", "t", "1"]
        .includes(v.trim().toLowerCase());
    }

    return false;
  };

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/access-matrix"
      );

      setData(res.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch access matrix");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= OPEN MODAL ================= */
  const showModal = (record = null) => {
    setEditing(record);
    setOpen(true);

    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  };

  /* ================= SAVE (ADD / UPDATE) ================= */
  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (editing?.id) {
        await axios.put(
          `http://localhost:5000/access-matrix/${editing.id}`,
          values
        );
        message.success("Updated successfully");
      } else {
        await axios.post(
          "http://localhost:5000/access-matrix",
          values
        );
        message.success("Added successfully");
      }

      setOpen(false);
      setEditing(null);
      fetchData();
    } catch (err) {
      message.error("Operation failed");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/access-matrix/${id}`
      );
      message.success("Deleted successfully");
      fetchData();
    } catch {
      message.error("Delete failed");
    }
  };

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    {
      title: "Access Name",
      dataIndex: "access_name"
    },

    ...services.map((s) => ({
      title: s.label,
      render: (_, record) =>
        normalizeBool(record[s.name]) ? "Yes" : "No"
    })),

    {
      title: "Action",
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => showModal(record)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      )
    }
  ];

  /* ================= UI ================= */
  return (
    <div style={{ padding: 20 }}>
      <h2>Access Matrix</h2>

      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ marginBottom: 20 }}
      >
        Add Access
      </Button>

      <Table
        rowKey="id"
        dataSource={data}
        columns={columns}
        bordered
      />

      <Modal
        title={editing ? "Edit Access" : "Add Access"}
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        width={700}
      >
        <Form form={form} layout="vertical">

          <Form.Item
            name="access_name"
            label="Access Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          {services.map((s) => (
            <Form.Item
              key={s.name}
              name={s.name}
              label={s.label}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          ))}

        </Form>
      </Modal>
    </div>
  );
};

export default AccessMatrix;