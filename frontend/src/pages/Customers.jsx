import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, message, Switch } from "antd";
import axios from "axios";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [form] = Form.useForm();

  // Fetch customers
  const fetchCustomers = async () => {
    const res = await axios.get("https://your-backend.onrender.com/customers");
    setCustomers(res.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Open modal
  const showModal = (record = null) => {
    setEditingCustomer(record);
    setOpen(true);

    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  };

  // Save customer
  const handleOk = async () => {
    const values = await form.validateFields();

    const formattedValues = {
      ...values,
      monitoring: values.monitoring || false,
      database_mgmt: values.database_mgmt || false,
      edi_mgmt: values.edi_mgmt || false,
      app_mgmt: values.app_mgmt || false,
      release_mgmt: values.release_mgmt || false,
      ops_view: values.ops_view || false,
      automated_testing: values.automated_testing || false,
      extensions_mgmt: values.extensions_mgmt || false,
      service_desk: values.service_desk || false,
    };

    if (editingCustomer) {
      await axios.put(
        `https://your-backend.onrender.com/customers/${editingCustomer.id}`,
        formattedValues
      );
      message.success("Customer updated");
    } else {
      await axios.post("https://your-backend.onrender.com/customers", formattedValues);
      message.success("Customer added");
    }

    setOpen(false);
    fetchCustomers();
  };

  // Delete
  const handleDelete = async (id) => {
    await axios.delete(`https://your-backend.onrender.com/customers/${id}`);
    message.success("Deleted");
    fetchCustomers();
  };

  // Table columns
  const columns = [
    { title: "Customer Name", dataIndex: "customer_name" },
    { title: "Region", dataIndex: "region" },
    { title: "Owner", dataIndex: "owner" },
    { title: "ENV Hosted", dataIndex: "env_hosted" },
    { title: "Customer Email", dataIndex: "contact_email" },

    // ✅ NEW FIELDS
    { title: "POC Name", dataIndex: "poc_name" },
    { title: "POC Mobile", dataIndex: "poc_mobile" },

    { title: "Monitoring", dataIndex: "monitoring", render: v => v ? "Yes" : "No" },
    { title: "DB", dataIndex: "database_mgmt", render: v => v ? "Yes" : "No" },
    { title: "EDI", dataIndex: "edi_mgmt", render: v => v ? "Yes" : "No" },
    { title: "App", dataIndex: "app_mgmt", render: v => v ? "Yes" : "No" },
    { title: "Release", dataIndex: "release_mgmt", render: v => v ? "Yes" : "No" },
    { title: "Ops View", dataIndex: "ops_view", render: v => v ? "Yes" : "No" },
    { title: "Testing", dataIndex: "automated_testing", render: v => v ? "Yes" : "No" },
    { title: "Extensions", dataIndex: "extensions_mgmt", render: v => v ? "Yes" : "No" },
    { title: "Service Desk", dataIndex: "service_desk", render: v => v ? "Yes" : "No" },

    {
      title: "Action",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => showModal(record)} style={{ color: "#16B261" }}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>Customers</h1>

      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ marginBottom: 20, background: "#16B261" }}
      >
        Add Customer
      </Button>

      <Table
        columns={columns}
        dataSource={customers}
        rowKey="id"
        bordered
        scroll={{ x: true }}
      />

      {/* MODAL */}
      <Modal
        title={editingCustomer ? "Edit Customer" : "Add Customer"}
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        okText="Save"
        width={700}
      >
        <Form form={form} layout="vertical">

          <Form.Item name="customer_name" label="Customer Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="region" label="Region">
            <Input />
          </Form.Item>

          <Form.Item name="owner" label="Owner">
            <Input />
          </Form.Item>

          <Form.Item name="env_hosted" label="ENV Hosted">
            <Select>
              <Select.Option value="Cloud">Cloud</Select.Option>
              <Select.Option value="On-Prem">On-Prem</Select.Option>
              <Select.Option value="Hybrid">Hybrid</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="contact_email" label="Customer Email">
            <Input />
          </Form.Item>

          {/* ✅ NEW FIELDS */}
          <Form.Item name="poc_name" label="POC Name">
            <Input />
          </Form.Item>

          <Form.Item name="poc_mobile" label="POC Mobile">
            <Input />
          </Form.Item>

          {/* SERVICES */}
          <Form.Item name="monitoring" label="Monitoring & Diagnostics" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="database_mgmt" label="Database Management" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="edi_mgmt" label="EDI Management" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="app_mgmt" label="Application Management" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="release_mgmt" label="Release Management" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="ops_view" label="Ops View Analytics" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="automated_testing" label="Automated Testing" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="extensions_mgmt" label="Extensions Management" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="service_desk" label="Service Desk" valuePropName="checked">
            <Switch />
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
};

export default Customers;