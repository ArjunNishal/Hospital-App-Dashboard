import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { axiosInstance } from "../config";

const Loginpage = () => {
  const [formData, setFormData] = useState({
    mobileno: "",
    password: "",
  });

  const [selectedrole, setselectedrole] = useState("");
  const [superlogin, setsuperlogin] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("superlogin")) {
      setsuperlogin(true);
      setselectedrole("superadmin");
    }
  }, []);

  const { mobileno, password } = formData;

  const navigate = useNavigate("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        `admin-log/login-${selectedrole}`,
        formData
      );
      // Assuming response structure is { admin: adminData, token: authToken }
      const { admin, token } = response.data;
      // Save token to localStorage or sessionStorage
      localStorage.setItem("admin", token);
      navigate("/dashboard");
    } catch (error) {
      // Handle errors with SweetAlert
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response.data.message,
      });
    }
  };

  const changeslide = () => {};

  return (
    <div className="auth-page auth-bg">
      {/* Log In page */}
      <div className="container-md">
        <div className="row vh-100 d-flex justify-content-center">
          <div className="col-12 align-self-center">
            <div className="card-body">
              <div className="row">
                <div className="col-lg-4 mx-auto">
                  <div className="card">
                    <div className="card-body p-0 ">
                      <div className="text-center p-3">
                        <Link to="/" className="logo logo-admin">
                          <img
                            src="assets/images/ZoCare2.png"
                            height={70}
                            alt="logo"
                            className="auth-logo"
                          />
                        </Link>
                        <h4 className="mt-3 mb-1 fw-semibold  font-18">
                          ZoCARE
                        </h4>
                        <p className="text-muted mb-0">
                          Sign in to continue to ZoCARE
                        </p>
                      </div>
                    </div>
                    <div className="card-body pt-0">
                      <div
                        id="carouselExampleSlidesOnly"
                        className="carousel slide"
                        // data-bs-ride="carousel"
                        data-bs-ride="false"
                      >
                        <div className="carousel-inner">
                          {/* superlogin */}
                          {!superlogin && (
                            <div
                              className={`carousel-item roles_carousel_item  ${
                                !superlogin ? "active" : ""
                              }`}
                            >
                              <div className="selectroles_box mt-5">
                                <div className="row mx-0">
                                  <div className="col-12">
                                    <p className="roles_heading text-center ">
                                      Sign in as
                                    </p>
                                  </div>
                                  <div className="col-4">
                                    <div
                                      data-bs-target="#carouselExampleSlidesOnly"
                                      data-bs-slide="next"
                                      onClick={() => {
                                        // changeslide();
                                        setselectedrole("admin");
                                        setFormData({
                                          mobileno: "",
                                          password: "",
                                        });
                                      }}
                                      className={`d-flex flex-column justify-content-center  role_box align-items-center ${
                                        selectedrole === "admin"
                                          ? "selected"
                                          : ""
                                      } `}
                                    >
                                      {" "}
                                      {selectedrole === "admin" && (
                                        <div className="role-check">
                                          <img
                                            src="assets/images/roles/check.png"
                                            alt="check"
                                          />
                                        </div>
                                      )}
                                      <img
                                        className="role_image"
                                        src="assets/images/roles/admin.png"
                                        alt="admin"
                                      />
                                      <p className="role_text m-0">Admin</p>
                                    </div>
                                  </div>
                                  <div className="col-4">
                                    <div
                                      data-bs-target="#carouselExampleSlidesOnly"
                                      data-bs-slide="next"
                                      onClick={() => {
                                        // changeslide();
                                        setselectedrole("consultant");
                                        setFormData({
                                          mobileno: "",
                                          password: "",
                                        });
                                      }}
                                      className={`d-flex flex-column justify-content-center  role_box align-items-center ${
                                        selectedrole === "consultant"
                                          ? "selected"
                                          : ""
                                      } `}
                                    >
                                      {selectedrole === "consultant" && (
                                        <div className="role-check">
                                          <img
                                            src="assets/images/roles/check.png"
                                            alt="check"
                                          />
                                        </div>
                                      )}
                                      <img
                                        className="role_image"
                                        src="assets/images/roles/consultant.png"
                                        alt="consultant"
                                      />
                                      <p className="role_text m-0">
                                        Consultant
                                      </p>
                                    </div>
                                  </div>
                                  <div
                                    data-bs-target="#carouselExampleSlidesOnly"
                                    data-bs-slide="next"
                                    onClick={() => {
                                      // changeslide();
                                      setselectedrole("doctor");
                                      setFormData({
                                        mobileno: "",
                                        password: "",
                                      });
                                    }}
                                    className="col-4"
                                  >
                                    <div
                                      className={`d-flex flex-column justify-content-center  role_box align-items-center ${
                                        selectedrole === "doctor"
                                          ? "selected"
                                          : ""
                                      } `}
                                    >
                                      {" "}
                                      {selectedrole === "doctor" && (
                                        <div className="role-check">
                                          <img
                                            src="assets/images/roles/check.png"
                                            alt="check"
                                          />
                                        </div>
                                      )}
                                      <img
                                        className="role_image"
                                        src="assets/images/roles/doctor.png"
                                        alt="doctor"
                                      />
                                      <p className="role_text m-0">Doctor</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          <div
                            className={`carousel-item  ${
                              superlogin ? "active" : ""
                            }`}
                          >
                            <form className="mt-4" onSubmit={handleLogin}>
                              {/* {selectedrole} */}
                              <div className="form-group mb-2">
                                <label
                                  className="form-label"
                                  htmlFor="mobileno"
                                >
                                  Mobile No.
                                </label>
                                <input
                                  type="tel"
                                  className="form-control"
                                  id="mobileno"
                                  name="mobileno"
                                  value={mobileno}
                                  onChange={(e) => {
                                    let inputMobileNo = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    ); // Remove non-numeric characters
                                    // Ensure the mobile number is not longer than 10 digits
                                    if (inputMobileNo.length > 11) {
                                      inputMobileNo = inputMobileNo.slice(
                                        0,
                                        11
                                      );
                                    }
                                    setFormData({
                                      ...formData,
                                      [e.target.name]: inputMobileNo,
                                    });
                                  }}
                                  placeholder="Enter Mobile No."
                                />
                              </div>
                              {/*end form-group*/}
                              <div className="form-group">
                                <label
                                  className="form-label"
                                  htmlFor="password"
                                >
                                  Password
                                </label>
                                <input
                                  type="password"
                                  className="form-control"
                                  name="password"
                                  id="password"
                                  value={password}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      [e.target.name]: e.target.value,
                                    })
                                  }
                                  placeholder="Enter password"
                                />
                              </div>
                              {/*end form-group*/}
                              <div className="form-group row mt-3">
                                <div className="col-sm-6">
                                  {/* <div className="form-check form-switch form-switch-success">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="customSwitchSuccess"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="customSwitchSuccess"
                              >
                                Remember me
                              </label>
                            </div> */}
                                </div>
                                {/*end col*/}
                                <div className="col-sm-6 text-end">
                                  <Link
                                    to={`/forgotpassword?r=${btoa(
                                      selectedrole
                                    )}`}
                                    className="text-muted font-13"
                                  >
                                    <i className="dripicons-lock" /> Forgot
                                    password?
                                  </Link>
                                </div>
                                {/*end col*/}
                              </div>
                              {/*end form-group*/}
                              <div className="form-group mb-0 row">
                                <div className="col-12">
                                  <div className="d-grid mt-3">
                                    <button
                                      className="btn btn-primary"
                                      type="submit"
                                    >
                                      Log In{" "}
                                      <i className="fas fa-sign-in-alt ms-1" />
                                    </button>
                                  </div>
                                </div>
                                {/*end col*/}
                              </div>
                              {/*end form-group*/}
                            </form>
                            {!superlogin && (
                              <div className="text-center">
                                <button
                                  data-bs-target="#carouselExampleSlidesOnly"
                                  data-bs-slide="prev"
                                  className="btn text-primary"
                                  onClick={() => {
                                    setFormData({
                                      mobileno: "",
                                      password: "",
                                    });
                                  }}
                                >
                                  Back
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/*end form*/}
                      {/* <div className="m-3 text-center text-muted">
                        <p className="mb-0">
                          Don't have an account ?
                          <Link
                            to="/signup"
                            className="text-primary ms-2"
                          >
                            Free Resister
                          </Link>
                        </p>
                      </div> */}
                      {/* <hr className="hr-dashed mt-4" /> */}
                    </div>
                    {/*end card-body*/}
                  </div>
                  {/*end card*/}
                </div>
                {/*end col*/}
              </div>
              {/*end row*/}
            </div>
            {/*end card-body*/}
          </div>
          {/*end col*/}
        </div>
        {/*end row*/}
      </div>
      {/*end container*/}
    </div>
  );
};

export default Loginpage;
