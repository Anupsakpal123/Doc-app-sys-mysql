import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const ApplyDoctor = () => {
  const [specialist, setSpecialist] = useState("");
  const [fees, setFees] = useState("");
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  // 🔹 Check if already applied
  const checkStatus = async () => {
    try {
      const res = await axiosInstance.get("/doctor/my-request");
      if (res.data.success && res.data.request) {
        setApplied(true);
      }
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const apply = async (e) => {
    e.preventDefault();

    if (!specialist || !fees) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.post("/doctor/apply", {
        specialist,
        fees,
      });

      alert(res.data.msg);
      setApplied(true);
    } catch (error) {
      alert(error.response?.data?.msg || "You have already applied");
      setApplied(true);
    } finally {
      setLoading(false);
    }
  };

  // 🔒 Already applied UI
  if (applied) {
    return (
      <div className="card p-4 text-center" style={{ maxWidth: "450px" }}>
        <h4>Doctor Request</h4>
        <p className="text-warning fw-bold mt-2">
          ⏳ Your request is pending approval by admin
        </p>
      </div>
    );
  }

  return (
    <div className="card p-4" style={{ maxWidth: "450px" }}>
      <h4 className="mb-3">Apply for Doctor</h4>

      <form onSubmit={apply}>
        <div className="mb-3">
          <label className="form-label">Specialist</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Cardiologist"
            value={specialist}
            onChange={(e) => setSpecialist(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Fees</label>
          <input
            type="number"
            className="form-control"
            placeholder="e.g. 500"
            value={fees}
            onChange={(e) => setFees(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Applying..." : "Apply for Doctor"}
        </button>
      </form>
    </div>
  );
};

export default ApplyDoctor;
