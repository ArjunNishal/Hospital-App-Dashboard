import axios from "axios";
import Swal from "sweetalert2";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/",
  // baseURL: "https://zocare.onrender.com/api/",
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(
      error,
      "error from interceptors //////////////////////////////////////////////"
    );
    if (error.response && error.response.status === 403) {
      localStorage.removeItem("admin");

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export const renderUrl = "http://localhost:8000/";

// export const
// admin permissions
export const permissionslist = [
  "Manage Doctors",
  "Create Doctors",
  "Manage Consultants",
  "Create Consultants",
  "Manage Blog Categories",
  "Create Blog Categories",
  "Manage Blogs",
  "Create Blogs",
  "About us",
  "Privacy",
  "Query",
  "Manage Weeks",
  "Create Weeks",
  "Manage Master Weeks",
  "Terms",
];

// consultant permissions
export const permissionslistconsultant = [
  "Manage Doctors",
  "Create Doctors",
  "Create Patient",
  "Handle Patient",
  "Query",
  "Manage Blogs",
  "Create Blogs",
  "Manage Blog Categories",
  "Create Blog Categories",
  "Manage Weeks",
  "Create Weeks",
  "Manage Master Weeks",
  "Appointments",
];

export const addpermissions = [
  "Create Patient",
  "Appointments",
  "Handle Patient",
];

// doctor permissions
export const permissionslistdoc = [
  "Manage Consultants",
  "Create Consultants",
  "Create Patient",
  "Handle Patient",
  "Query",
  "Manage Blogs",
  "Create Blogs",
  "Manage Blog Categories",
  "Create Blog Categories",
  "Manage Weeks",
  "Create Weeks",
  "Manage Master Weeks",
  "Appointments",
];
