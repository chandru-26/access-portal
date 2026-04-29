import { useEffect, useState } from "react";
import { Table, Tag, message } from "antd";
import axios from "axios";

const RequestHistory = () => {
  const [data, setData] = useState([]);

  /* ================= FETCH REQUESTS ================= */
  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        "https://access-portal-zlbq.onrender.com/requests"
      );

      const formatted = res.data.map((r) => ({
        id: r.id,
        employee: r.employee_name,
        role: r.role,
        customer: r.customer_name,
        validServices: r.valid_services || [],
        access: r.access || [],
        status: r.status || "ACTIVE"
      }));

      setData(formatted);
    } catch (err) {
      console.error(err);
      message.error("Failed to load history");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  /* ================= TABLE ================= */
  const columns = [
    { title: "Employee", dataIndex: "employee" },
    { title: "Role", dataIndex: "role" },
    { title: "Customer", dataIndex: "customer" },

    {
      title: "Services",
      render: (_, record) =>
        record.validServices?.length ? (
          record.validServices.map((s, i) => (
            <Tag color="blue" key={i}>{s}</Tag>
          ))
        ) : (
          <Tag>No Services</Tag>
        )
    },

    {
      title: "Access",
      render: (_, record) =>
        record.access?.length ? (
          record.access.map((a, i) => (
            <Tag color="green" key={i}>{a}</Tag>
          ))
        ) : (
          <Tag>No Access</Tag>
        )
    },

    {
      title: "Status",
      render: (_, record) => (
        <Tag color={record.status === "REVOKED" ? "red" : "green"}>
          {record.status}
        </Tag>
      )
    }
  ];

  return (
    <div>
      <h1>Request History</h1>

      <Table
        style={{ marginTop: 20 }}
        dataSource={data}
        columns={columns}
        rowKey="id"
        bordered
      />
    </div>
  );
};

export default RequestHistory;