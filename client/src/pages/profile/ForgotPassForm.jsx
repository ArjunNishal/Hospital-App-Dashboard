import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../config";
import jwtDecode from "jwt-decode";
import Swal from "sweetalert2";

const ForgotPassForm = ({ profile, getProfile }) => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const id = decoded.id;
  const [loading, setLoading] = useState(false);
  const [email, setemail] = useState("");
  const [emailsent, setEmailsent] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setemail(profile.email);
  }, [profile]);

  const forgotpass = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (email !== profile.email) {
        setLoading(false);
        return Swal.fire({
          icon: "error",
          title: "Error",
          text: "Email is incorrect",
        });
      }
      const res = await axiosInstance.post(
        "admin-log/resetpassword",
        {
          email,
          role: decoded.role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res, "res");
      if (res.status === 200) {
        setMessage(
          `Reset your password using the link shared on your mail i.e., ${email}`
        );
        setEmailsent(true);
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 404) {
        setMessage(error.response.data.message);
      } else {
        setMessage(error.response.data.message);
      }
    }
    setLoading(false);
  };
  return (
    <div>
      {" "}
      <form onSubmit={forgotpass} id="formAccountSettings">
        {loading ? (
          <div>
            <div className="d-flex justify-content-center">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
            <div>
              <p>Sending Reset Link</p>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className={`mb-3 col-12`}>
              <label htmlFor="name" className="form-label">
                Email
              </label>
              <input
                className="form-control"
                type="email"
                name="email"
                value={email}
                disabled
                onChange={(e) => {
                  setemail(e.target.value);
                }}
              />
            </div>
            <p>We"ll send you a link to reset your password on your email.</p>
          </div>
        )}
        <div className="mt-2">
          {message && <div className="text-center">{message}</div>}
          {emailsent ? (
            <div className=" d-flex flex-column align-items-center mt-3">
              <p>If you did'nt get an Email, resend Link </p>
              <div className="d-flex justify-content-center gap-2 align-items-center">
                {" "}
                <button className="btn btn-danger " type="submit">
                  Resend
                </button>
                <button
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseExample2"
                  //   onClick={() => setshowtab("")}
                  className="btn btn-outline-secondary me-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className=" text-center">
              <button className="btn btn-danger me-2" type="submit">
                Send Email
              </button>
              <button
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseExample2"
                // onClick={() => setshowtab("")}
                className="btn btn-outline-secondary me-2"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ForgotPassForm;
