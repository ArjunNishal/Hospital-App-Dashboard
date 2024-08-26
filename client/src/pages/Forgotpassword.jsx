import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../config";

const Forgotpassword = () => {
  const [email, setemail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [emailsent, setEmailsent] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const role = params.get("r");
  // const { role } = useParams();
  const userrole = atob(role);
  const navigate = useNavigate("");

  useEffect(() => {
    if (!role) {
      navigate("/");
    }
  }, []);

  const forgotpass = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post("admin-log/unauth/resetpassword", {
        email,
        role: userrole,
      });
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
    <div className="auth-page auth-bg">
      {/* Log In page */}
      <div className="container">
        <div className="row vh-100 d-flex justify-content-center">
          <div className="col-12 align-self-center">
            <div className="row">
              <div className="col-lg-5 mx-auto">
                <div className="card">
                  <div className="card-body p-0 auth-header-box">
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
                        Forgot Password
                        {/* {userrole} */}
                      </h4>
                      <p className="text-muted  mb-0">
                        Enter your Email and instructions will be sent to you!
                      </p>
                    </div>
                  </div>
                  <div className="card-body pt-0">
                    <form className="my-4" onSubmit={forgotpass}>
                      <div className="form-group mb-3">
                        <label className="form-label" htmlFor="username">
                          Email
                        </label>
                        <input
                          type="text"
                          value={email}
                          onChange={(e) => {
                            setemail(e.target.value);
                            const atIndex = e.target.value.indexOf("@");
                            const dotIndex = e.target.value.lastIndexOf(".");

                            const isEmailValid =
                              atIndex !== -1 &&
                              dotIndex !== -1 &&
                              dotIndex > atIndex + 1 &&
                              /[a-zA-Z]{2,}$/.test(
                                e.target.value.substring(dotIndex + 1)
                              );

                            setIsValidEmail(isEmailValid);

                            if (e.target.value === "") {
                              setIsValidEmail(true);
                            }
                          }}
                          className={`form-control ${
                            email !== "" && isValidEmail
                              ? "is-valid"
                              : email !== "" && !isValidEmail
                              ? "is-invalid"
                              : ""
                          }`}
                          id="userEmail"
                          name="Email"
                          placeholder="Enter Email Address"
                        />
                        <div className="invalid-feedback">
                          Enter valid email
                        </div>
                      </div>
                      {message === "We cannot find your email." && (
                        <div className="text-center text-danger py-3 col-12">
                          {message}
                        </div>
                      )}
                      {/*end form-group*/}
                      <div className="form-group mb-0 row">
                        {!loading && !emailsent && (
                          <div className="col-12">
                            <button
                              className="btn btn-primary w-100"
                              type="submit"
                              disabled={!isValidEmail || email === ""}
                            >
                              Send Reset Link{" "}
                              <i className="fas fa-sign-in-alt ms-1" />
                            </button>
                          </div>
                        )}
                        {loading && (
                          <div className="col-12">
                            <div className="text-center py-5">
                              <div
                                className="spinner-border spinner-border-custom-2 text-secondary"
                                role="status"
                              ></div>
                            </div>
                            <p className="text-center">
                              <b>Sending Email...</b>
                            </p>
                          </div>
                        )}

                        {emailsent && !loading && (
                          <>
                            {message !== "We cannot find your email." && (
                              <div className="text-center col-12">
                                {message}
                              </div>
                            )}
                            <div className="col-12 mt-3">
                              <button
                                className="btn btn-primary w-100"
                                type="submit"
                                disabled={!isValidEmail}
                              >
                                Resend Reset Link{" "}
                                <i className="fas fa-sign-in-alt ms-1" />
                              </button>
                            </div>
                          </>
                        )}
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

export default Forgotpassword;
