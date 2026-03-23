import { useState } from "react";
import comp_name from "../assets/jtk-company-name.jpeg";
import "../styles/navbar.css";
import { Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const menu = (
    <Menu
      items={[
        {
          key: "logout",
          label: "Logout",
          onClick: logout,
        },
      ]}
    />
  );

  const items = [
    {
      label: <a onClick={logout}>Logout</a>,
      key: "logout",
    },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
          src={comp_name}
          alt="JTK Trans Logo"
          className="nav-bar-comp-name"
        />
      </div>

      <div className="navbar-right">
        {/* <div className="avatar" onClick={() => setOpen(!open)}>
          👤
        </div>

        {open && (
          <div className="dropdown">
            <button onClick={logout}>Logout</button>
          </div>
        )} */}
        <Dropdown menu={{ items }} trigger={["click"]}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <div className="avatar">
                <UserOutlined />
              </div>
            </Space>
          </a>
        </Dropdown>
      </div>
    </nav>
  );
}
