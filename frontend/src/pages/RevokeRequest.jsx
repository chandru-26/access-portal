import { useEffect, useState } from "react";
import { Table, Button, Tag, message, Popconfirm, Space } from "antd";
import axios from "axios";

const RevokeRequest = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  const fetchRequests = async () => {
    try {
      setLoading(true);

      const res = await axios.get("https://access-portal-zlbq.onrender.com/requests");

      const formatted = res.data.map((r) => ({
        id: r.id,
        employee: r.employee_name || "N/A",
        role: r.role || "N/A",
        customer: r.customer_name || "N/A",
        validServices: Array.isArray(r.valid_services) ? r.valid_services : [],
        access: Array.isArray(r.access) ? r.access : [],
        status: r.status || "ACTIVE",
      }));

      setRequests(formatted);
    } catch (err) {
      console.error(err);
      message.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  /* ================= SINGLE REVOKE ================= */
  const handleRevoke = async (id) => {
    try {
      await axios.put(`https://access-portal-zlbq.onrender.com/requests/revoke/${id}`);

      message.success("Access Revoked");

      fetchRequests();
    } catch (err) {
      console.error(err);
      message.error("Failed to revoke");
    }
  };

  /* ================= BULK REVOKE ================= */
  const handleBulkRevoke = async () => {
    try {
      if (!selectedRowKeys.length) return;

      await Promise.all(
        selectedRowKeys.map((id) =>
          axios.put(`https://access-portal-zlbq.onrender.com/requests/revoke/${id}`)
        )
      );

      message.success("Selected requests revoked");

      setSelectedRowKeys([]);
      fetchRequests();
    } catch (err) {
      console.error(err);
      message.error("Bulk revoke failed");
    }
  };

  /* ================= TABLE ================= */
  const columns = [
    {
      title: "Employee",
      dataIndex: "employee",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Customer",
      dataIndex: "customer",
    },

    {
      title: "Valid Services",
      render: (_, record) =>
        record.validServices.length ? (
          <Space wrap>
            {record.validServices.map((s, i) => (
              <Tag color="blue" key={i}>
                {s}
              </Tag>
            ))}
          </Space>
        ) : (
          <Tag>No Access</Tag>
        ),
    },

    {
      title: "Access",
      render: (_, record) =>
        record.access.length ? (
          <Space wrap>
            {record.access.map((a, i) => (
              <Tag color="green" key={i}>
                {a}
              </Tag>
            ))}
          </Space>
        ) : (
          <Tag>No Access</Tag>
        ),
    },

    {
      title: "Status",
      render: (_, record) =>
        record.status === "REVOKED" ? (
          <Tag color="red">REVOKED</Tag>
        ) : (
          <Tag color="green">ACTIVE</Tag>
        ),
    },

    {
      title: "Action",
      render: (_, record) =>
        record.status === "ACTIVE" ? (
          <Popconfirm
            title="Are you sure to revoke access?"
            onConfirm={() => handleRevoke(record.id)}
          >
            <Button danger size="small">
              Revoke
            </Button>
          </Popconfirm>
        ) : (
          <Button disabled size="small">
            Revoked
          </Button>
        ),
    },
  ];

  /* ================= ROW SELECTION ================= */
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    getCheckboxProps: (record) => ({
      disabled: record.status === "REVOKED",
    }),
  };

  return (
    <div>
      <h1>Revoke Access</h1>

      {/* 🔥 BULK BUTTON */}
      <Popconfirm
        title="Revoke selected requests?"
        onConfirm={handleBulkRevoke}
        disabled={!selectedRowKeys.length}
      >
        <Button
          type="primary"
          danger
          disabled={!selectedRowKeys.length}
          style={{ marginBottom: 15 }}
        >
          Revoke Selected ({selectedRowKeys.length})
        </Button>
      </Popconfirm>

      <Table
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={requests}
        rowKey="id"
        bordered
      />
    </div>
  );
};

export default RevokeRequest;