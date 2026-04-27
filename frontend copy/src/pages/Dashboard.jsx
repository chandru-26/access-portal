import { Card, Row, Col } from "antd";
import {
  TeamOutlined,
  UserOutlined,
  FileTextOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState({
    customers: 0,
    employees: 0,
    drafts: 0,
    revoke: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

 const fetchDashboardData = async () => {
  try {
    const [custRes, empRes, reqRes] = await Promise.all([
      axios.get("http://localhost:5000/customers"),
      axios.get("http://localhost:5000/employees"),
      axios.get("http://localhost:5000/requests"), // ✅ NEW
    ]);

    const requests = reqRes.data;

    const activeCount = requests.filter(
      (r) => r.status !== "REVOKED"
    ).length;

    const revokedCount = requests.filter(
      (r) => r.status === "REVOKED"
    ).length;

    setStats({
      customers: custRes.data.length,
      employees: empRes.data.length,
      drafts: activeCount,     // ✅ FIXED
      revoke: revokedCount,    // ✅ FIXED
    });

  } catch (err) {
    console.error("Dashboard fetch error:", err);
  }
};

  const statsData = [
    {
      title: "Total Customers",
      value: stats.customers,
      icon: <TeamOutlined />,
    },
    {
      title: "Active Employees",
      value: stats.employees,
      icon: <UserOutlined />,
    },
    {
      title: "Pending Drafts",
      value: stats.drafts,
      icon: <FileTextOutlined />,
    },
    {
      title: "Revoke Requests",
      value: stats.revoke,
      icon: <CloseCircleOutlined />,
    },
  ];

  const actions = [
    { title: "Add Customer", desc: "Create new customer profile" },
    { title: "Add Employee", desc: "Register new team member" },
    { title: "New Joiner Request", desc: "Generate onboarding access request" },
    { title: "Revoke Access", desc: "Generate revocation request" },
  ];

  return (
    <>
      <h1 style={{ fontWeight: 600 }}>Dashboard</h1>
      <p style={{ color: "#666" }}>Welcome back</p>

      {/* STATS */}
      <Row gutter={16}>
        {statsData.map((item, i) => (
          <Col span={6} key={i}>
            <Card
              style={{
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h2 style={{ margin: 0 }}>{item.value}</h2>
                  <p style={{ margin: 0, color: "#777" }}>
                    {item.title}
                  </p>
                </div>

                <div
                  style={{
                    fontSize: 28,
                    color: "#16B261",
                    background: "#E8F7F0",
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  {item.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* QUICK ACTIONS */}
      <h2 style={{ marginTop: 30 }}>Quick Actions</h2>

      <Row gutter={16}>
        {actions.map((a, i) => (
          <Col span={6} key={i}>
            <Card
              hoverable
              style={{
                borderRadius: 12,
                transition: "0.3s",
              }}
              onClick={() => handleAction(a.title)}
            >
              <h3>{a.title}</h3>
              <p style={{ color: "#666" }}>{a.desc}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );

  function handleAction(action) {
    if (action === "Add Customer") {
      window.location.href = "/customers";
    }
    if (action === "Add Employee") {
      window.location.href = "/employees";
    }
    if (action === "New Joiner Request") {
      window.location.href = "/requests";
    }
    if (action === "Revoke Access") {
      window.location.href = "/revoke";
    }
  }
};

export default Dashboard;