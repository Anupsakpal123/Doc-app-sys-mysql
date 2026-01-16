import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axiosInstance.get("/notifications").then((res) => {
      setNotifications(res.data.notifications || []);
    });
  }, []);

  return (
    <div className="card p-3">
      <h5>🔔 Notifications</h5>

      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map((n) => (
          <div key={n.id} className="alert alert-info mt-2">
            {n.message}
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
