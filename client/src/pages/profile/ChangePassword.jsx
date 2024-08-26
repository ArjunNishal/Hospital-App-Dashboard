import React, { useState } from "react";
import { axiosInstance } from "../../config";
import jwtDecode from "jwt-decode";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { closepasswordform } from "../../Intoggle";

const ChangePassword = ({ profile, getProfile }) => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const id = decoded.id;
  const [oldpass, setoldpass] = useState("");
  const [newpass, setnewpass] = useState("");
  const [confirmpass, setconfirmpass] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [oldpassmatch, setoldpassmatch] = useState(true);

  const handleSubmitresetpass = async (e) => {
    e.preventDefault();
    getProfile();

    if (oldpass !== profile.password) {
      return Swal.fire({
        icon: "warning",
        title: "Your Old password is wrong.",
        // text: "Error saving Profile details",
      });
    }

    // Check if the old password matches the admin password
    if (oldpass !== profile.password) {
      return setoldpassmatch(false);
    }

    if (oldpass === newpass) {
      return Swal.fire({
        icon: "warning",
        title:
          "Your Old password and New Password are same, please change New Password.",
        // text: "Error saving Profile details",
      });
    }

    try {
      // Make a PUT request to your backend API with the new password
      const response = await axiosInstance.put(
        `admin-log/resetpassword/${
          decoded.role === "superadmin" || decoded.role === "admin"
            ? id
            : decoded.memberid
        }/${token}`,
        {
          password: newpass,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the request was successful
      if (response.status === 200) {
        console.log("Password changed successfully");
        Swal.fire({
          icon: "success",
          title: "Password reset successfully.",
        });
        setnewpass("");
        setconfirmpass("");
        setoldpass("");
        getProfile();
        closepasswordform();
      }
    } catch (error) {
      console.error("Error changing password:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error saving Profile details",
      });
    }
  };

  const handlepassmatch = (e) => {
    if (e.target.name === "newpass") {
      if (e.target.value === confirmpass) {
        setPasswordsMatch(true);
      } else {
        setPasswordsMatch(false);
      }
    }
    if (e.target.name === "confirmpass") {
      if (e.target.value === newpass) {
        setPasswordsMatch(true);
      } else {
        setPasswordsMatch(false);
      }
    }
  };

  const toggleforgotpass = () => {
    closepasswordform();
  };

  return (
    <div>
      <form onSubmit={handleSubmitresetpass} id="formAccountSettings">
        <div className="row">
          <div className={`mb-3 col-12`}>
            <label htmlFor="name" className="form-label">
              Old Password
            </label>
            <input
              className={`form-control ${oldpassmatch ? "" : "is-invalid"}`}
              type="password"
              name="oldpass"
              value={oldpass}
              onChange={(e) => {
                setoldpass(e.target.value);
                setoldpassmatch(true);
              }}
            />
            {!oldpassmatch && (
              <div
                id="validationServerUsernameFeedback"
                className="invalid-feedback"
              >
                Password incorrect
              </div>
            )}
          </div>
          <div className={`mb-3 col-12 `}>
            <label htmlFor="promoter" className="form-label">
              New Password
            </label>
            <input
              type="password"
              className={`form-control ${
                confirmpass !== "" && newpass !== "" && passwordsMatch
                  ? "is-valid"
                  : confirmpass === "" && newpass === ""
                  ? ""
                  : "is-invalid"
              }`}
              name="newpass"
              value={newpass}
              onChange={(e) => {
                setnewpass(e.target.value);
                handlepassmatch(e);
              }}
            />
          </div>
          <div className={`mb-3 col-12`}>
            <label htmlFor="sharePerMember" className="form-label">
              Confirm New Password
            </label>
            <input
              type="password"
              className={`form-control ${
                confirmpass !== "" && newpass !== "" && passwordsMatch
                  ? "is-valid"
                  : confirmpass === "" && newpass === ""
                  ? ""
                  : "is-invalid"
              }`}
              name="confirmpass"
              value={confirmpass}
              onChange={(e) => {
                setconfirmpass(e.target.value);
                handlepassmatch(e);
              }}
            />
          </div>
        </div>
        <div className="mt-2">
          <button
            type="submit"
            disabled={
              passwordsMatch &&
              newpass !== "" &&
              oldpass !== "" &&
              confirmpass !== ""
                ? false
                : true
            }
            className="btn btn-primary me-2"
          >
            Save changes
          </button>
          <button
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseExample"
            id="changepasswordclosebtn"
            // onClick={() => setshowtab("")}
            className="btn btn-outline-secondary me-2"
          >
            Cancel
          </button>
        </div>
        <div className="my-2">
          <Link
            to={""}
            className="text-primary"
            onClick={toggleforgotpass}
            data-bs-toggle="collapse"
            data-bs-target="#collapseExample2"
          >
            Forgot Password ?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
