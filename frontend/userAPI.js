import axiosInstance from "./axiosInstance";

// Register User
export const registerUser = (data) => {
  return axiosInstance.post("/users/register", data);
};

// Login User
export const loginUser = (data) => {
  return axiosInstance.post("/users/login", data);
};

// Get Logged User
export const getLoggedUser = () => {
  return axiosInstance.get("/users/getUserinfo");
};

// Doctor List
export const getDoctorList = () => {
  return axiosInstance.get("/users/doctorlist");
};
