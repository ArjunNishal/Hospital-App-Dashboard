import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import Topbar from "../../../components/Topbar";
import Footer from "../../../components/Footer";
import Breadcrumb from "../../../components/Breadcrumb";
import jwtDecode from "jwt-decode";
import Swal from "sweetalert2";
import { axiosInstance, permissionslist } from "../../../config";
import { useNavigate } from "react-router-dom";
import { closemodalCreateAdmin } from "../../../Intoggle";

const CreateAdmin = ({ getalladmins }) => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const id = decoded.id;

  const navigate = useNavigate("");

  // const permissionslist = ["handledoc", "handleconsultant", "handlepatient"];
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    mobileno: "",
    password: "",
    role: "admin",
    permissions: [],
  });

  const {
    username,
    email,
    mobileno,
    password,
    role,
    permissions,
    firstname,
    lastname,
  } = formData;

  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isvalidmobile, setisvalidmobile] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChangemob = (e) => {
    let inputMobileNo = e.target.value.replace(/\D/g, "");
    setisvalidmobile(true);
    if (inputMobileNo.length > 11) {
      inputMobileNo = inputMobileNo.slice(0, 11);
      // setisvalidmobile(false);
    }

    setFormData({
      ...formData,
      [e.target.name]: inputMobileNo,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the email has a dot (.) after @
    if (name === "email") {
      const atIndex = value.indexOf("@");
      const dotIndex = value.lastIndexOf(".");

      const isEmailValid =
        atIndex !== -1 &&
        dotIndex !== -1 &&
        dotIndex > atIndex + 1 &&
        /[a-zA-Z]{2,}$/.test(value.substring(dotIndex + 1));

      setIsValidEmail(isEmailValid);

      if (value === "") {
        setIsValidEmail(true);
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // console.log(formData, "formData");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!isValidEmail) {
        Swal.fire({
          icon: "error",
          title: "Enter a valid email address.",
        });
        return setIsValidEmail(false);
      }
      // if (mobileno.length < 10 || mobileno.length > 11) {
      //   Swal.fire({
      //     icon: "error",
      //     title: "Enter a 10 digit or a 11 digit mobile number.",
      //   });
      //   return setisvalidmobile(false);
      // }
      if (mobileno.length < 11 || mobileno.length > 11) {
        Swal.fire({
          icon: "error",
          title: "Enter an 11 digit mobile number.",
        });
        return setisvalidmobile(false);
      }

      if (formData.permissions.length === 0) {
        return Swal.fire({
          icon: "warning",
          title: "Please select atleast one permission for creating admin.",
        });
      }

      console.log(formData, username, "formData");

      //   const admindata = new FormData();
      //   admindata.append("username", username);
      //   admindata.append("email", email);
      //   admindata.append("mobileno", mobileno);
      //   admindata.append("password", password);
      //   admindata.append("role", role);
      //   admindata.append("firstname", firstname);
      //   admindata.append("lastname", lastname);
      //   admindata.append("permissions", permissions);

      //   console.log(JSON.stringify(admindata));
      const admindata = {
        username,
        email,
        mobileno,
        password,
        role,
        firstName: firstname,
        lastName: lastname,
        permissions: permissions,
      };

      const response = await axiosInstance.post(
        "admin-role/addAdmin",
        admindata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      getalladmins();
      // Display a success message using SweetAlert2
      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "You have successfully created Admin.",
      });

      closemodalCreateAdmin();

      setFormData({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        mobileno: "",
        password: "",
        role: "admin",
        permissions: [],
      });
      //   navigate("/fpoadmins");
    } catch (error) {
      console.error("Registration error: ", error);
      //   console.log(JSON.stringify(admindata));
      // Display an error message using SweetAlert2
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.response.data.Error,
      });
    }
  };

  const handleoptionsp = (e) => {
    console.log(
      e.target.name,
      e.target.checked,
      formData.permissions.includes(`${e.target.name}`)
    );

    if (
      e.target.checked === true &&
      !formData.permissions.includes(`${e.target.name}`)
    ) {
      setFormData((prevData) => ({
        ...prevData,
        permissions: [...prevData.permissions, e.target.name],
      }));
    } else if (
      e.target.checked === false &&
      formData.permissions.includes(`${e.target.name}`)
    ) {
      setFormData((prevData) => ({
        ...prevData,
        permissions: prevData.permissions.filter(
          (permission) => permission !== e.target.name
        ),
      }));
    }
  };
  useEffect(() => {
    console.log(formData.permissions);
  }, [formData.permissions]);

  const openModalCreateAdmin = () => {
    setFormData({
      username: "",
      firstname: "",
      lastname: "",
      email: "",
      mobileno: "",
      password: "",
      role: "admin",
      permissions: [],
    });
  };

  return (
    <>
      {" "}
      <button
        data-bs-toggle="modal"
        data-bs-target="#createAdminModal"
        className="btn-primary btn d-inline "
        onClick={openModalCreateAdmin}
      >
        <i className="fa-solid fa-plus"></i> Add Admin
      </button>
      <div
        className="modal fade bd-example-modal-lg"
        id="createAdminModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="myLargeModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header ">
              <h6 className="modal-title m-0" id="myLargeModalLabel">
                Create New Admin
              </h6>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="createAdminModalbtnclose"
                aria-label="Close"
              />
            </div>
            {/*end modal-header*/}
            <div className="modal-body">
              <div>
                {/* <Sidebar />
    <Topbar />
    <div className="page-wrapper">
      <div className="page-content-tab">
        <div className="container-fluid">
          <Breadcrumb
            backpage={"Dashboard"}
            currentpage={"Create Admin"}
            backurl={""}
            maintab={""}
            heading={"Create Admin"}
          />
        </div> */}
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title">Create New Admin</h4>
                  </div>
                  <div className="card-body">
                    <div className="create-admin-form">
                      <form onSubmit={handleSubmit}>
                        <div className="row mx-0">
                          <div className=" col-md-6 col-12">
                            <div className="mb-3">
                              <label htmlFor="firstname">First Name</label>
                              <input
                                type="text"
                                className="form-control"
                                id="firstname"
                                name="firstname"
                                value={firstname}
                                onChange={handleChange}
                                aria-describedby="firstname"
                                placeholder="First Name"
                                required
                              />
                            </div>
                          </div>
                          <div className=" col-md-6 col-12">
                            <div className="mb-3">
                              <label htmlFor="lastname">Last Name</label>
                              <input
                                type="text"
                                className="form-control"
                                id="lastname"
                                value={lastname}
                                onChange={handleChange}
                                name="lastname"
                                aria-describedby="lastname"
                                placeholder="Last Name"
                              />
                            </div>
                          </div>
                          <div className=" col-md-6 col-12">
                            <div className="mb-3">
                              <label htmlFor="username">Username</label>
                              <input
                                type="text"
                                className="form-control"
                                id="username"
                                value={username}
                                onChange={handleChange}
                                name="username"
                                aria-describedby="username"
                                placeholder="username"
                                required
                              />
                            </div>
                          </div>
                          <div className=" col-md-6 col-12">
                            <div className="mb-3">
                              <label htmlFor="email">Email</label>
                              <input
                                type="text"
                                className="form-control"
                                id="email"
                                value={email}
                                onChange={handleChange}
                                name="email"
                                aria-describedby="email"
                                placeholder="Email"
                                required
                              />
                            </div>
                          </div>
                          <div className=" col-md-6 col-12">
                            <div className="mb-3">
                              <label htmlFor="mobileno">Mobile No.</label>
                              <input
                                type="text"
                                className="form-control"
                                id="mobileno"
                                value={mobileno}
                                onChange={handleChangemob}
                                name="mobileno"
                                aria-describedby="mobileno"
                                placeholder="Mobile No."
                                required
                              />
                            </div>
                          </div>
                          <div className=" col-md-6 col-12">
                            {/* <div className="mb-3">
                              <label htmlFor="password">Password</label>
                              <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={password}
                                onChange={handleChange}
                                aria-describedby="password"
                                placeholder="Password"
                                required
                              />
                            </div> */}
                            <label htmlFor="password">Password</label>
                            <div className="input-group mb-3 input-group-merge">
                              <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="form-control"
                                name="password"
                                value={password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                aria-describedby="password"
                                required
                                autocomplete="off"
                              />
                              <span
                                className="input-group-text cursor-pointer"
                                onClick={handleTogglePassword}
                              >
                                <i
                                  className={`fa-regular ${
                                    showPassword ? "fa-eye" : "fa-eye-slash"
                                  }`}
                                />
                              </span>
                            </div>
                          </div>
                          <div className="col-12">
                            <label className="mb-3">
                              <b>Permissions</b>
                            </label>
                            <div className="row mb-3 mx-0">
                              {permissionslist.map((el, index) => {
                                return (
                                  <div
                                    key={index}
                                    className="col-md-4 mb-2 col-12"
                                  >
                                    <input
                                      type="checkbox"
                                      className="btn-check"
                                      name={el}
                                      id={`btn-check-outlined${index}`}
                                      checked={
                                        formData.permissions.includes(el)
                                          ? true
                                          : false
                                      }
                                      onChange={handleoptionsp}
                                      autoComplete="off"
                                    />
                                    <label
                                      className="btn btn-outline-primary w-100"
                                      htmlFor={`btn-check-outlined${index}`}
                                    >
                                      {el}
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className="col-12 text-center ">
                            <button className="btn btn-primary btn-lg">
                              Create Admin
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                {/* <Footer />
      </div>
    </div> */}
              </div>{" "}
            </div>
            {/*end modal-body*/}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-de-danger btn-sm"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
            </div>
            {/*end modal-footer*/}
          </div>
          {/*end modal-content*/}
        </div>
        {/*end modal-dialog*/}
      </div>
    </>
  );
};

export default CreateAdmin;
