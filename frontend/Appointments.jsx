import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axiosInstance.get(
        "/appointments/getAppointmentsByUser"
      );
      console.log("Appointments 👉", res.data);
      setAppointments(res.data.appointments || []);
    } catch (error) {
      console.error("Appointments error ❌", error.response || error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading appointments...</p>;

  return (
    <div className="card p-4">
      <h4 className="mb-3">My Appointments</h4>

      {appointments.length === 0 ? (
        <p className="text-muted">No appointments found</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Date & Time</th>
                <th>Doctor ID</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((app, index) => (
                <tr key={app.id}>
                  <td>{index + 1}</td>
                  <td>{new Date(app.dateTime).toLocaleString()}</td>
                  <td>{app.doctorId}</td>
                  <td>
                    <span
                      className={`badge ${
                        app.status === "Pending"
                          ? "bg-warning"
                          : app.status === "Accepted"
                          ? "bg-success"
                          : app.status === "Reject"
                          ? "bg-danger"
                          : "bg-secondary"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Appointments;
