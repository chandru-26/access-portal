import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  HistoryOutlined,
  SettingOutlined,
  AppstoreOutlined,
  StopOutlined // ✅ NEW
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider, Content } = Layout;

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedKey = () => {
    if (location.pathname === "/") return "1";
    if (location.pathname === "/customers") return "2";
    if (location.pathname === "/employees") return "3";
    if (location.pathname === "/roles") return "6";
    if (location.pathname === "/access-matrix") return "7";
    if (location.pathname === "/requests") return "4";
    if (location.pathname === "/history") return "5";
    if (location.pathname === "/revoke") return "8"; 
    return "1";
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={250} style={{ background: "#fff" }}>
        
        {/* LOGO */}
        <div style={{ padding: 20 }}>
          <img
            src="/kaleris-logo.png"
            alt="Kaleris"
            style={{ width: "140px" }}
          />
          <h3 style={{ marginTop: 10 }}>MS Access Portal</h3>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          style={{ borderRight: 0 }}
          onClick={(e) => {
            if (e.key === "1") navigate("/");
            if (e.key === "2") navigate("/customers");
            if (e.key === "3") navigate("/employees");
            if (e.key === "6") navigate("/roles");
            if (e.key === "7") navigate("/access-matrix");
            if (e.key === "4") navigate("/requests");
            if (e.key === "5") navigate("/history");
            if (e.key === "8") navigate("/revoke"); 
          }}
          items={[
            {
              key: "1",
              icon: <DashboardOutlined />,
              label: <span style={{ color: "#16B261" }}>Dashboard</span>,
            },
            {
              key: "2",
              icon: <UserOutlined />,
              label: "Customers",
            },
            {
              key: "3",
              icon: <TeamOutlined />,
              label: "Employees",
            },
            {
              key: "6",
              icon: <SettingOutlined />,
              label: "Roles",
            },
            {
              key: "7",
              icon: <AppstoreOutlined />,
              label: "Access Matrix",
            },
            {
              key: "4",
              icon: <FileTextOutlined />,
              label: "Generate Request",
            },
            {
              key: "8", 
              icon: <StopOutlined />,
              label: "Revoke Access",
            },
            {
              key: "5",
              icon: <HistoryOutlined />,
              label: "Request History",
            },
          ]}
        />
      </Sider>

      <Layout>
        <Content style={{ padding: 20, background: "#f5f7f6" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;