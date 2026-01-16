import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  // 🔹 Fetch logged-in user (ON LOAD + AFTER UPLOAD)
  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/users/getUserinfo");

      if (res.data.success) {
        const userData = res.data.user;
        setUser(userData);

        // ✅ SET IMAGE FROM DB (IMPORTANT)
        if (userData.profileImage) {
          setPreview(
            `http://localhost:7005/uploads/${userData.profileImage}?t=${Date.now()}`
          );
        } else {
          setPreview("");
        }
      }
    } catch (error) {
      console.error("Profile fetch error ❌", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // 🔹 Manual file select
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    // 🔹 TEMP PREVIEW (before upload)
    const tempUrl = URL.createObjectURL(selectedFile);
    setPreview(tempUrl);
  };

  // 🔹 Upload image
  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axiosInstance.post(
        "/users/uploadProfile",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        alert("Profile image uploaded successfully ✅");
        setFile(null);
        fetchUser(); // ✅ FETCH AGAIN FROM DB
      }
    } catch (error) {
      console.error("Upload error ❌", error);
      alert("Image upload failed");
    }
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="card p-4" style={{ maxWidth: "420px" }}>
      <h4 className="mb-3">My Profile</h4>

      {/* PROFILE IMAGE */}
      <div className="text-center mb-3">
        <img
          src={preview || "https://via.placeholder.com/150?text=No+Image"}
          alt="profile"
          className="rounded-circle"
          style={{
            width: 150,
            height: 150,
            objectFit: "cover",
            border: "3px solid green",
          }}
        />
      </div>

      {/* FILE INPUT */}
      <input
        type="file"
        className="form-control mb-2"
        accept="image/*"
        onChange={handleFileChange}
      />

      <button
        className="btn btn-success w-100 mb-3"
        onClick={handleUpload}
      >
        Upload Image
      </button>

      <hr />

      {/* USER INFO */}
      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Role:</b> {user.role}</p>
    </div>
  );
};

export default Profile;
