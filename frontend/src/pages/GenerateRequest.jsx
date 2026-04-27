import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  message,
  Tag
} from "antd";
import axios from "axios";

const GenerateRequest = () => {
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [open, setOpen] = useState(false);

  const [form] = Form.useForm();

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    try {
      const [emp, cust] = await Promise.all([
        axios.get("https://access-portal-zlbq.onrender.com/employees"),
        axios.get("https://access-portal-zlbq.onrender.com/customers")
      ]);

      setEmployees(emp.data);
      setCustomers(cust.data);
    } catch {
      message.error("Failed to load data");
    }
  };

  /* ================= FETCH REQUESTS ================= */
  const fetchRequests = async () => {
    try {
      const res = await axios.get("https://access-portal-zlbq.onrender.com/requests");

      // 🔥 Normalize backend data → frontend format
      const formatted = res.data.map((r) => ({
        id: r.id,
        employee: r.employee_name,
        role: r.role,
        customer: r.customer_name,
        validServices: r.valid_services || [],
        access: r.access || []
      }));

      setRequests(formatted);
    } catch {
      message.error("Failed to load requests");
    }
  };

  useEffect(() => {
    fetchData();
    fetchRequests();
  }, []);

  const showModal = () => {
    setOpen(true);
    form.resetFields();
  };

  /* ================= GENERATE ACCESS ================= */
  const handleGenerate = async () => {
    try {
      const values = await form.validateFields();

      const res = await axios.post(
        "https://access-portal-zlbq.onrender.com/generate-access",
        values
      );

      const payload = {
        employee_id: values.employeeId,
        customer_id: values.customerId,
        employee_name: res.data.employee,
        role: res.data.role,
        customer_name: res.data.customer,
        valid_services: res.data.validServices,
        access: res.data.access
      };

      await axios.post("https://access-portal-zlbq.onrender.com/requests", payload);

      await fetchRequests(); // 🔥 refresh table from DB

      message.success("Access Generated");
      setOpen(false);
    } catch (err) {
      console.error(err);
      message.error("Failed to generate access");
    }
  };

  /* ================= TABLE ================= */
  const columns = [
    { title: "Employee", dataIndex: "employee" },
    { title: "Role", dataIndex: "role" },
    { title: "Customer", dataIndex: "customer" },

    {
      title: "Valid Services",
      render: (_, record) =>
        record.validServices?.length ? (
          record.validServices.map((s, i) => (
            <Tag color="blue" key={i}>
              {s}
            </Tag>
          ))
        ) : (
          <Tag>No Access</Tag>
        )
    },

    {
      title: "Access",
      render: (_, record) =>
        record.access?.length ? (
          record.access.map((a, i) => (
            <Tag color="green" key={i}>
              {a}
            </Tag>
          ))
        ) : (
          <Tag>No Access</Tag>
        )
    }
  ];

  return (
    <div>
      <h1>Generate Access Request</h1>

      <Button type="primary" onClick={showModal}>
        Generate New Request
      </Button>

      <Table
        style={{ marginTop: 20 }}
        columns={columns}
        dataSource={requests}
        rowKey="id"
        bordered
      />

      <Modal
        title="Generate Access"
        open={open}
        onOk={handleGenerate}
        onCancel={() => setOpen(false)}
        okText="Generate"
        width={700}
      >
        <Form form={form} layout="vertical">

          <Form.Item
            name="employeeId"
            label="Employee"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select Employee">
              {employees.map((e) => (
                <Select.Option key={e.id} value={e.id}>
                  {e.employee_name} ({e.role})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="customerId"
            label="Customer"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select Customer">
              {customers.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.customer_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
};

export default GenerateRequest;