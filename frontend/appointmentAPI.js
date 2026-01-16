import axiosInstance from "./axiosInstance";

export const saveAppointment = (data) => {
  return axiosInstance.post("/appointments/createAppoint", data);
};