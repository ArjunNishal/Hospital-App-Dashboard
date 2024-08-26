import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { axiosInstance } from "../config";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newpass, setnewpass] = useState("");
  const [confirmpass, setconfirmpass] = useState("");

  const [loading, setLoading] = useState(false);
  //   const { id, token } = useParams();
  const navigate = useNavigate();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const token = params.get("token");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !id) {
      navigate("/");
    }
    const decodedToken = jwtDecode(token);
    setEmail(decodedToken.email);
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (newpass !== confirmpass) {
        return Swal.fire({
          icon: "error",
          title: "Error",
          text: "Passwords not match",
        });
      }
      const res = await axiosInstance.put(
        `admin-log/unauth/resetpassword/${id}/${token}`,
        {
          password: newpass,
          confirmPassword: confirmpass,
        }
      );
      Swal.fire({
        icon: "success",
        title: "Password reset successfully.",
      }).then(() => {
        navigate("/"); // Redirect to home page
      });
      setLoading(false);
    } catch (error) {
      console.log(error, "error");
      setError(error.response.data.message);
      setLoading(false);
    }
  };
  return (
    <div className="auth-page auth-bg">
      {/* Log In page */}
      <div className="container">
        <div className="row vh-100 d-flex justify-content-center">
          <div className="col-12 align-self-center">
            <div className="row">
              <div className="col-lg-5 mx-auto">
                <div className="card">
                  <div className="card-body p-0 auth-header-box rounded">
                    <div className="text-center p-3">
                      <a href="index.html" className="logo logo-admin">
                        <img
                          src="assets/images/ZoCareW2.png"
                          height={50}
                          alt="logo"
                          className="auth-logo"
                        />
                      </a>
                      <h4 className="mt-3 mb-1 fw-semibold text-white font-18">
                        Reset Password For ZoCARE
                      </h4>
                      <p className="text-muted  mb-0">
                        Enter your New Password
                      </p>
                    </div>
                  </div>
                  <div className="card-body pt-0">
                    <form className="my-4" onSubmit={handleSubmit}>
                      <div className="form-group mb-3">
                        <label className="form-label" htmlFor="username">
                          New Password
                        </label>
                        <input
                          type="password"
                          className={`form-control ${
                            newpass !== "" ? "is-valid" : ""
                          }`}
                          id="newpassword"
                          value={newpass}
                          onChange={(e) => {
                            setnewpass(e.target.value);
                          }}
                          name="newpassword"
                          placeholder="New Password"
                        />
                        <div className="invalid-feedback">
                          {/* {errors.licenseno} */}
                        </div>
                      </div>
                      <div className="form-group mb-3">
                        <label className="form-label" htmlFor="username">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className={`form-control ${
                            confirmpass === newpass &&
                            confirmpass !== "" &&
                            newpass !== ""
                              ? "is-valid"
                              : confirmpass !== newpass &&
                                confirmpass !== "" &&
                                newpass !== ""
                              ? "is-invalid"
                              : ""
                          }`}
                          value={confirmpass}
                          onChange={(e) => {
                            setconfirmpass(e.target.value);
                          }}
                          id="confirmnewpassword"
                          name="confirmnewpassword"
                          placeholder="Confirm New Password"
                        />
                        <div className="invalid-feedback">
                          Passwords don't match
                        </div>
                      </div>
                      {/*end form-group*/}
                      <div className="form-group mb-0 row">
                        <div className="col-12">
                          <button
                            className="btn btn-primary w-100"
                            type="submit"
                            disabled={loading}
                          >
                            Reset Password{" "}
                            <i className="fas fa-sign-in-alt ms-1" />
                          </button>
                        </div>
                        {/*end col*/}
                      </div>{" "}
                      {/*end form-group*/}
                    </form>
                    {/*end form*/}
                    <div className="text-center text-muted">
                      <p className="mb-1">
                        Remember It ?{" "}
                        <Link to="/" className="text-primary ms-2">
                          Sign in here
                        </Link>
                      </p>
                    </div>
                  </div>
                  {/*end card-body*/}
                  <div className="card-body bg-light-alt text-center">
                    {/* powered by ©{" "}
                    <a target="_blank" href="https://intoggle.com/">
                      Intoggle
                    </a> */}
                  </div>
                </div>
                {/*end card*/}
              </div>
              {/*end col*/}
            </div>
            {/*end row*/}
          </div>
          {/*end col*/}
        </div>
        {/*end row*/}
      </div>
      {/*end container*/}
    </div>
  );
};

export default ResetPassword;
