import React, { useEffect, useState } from "react";
import { getDoctorList } from "../api/userAPI";
import { saveAppointment } from "../api/appointmentAPI";

const CreateAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [doctorID, setDoctorId] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch doctors
  async function fetchData() {
    try {
      const res = await getDoctorList();
      console.log("Doctor List 👉", res.data);

      if (res.data.success) {
        setDoctors(res.data.doctors);
      }
    } catch (error) {
      console.error("Doctor fetch error ❌", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Create appointment
  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Create Appointment Button Clicked ✅");

    if (!dateTimeInput || !doctorID) {
      alert("Please select date & doctor");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        dateTime: dateTimeInput,
        doctorId: doctorID,
      };

      console.log("Sending Payload 👉", payload);

      const res = await saveAppointment(payload);

      console.log("Create Appointment Response 👉", res.data);

      if (res.data.success) {
        alert("Appointment created successfully ✅");

        // reset form
        setDateTimeInput("");
        setDoctorId("");
      } else {
        alert(res.data.msg || "Something went wrong");
      }
    } catch (error) {
      console.error(
        "Create appointment error ❌",
        error.response?.data || error
      );
      alert("Server error while creating appointment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-4">
      <h4>Create Appointment</h4>

      <form onSubmit={handleSubmit}>
        {/* Date & Time */}
        <div className="mb-3">
          <label className="form-label">Select Date & Time</label>
          <input
            type="datetime-local"
            className="form-control"
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
          />
        </div>

        {/* Doctor List */}
        <div className="mb-3">
          <label className="form-label">Select Doctor</label>
          <select
            className="form-select"
            value={doctorID}
            onChange={(e) => setDoctorId(e.target.value)}
          >
            <option value="">-- Select Doctor --</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create Appointment"}
        </button>
      </form>
    </div>
  );
};

export default CreateAppointment;
