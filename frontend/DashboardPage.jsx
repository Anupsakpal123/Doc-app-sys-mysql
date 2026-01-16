import React, { useEffect, useState } from "react";
import {
  FaSignOutAlt,
  FaUsers,
  FaPlus,
  FaUserMd,
  FaCalendarAlt,
  FaClipboardList,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getLoggedUser } from "../api/userAPI";

// Pages
import Profile from "../components/Profile";
import Appointments from "../components/Appointments";
import CreateAppointment from "../components/CreateAppointment";
import DoctorsList from "../components/DoctorsList";
import UsersList from "../components/UsersList";
import ApplyDoctor from "../components/ApplyDoctor";
import DoctorRequests from "../components/DoctorRequests";

const DashboardNavbar = () => {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token6163");
    navigate("/");
  };

  const fetchUser = async () => {
    const res = await getLoggedUser();
    if (res.data.success) {
      setUser(res.data.user);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  /* ======================
     CONTENT RENDER
  =======================*/
  const renderContent = () => {
    if (!user) return null;

    switch (activePage) {
      case "profile":
        return <Profile />;

      case "appointments":
        return <Appointments />;

      case "create-appointment":
        return <CreateAppointment />;

      case "doctors":
        return <DoctorsList />;

      case "users":
        return <UsersList />;

      case "apply-doctor":
        return <ApplyDoctor />;

      case "doctor-requests":
        return <DoctorRequests />;

      default:
        return <h4>Welcome to Dashboard</h4>;
    }
  };

  /* ======================
     MENU BY ROLE
  =======================*/
  const renderMenu = () => {
    if (!user) return null;

    // ADMIN
    if (user.role === "Admin") {
      return (
        <>
          <MenuBtn label="Profile" onClick={() => setActivePage("profile")} />
          <MenuBtn
            label="Appointments"
            icon={<FaCalendarAlt />}
            onClick={() => setActivePage("appointments")}
          />
          <MenuBtn
            label="All Doctors"
            icon={<FaUserMd />}
            onClick={() => setActivePage("doctors")}
          />
          <MenuBtn
            label="All Users"
            icon={<FaUsers />}
            onClick={() => setActivePage("users")}
          />
          <MenuBtn
            label="Doctor Requests"
            onClick={() => setActivePage("doctor-requests")}
          />
        </>
      );
    }

    // DOCTOR
    if (user.role === "Doctor") {
      return (
        <>
          <MenuBtn label="Profile" onClick={() => setActivePage("profile")} />
          <MenuBtn
            label="Create Appointment"
            icon={<FaPlus />}
            onClick={() => setActivePage("create-appointment")}
          />
          <MenuBtn
            label="Appointments"
            icon={<FaCalendarAlt />}
            onClick={() => setActivePage("appointments")}
          />
        </>
      );
    }

    // USER
    return (
      <>
        <MenuBtn label="Profile" onClick={() => setActivePage("profile")} />
        <MenuBtn
          label="Create Appointment"
          icon={<FaPlus />}
          onClick={() => setActivePage("create-appointment")}
        />
        <MenuBtn
          label="Appointments"
          icon={<FaCalendarAlt />}
          onClick={() => setActivePage("appointments")}
        />
        <MenuBtn
          label="Apply for Doctor"
          icon={<FaUserMd />}
          onClick={() => setActivePage("apply-doctor")}
        />
      </>
    );
  };

  return (
    <div className="container-fluid">
      <div className="row" style={{ minHeight: "100vh" }}>
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 bg-dark text-white p-3">
          <h5 className="text-center mb-4">👤 {user?.name}</h5>

          <ul className="nav flex-column">
            {renderMenu()}
            <hr />
            <li className="nav-item">
              <button
                className="btn btn-danger w-100 text-start"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="me-2" />
                Logout
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 p-4 bg-light">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

/* ======================
   MENU BUTTON
======================*/
const MenuBtn = ({ label, icon, onClick }) => (
  <li className="nav-item mb-2">
    <button className="btn btn-dark w-100 text-start" onClick={onClick}>
      {icon && <span className="me-2">{icon}</span>}
      {label}
    </button>
  </li>
);

export default DashboardNavbar;
