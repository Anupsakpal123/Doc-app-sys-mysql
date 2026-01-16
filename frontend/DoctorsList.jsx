// src/components/DoctorsList.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axiosInstance.get("/users/doctorlist");
      console.log("Doctors 👉", res.data);

      if (res.data.success) {
        setDoctors(res.data.doctors || []);
      }
    } catch (error) {
      console.error("Doctors fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading doctors...</p>;

  return (
    <div className="card p-4">
      <h4>All Doctors</h4>

      {doctors.length === 0 ? (
        <p>No doctors found</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc, i) => (
              <tr key={doc.id}>
                <td>{i + 1}</td>
                <td>{doc.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DoctorsList;
