import { useState } from "react";
import { NavLink } from "react-router-dom";
import { sideBarMenu } from "../utils/constants";
import "../styles/sidebar.css";

export default function Sidebar() {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (title) => {
    setOpenMenu(openMenu === title ? null : title);
  };

  return (
    <aside className="sidebar">
      <div className="menu-section">
        {sideBarMenu.map((item) => {
          if (item.children) {
            const isOpen = openMenu === item.title;

            return (
              <div key={item.title}>
                <div
                  className="menu-item menu-parent"
                  onClick={() => toggleMenu(item.title)}
                >
                  <span>
                    <i className={item.icon} /> {item.title}
                  </span>

                  <i className="mdi mdi-chevron-right" />
                </div>

                {isOpen && (
                  <div className="submenu">
                    {item.children.map((sub) => (
                      <NavLink
                        key={sub.path}
                        to={sub.path}
                        className="submenu-item"
                      >
                        {sub.title}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink key={item.path} to={item.path} className="menu-item">
              {item.title}
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
}
