import React from "react";
import { NavLink } from "react-router-dom";
import "./sidebar.css";

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Adminpanel</h2>
      <nav>
        <ul>
          <li>
            <NavLink
              to="/admin/members"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Medlemmar
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/resources"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Resurser
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/bookings"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Bokningar
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/sensors"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Sensorer
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;