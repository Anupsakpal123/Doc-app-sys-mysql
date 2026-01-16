import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const DoctorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get(
        "/admin/doctor-requests" // ✅ CORRECT API
      );

      if (res.data.success) {
        setRequests(res.data.requests);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load doctor requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await axiosInstance.patch(
        "/admin/doctor-requests",
        { requestId: id, status }
      );

      alert(res.data.msg);
      fetchRequests();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (loading) return <p>Loading doctor requests...</p>;

  return (
    <div className="card p-4">
      <h4>Doctor Requests</h4>

      {requests.length === 0 ? (
        <p>No doctor requests found</p>
      ) : (
        requests.map((req) => (
          <div key={req.id} className="border p-3 mb-3">
            <p><b>Name:</b> {req.user.name}</p>
            <p><b>Email:</b> {req.user.email}</p>
            <p><b>Specialist:</b> {req.specialist}</p>
            <p><b>Fees:</b> ₹{req.fees}</p>
            <p><b>Status:</b> {req.status}</p>

            {req.status === "Pending" && (
              <>
                <button
                  className="btn btn-success me-2"
                  onClick={() => updateStatus(req.id, "Approved")}
                >
                  Approve
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => updateStatus(req.id, "Rejected")}
                >
                  Reject
                </button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default DoctorRequests;
