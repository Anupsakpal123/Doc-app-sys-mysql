// src/components/UsersList.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/users/allUsers");
      console.log("Users 👉", res.data);

      if (res.data.success) {
        setUsers(res.data.users || []);
      }
    } catch (error) {
      console.error("Users fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="card p-4">
      <h4>All Users</h4>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id}>
                <td>{i + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersList;
