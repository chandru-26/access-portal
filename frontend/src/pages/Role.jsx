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

const Role = () => {
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [form] = Form.useForm();

  // ✅ Services list (used everywhere)
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

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/roles");
      setRoles(res.data);
    } catch {
      message.error("Failed to fetch roles");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Open modal
  const showModal = (record = null) => {
    setEditingRole(record);
    setOpen(true);

    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  };

  // Save role
  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingRole) {
        await axios.put(
          `http://localhost:5000/roles/${editingRole.id}`,
          values
        );
        message.success("Role updated");
      } else {
        await axios.post("http://localhost:5000/roles", values);
        message.success("Role added");
      }

      setOpen(false);
      setEditingRole(null);
      form.resetFields();
      fetchRoles();
    } catch {
      message.error("Error saving role");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/roles/${id}`);
      message.success("Deleted");
      fetchRoles();
    } catch {
      message.error("Delete failed");
    }
  };

  // Table columns
  const columns = [
    { title: "Role", dataIndex: "role_name" },

    ...services.map((s) => ({
      title: s.label,
      render: (_, record) => (record[s.name] ? "Yes" : "No")
    })),

    {
      title: "Action",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => showModal(record)}>
            Edit
          </Button>

          <Popconfirm
            title="Delete role?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger type="link">Delete</Button>
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <div>
      <h1>Roles</h1>

      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ marginBottom: 20 }}
      >
        Add Role
      </Button>

      <Table columns={columns} dataSource={roles} rowKey="id" bordered />

      {/* Modal */}
      <Modal
        title={editingRole ? "Edit Role" : "Add Role"}
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
      >
        <Form form={form} layout="vertical">

          <Form.Item
            name="role_name"
            label="Role Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          {/* Toggle switches */}
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

export default Role;