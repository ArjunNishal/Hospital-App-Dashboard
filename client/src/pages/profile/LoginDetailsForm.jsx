import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { axiosInstance } from "../../config";
import jwtDecode from "jwt-decode";
import ChangePassword from "./ChangePassword";
import ForgotPassForm from "./ForgotPassForm";

const LoginDetailsForm = ({ profile, getProfile }) => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const id = decoded.id;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileno: "",
    username: "",
  });

  const { firstName, lastName, email, mobileno, username } = formData;
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isvalidmobile, setisvalidmobile] = useState(true);
  const [Disabled, setDisabled] = useState(true);
  const [updating, setupdating] = useState(false);

  useEffect(() => {
    setFormData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      mobileno: profile.mobileno,
      username: profile.username,
    });
  }, [profile]);

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
      setFormData({
        ...formData,
        [e.target.name]: value,
      });
    } else if (name === "mobileno") {
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
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setupdating(true);
    try {
      if (!isValidEmail) {
        Swal.fire({
          icon: "error",
          title: "Enter a valid email address.",
        });
        return setIsValidEmail(false);
      }
      // old validation
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

      const admindata = {
        username,
        email,
        mobileno,
        firstName,
        lastName,
      };

      const response = await axiosInstance.post(
        `admin-role/updateprofileDetails`,
        admindata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      getProfile();
      // Display a success message using SweetAlert2
      Swal.fire({
        icon: "success",
        title: "Update Successful",
        text: "You have successfully updated account details.",
      });

      setDisabled(true);
      setupdating(false);
    } catch (error) {
      console.error("Update error: ", error);
      //   console.log(JSON.stringify(admindata));
      // Display an error message using SweetAlert2
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response.data.message,
      });
      setupdating(false);
    }
  };

  return (
    <div className="logindetails_form">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between  flex-wrap ">
            <h4 className="card-title m-0">Account settings</h4>
            <div>
              <button
                onClick={() => {
                  setDisabled(!Disabled);
                }}
                className="btn btn-sm btn-primary"
              >
                {Disabled ? (
                  <i className="fa-solid fa-pen-to-square"></i>
                ) : (
                  <i className="fa-regular fa-circle-xmark"></i>
                )}{" "}
                Edit Details
              </button>
              <button
                data-bs-toggle="collapse"
                data-bs-target="#collapseExample"
                className="btn btn-sm mx-1 btn-outline-primary"
              >
                Change password
              </button>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div>
            <div className="collapse" id="collapseExample">
              <div className="card shadow">
                <div className="card-header">
                  <div className="card-title">
                    <h4>Change Password</h4>
                  </div>
                </div>
                <div className="card-body">
                  <ChangePassword profile={profile} getProfile={getProfile} />
                </div>
              </div>
            </div>
            <div className="collapse" id="collapseExample2">
              <div className="card shadow">
                <div className="card-header">
                  <div className="card-title">
                    <h4>Forgot Password</h4>
                  </div>
                </div>
                <div className="card-body">
                  <ForgotPassForm profile={profile} getProfile={getProfile} />
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmitEdit}>
            <div className="row mx-0 justify-content-center ">
              <div className="col-md-6 col-lg-4 col-12">
                <div className="mb-3">
                  <label htmlFor="firstname">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstname"
                    name="firstName"
                    value={firstName}
                    onChange={handleChange}
                    aria-describedby="firstname"
                    placeholder="First Name"
                    required
                    disabled={Disabled}
                  />
                </div>
              </div>

              <div className="col-md-6 col-lg-4 col-12">
                <div className="mb-3">
                  <label htmlFor="lastname">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    value={lastName}
                    onChange={handleChange}
                    name="lastName"
                    aria-describedby="lastname"
                    placeholder="Last Name"
                    disabled={Disabled}
                  />
                </div>
              </div>
              <div className="col-md-6 col-lg-4 col-12">
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
                    disabled={Disabled}
                  />
                </div>
              </div>
              <div className="col-md-6 col-lg-4 col-12">
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
                    disabled={Disabled}
                  />
                </div>
              </div>
              <div className="col-md-6 col-lg-4 col-12">
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
                    disabled={Disabled}
                  />
                </div>
              </div>
              {!Disabled && (
                <div className="col-12 text-center  my-2">
                  <button
                    className="btn btn-primary"
                    disabled={Disabled || updating}
                    type="submit"
                  >
                    {updating ? "Updating..." : "Save Details"}
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginDetailsForm;
