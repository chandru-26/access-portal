import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm
} from "antd";
import axios from "axios";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [form] = Form.useForm();

  // ✅ Roles list
  const roles = [
    "N4 & Service Desk",
    "N4 & EDI Engineer",
    "DBA",
    "N4 & Infrastructure Engineer",
    "M&D & EDI Engineer",
    "N4 & Cloud",
    "Infrastructure Engineer",
    "N4 & DBA"
  ];

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("https://access-portal-zlbq.onrender.com/employees");
      setEmployees(res.data);
    } catch (err) {
      message.error("Failed to fetch employees");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Open modal
  const showModal = (record = null) => {
    setEditingEmployee(record);
    setOpen(true);

    if (record) {
      // ✅ Ensure no undefined fields
      form.setFieldsValue({
        employee_name: record.employee_name || "",
        email: record.email || "",
        phone: record.phone || "",
        role: record.role || ""
      });
    } else {
      form.resetFields();
    }
  };

  // Save employee
  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        employee_name: values.employee_name,
        email: values.email,
        phone: values.phone,
        role: values.role
      };

      if (editingEmployee) {
        await axios.put(
          `https://access-portal-zlbq.onrender.com/employees/${editingEmployee.id}`,
          payload
        );
        message.success("Employee updated");
      } else {
        await axios.post(
          "https://access-portal-zlbq.onrender.com/employees",
          payload
        );
        message.success("Employee added");
      }

      setOpen(false);
      setEditingEmployee(null); // ✅ reset edit state
      form.resetFields();
      fetchEmployees();
    } catch (err) {
      message.error("Something went wrong");
    }
  };

  // Delete employee
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://access-portal-zlbq.onrender.com/employees/${id}`);
      message.success("Deleted successfully");
      fetchEmployees();
    } catch (err) {
      message.error("Delete failed");
    }
  };

  // Table columns
  const columns = [
    { title: "Employee Name", dataIndex: "employee_name" },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },
    { title: "Role", dataIndex: "role" },

    {
      title: "Action",
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => showModal(record)}
            style={{ color: "#16B261" }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete employee?"
            description="Are you sure you want to delete this employee?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <div>
      <h1>Employees</h1>

      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ marginBottom: 20, background: "#16B261" }}
      >
        Add Employee
      </Button>

      <Table
        columns={columns}
        dataSource={employees}
        rowKey="id"
        bordered
      />

      {/* MODAL */}
      <Modal
        title={editingEmployee ? "Edit Employee" : "Add Employee"}
        open={open}
        onOk={handleOk}
        onCancel={() => {
          setOpen(false);
          setEditingEmployee(null);
          form.resetFields();
        }}
        okText="Save"
      >
        <Form form={form} layout="vertical">

          <Form.Item
            name="employee_name"
            label="Employee Name"
            rules={[{ required: true, message: "Enter name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email", message: "Enter valid email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: "Enter phone number" },
              { pattern: /^[0-9]{10}$/, message: "Enter valid 10-digit number" }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Select role" }]}
          >
            <Select placeholder="Select role">
              {roles.map((role) => (
                <Select.Option key={role} value={role}>
                  {role}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
};

export default Employees;