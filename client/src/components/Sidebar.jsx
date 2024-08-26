import React, { useEffect, useState } from "react";
import { opensidebar } from "../Intoggle";
import { Link, useLocation, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { renderUrl } from "../config";

const Sidebar = () => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const id = decoded.id;
  const role = decoded.role;
  const [activemenu, setactivemenu] = useState("dashboard");
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname.includes("/dashboard") ||
      location.pathname.includes("/all-admins") ||
      location.pathname.includes("/all-consultants") ||
      location.pathname.includes("/all-doctors") ||
      location.pathname.includes("/all-patients")
    ) {
      setactivemenu("dashboard");
    } else if (
      location.pathname.includes("/blogcategories") ||
      location.pathname.includes("/blogs") ||
      location.pathname.includes("/createblog") ||
      location.pathname.includes("/editblog")
    ) {
      setactivemenu("blog");
    } else if (
      location.pathname.includes("/aboutus") ||
      location.pathname.includes("/privacy") ||
      location.pathname.includes("/termsandconditions")
    ) {
      setactivemenu("privacyabout");
    } else if (
      // location.pathname.includes("/aboutus") ||
      location.pathname.includes("/query")
    ) {
      setactivemenu("query");
    } else if (
      location.pathname.includes("/weeksdata") ||
      location.pathname.includes("/createweek") ||
      location.pathname.includes("/editweek") ||
      location.pathname.includes("/week") ||
      location.pathname.includes("/masterweeks")
    ) {
      setactivemenu("weeks");
    } else if (location.pathname.includes("/appointments")) {
      setactivemenu("appointments");
    }

    //
    //
    //
  }, []);

  return (
    <div className="leftbar-tab-menu">
      <div className="main-icon-menu">
        <a href="/dashboard" className="logo logo-metrica d-block text-center">
          <span>
            <img
              src="assets/images/ZoCareW2.png"
              alt="logo-small"
              className="logo-sm"
            />
          </span>
        </a>
        <div className="main-icon-menu-body">
          <div
            className="position-reletive h-100"
            data-simplebar
            style={{ overflowX: "hidden" }}
          >
            <ul className="nav nav-tabs" role="tablist" id="tab-menu">
              <li
                className="nav-item"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title="Dashboard"
                data-bs-trigger="hover"
              >
                <a
                  href="#dashboard"
                  id="dashboard-tab"
                  onClick={() => {
                    opensidebar();
                    setactivemenu("dashboard");
                  }}
                  className={`nav-link ${
                    activemenu === "dashboard" ? "active" : ""
                  }`}
                >
                  <i className="ti ti-smart-home menu-icon" />
                </a>
                {/*end nav-link*/}
              </li>
              {(role === "superadmin" ||
                decoded.permissions.includes("Manage Blogs") ||
                decoded.permissions.includes("Create Blogs") ||
                decoded.permissions.includes("Manage Blog Categories") ||
                decoded.permissions.includes("Create Blog Categories")) && (
                <li
                  className="nav-item"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="blog"
                  data-bs-trigger="hover"
                >
                  <a
                    href="#blog"
                    id="blog-tab"
                    onClick={() => {
                      opensidebar();
                      setactivemenu("blog");
                    }}
                    className={`nav-link ${
                      activemenu === "blog" ? "active" : ""
                    }`}
                  >
                    <i className="ti ti-book menu-icon" />
                  </a>
                  {/*end nav-link*/}
                </li>
              )}
              {(role === "superadmin" ||
                decoded.permissions.includes("Manage Weeks") ||
                decoded.permissions.includes("Create Weeks")) && (
                <li
                  className="nav-item"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="Weeks"
                  data-bs-trigger="hover"
                >
                  <a
                    href="#weeks"
                    id="weeks-tab"
                    onClick={() => {
                      opensidebar();
                      setactivemenu("weeks");
                    }}
                    className={`nav-link ${
                      activemenu === "weeks" ? "active" : ""
                    }`}
                  >
                    <i class="fa-solid fa-calendar-week menu-icon"></i>
                  </a>
                </li>
              )}
              {/*end nav-item*/}

              {(role === "superadmin" ||
                decoded.permissions.includes("Privacy") ||
                decoded.permissions.includes("About us") ||
                decoded.permissions.includes("Terms")) && (
                <li
                  className="nav-item"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="Privacy Policy / About us"
                  data-bs-trigger="hover"
                >
                  <a
                    href="#privacyabout"
                    onClick={() => {
                      setactivemenu("privacyabout");
                      opensidebar();
                    }}
                    className={`nav-link ${
                      activemenu === "privacyabout" ? "active" : ""
                    }`}
                    id="privacyabout-tab"
                    // className="nav-link"
                  >
                    <i className="ti ti-shield-lock menu-icon" />
                  </a>
                  {/*end nav-link*/}
                </li>
              )}

              {(role === "superadmin" ||
                decoded.permissions.includes("Query")) && (
                <li
                  className="nav-item"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="Query"
                  data-bs-trigger="hover"
                >
                  <a
                    href="#query"
                    onClick={() => {
                      setactivemenu("query");
                      opensidebar();
                    }}
                    className={`nav-link ${
                      activemenu === "query" ? "active" : ""
                    }`}
                    id="query-tab"
                    // className="nav-link"
                  >
                    <i className="fa-solid fa-headset menu-icon"></i>
                  </a>
                  {/*end nav-link*/}
                </li>
              )}
              {(role === "superadmin" ||
                decoded.permissions.includes("Appointments")) && (
                <li
                  className="nav-item"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="Appointments"
                  data-bs-trigger="hover"
                >
                  <a
                    href="#appointments"
                    onClick={() => {
                      setactivemenu("appointments");
                      opensidebar();
                    }}
                    className={`nav-link ${
                      activemenu === "appointments" ? "active" : ""
                    }`}
                    id="appointments-tab"
                    // className="nav-link"
                  >
                    <i className="fa-regular fa-calendar-check menu-icon"></i>
                  </a>
                  {/*end nav-link*/}
                </li>
              )}
              {/* <i class="fa-regular fa-calendar-check"></i> */}
            </ul>
            {/*end nav*/}
          </div>
          {/*end /div*/}
        </div>
        {/*end main-icon-menu-body*/}
        <div className="pro-metrica-end">
          <a href className="profile">
            <img
              // src="assets/images/users/user-vector.png"
              src={`${renderUrl}uploads/profile/${decoded.image}`}
              alt="profile-user"
              onError={(e) => {
                e.target.src = "assets/images/users/user-vector.png"; // Set a default image if the specified image fails to load
              }}
              className="rounded-circle thumb-sm"
            />
          </a>
        </div>
        {/*end pro-metrica-end*/}
      </div>
      {/*end main-icon-menu*/}
      <div className="main-menu-inner">
        {/* LOGO */}
        <div className="topbar-left">
          <Link to="/" className="logo">
            <span className="logo-sidebar-text">ZoCARE</span>
          </Link>
          {/*end logo*/}
        </div>
        {/*end topbar-left*/}
        {/*end logo*/}
        <div className="menu-body navbar-vertical tab-content" data-simplebar>
          <div
            id="dashboard"
            className={`main-icon-menu-pane tab-pane ${
              activemenu === "dashboard" ? "active" : ""
            }`}
            role="tabpanel"
            aria-labelledby="dasboard-tab"
          >
            <div className="title-box">
              <h6 className="menu-title">Dashboard</h6>
            </div>
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname.includes("/dashboard") ? "active" : ""
                  }`}
                  to="/dashboard"
                >
                  Dashboard
                </Link>
              </li>
              {role === "superadmin" && (
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      location.pathname.includes("/all-admins") ? "active" : ""
                    }`}
                    to="/all-admins"
                  >
                    Admins
                  </Link>
                </li>
              )}
              {(role === "superadmin" ||
                decoded.permissions.includes("Manage Consultants")) && (
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      location.pathname.includes("/all-consultants")
                        ? "active"
                        : ""
                    }`}
                    to="/all-consultants"
                  >
                    Consultants
                  </Link>
                </li>
              )}
              {(role === "superadmin" ||
                decoded.permissions.includes("Manage Doctors")) && (
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      location.pathname.includes("/all-doctors") ? "active" : ""
                    }`}
                    to="/all-doctors"
                  >
                    Doctors
                  </Link>
                </li>
              )}
              {(role === "superadmin" ||
                role === "admin" ||
                decoded.permissions.includes("Handle Patient")) && (
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      location.pathname.includes("/all-patients")
                        ? "active"
                        : ""
                    }`}
                    to="/all-patients"
                  >
                    Patients
                  </Link>
                </li>
              )}

              {/*end nav-item*/}
            </ul>
            {/*end nav*/}
          </div>
          {(role === "superadmin" ||
            decoded.permissions.includes("Manage Blogs") ||
            decoded.permissions.includes("Create Blogs") ||
            decoded.permissions.includes("Manage Blog Categories") ||
            decoded.permissions.includes("Create Blog Categories")) && (
            <div
              id="blog"
              className={`main-icon-menu-pane tab-pane ${
                activemenu === "blog" ? "active" : ""
              }`}
              role="tabpanel"
              aria-labelledby="dasboard-tab"
            >
              <div className="title-box">
                <h6 className="menu-title">Blog</h6>
              </div>
              <ul className="nav flex-column">
                {(decoded.permissions.includes("Manage Blog Categories") ||
                  role === "superadmin") && (
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${
                        location.pathname.includes("/blogcategories")
                          ? "active"
                          : ""
                      }`}
                      to="/blogcategories"
                    >
                      Blog Categories
                    </Link>
                  </li>
                )}
                {(decoded.permissions.includes("Manage Blogs") ||
                  role === "superadmin") && (
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${
                        location.pathname.includes("/blogs") ? "active" : ""
                      }`}
                      to="/blogs"
                    >
                      Blog List
                    </Link>
                  </li>
                )}
                {decoded.permissions.includes("Create Blogs") && (
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${
                        location.pathname.includes("/createblog")
                          ? "active"
                          : ""
                      }`}
                      to="/createblog"
                    >
                      Create Post
                    </Link>
                  </li>
                )}
                {/*end nav-item*/}
              </ul>
              {/*end nav*/}
            </div>
          )}

          {(role === "superadmin" ||
            decoded.permissions.includes("Manage Weeks") ||
            location.pathname.includes("/masterweeks") ||
            decoded.permissions.includes("Create Weeks")) && (
            <div
              id="weeks"
              className={`main-icon-menu-pane tab-pane ${
                activemenu === "weeks" ? "active" : ""
              }`}
              role="tabpanel"
              aria-labelledby="dasboard-tab"
            >
              <div className="title-box">
                <h6 className="menu-title">Weeks Data</h6>
              </div>
              <ul className="nav flex-column">
                {(decoded.permissions.includes("Manage Weeks") ||
                  role === "superadmin") && (
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${
                        location.pathname.includes("/weeksdata") ||
                        location.pathname.includes("/editweek") ||
                        location.pathname.includes("/week")
                          ? "active"
                          : ""
                      }`}
                      to="/weeksdata"
                    >
                      Weeks Data List
                    </Link>
                  </li>
                )}
                {decoded.permissions.includes("Create Weeks") && (
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${
                        location.pathname.includes("/createweek")
                          ? "active"
                          : ""
                      }`}
                      to="/createweek"
                    >
                      Create Week Data
                    </Link>
                  </li>
                )}
                {(decoded.permissions.includes("Manage Master Weeks") ||
                  role === "superadmin") && (
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${
                        location.pathname.includes("/masterweeks")
                          ? "active"
                          : ""
                      }`}
                      to="/masterweeks"
                    >
                      Master Weeks
                    </Link>
                  </li>
                )}

                {/*end nav-item*/}
              </ul>
              {/*end nav*/}
            </div>
          )}
          {(role === "superadmin" ||
            decoded.permissions.includes("Privacy") ||
            decoded.permissions.includes("About us") ||
            decoded.permissions.includes("Terms")) && (
            <div
              id="privacyabout"
              className={`main-icon-menu-pane tab-pane ${
                activemenu === "privacyabout" ? "active" : ""
              }`}
              role="tabpanel"
              aria-labelledby="dasboard-tab"
            >
              {(role === "superadmin" ||
                decoded.permissions.includes("About us")) && (
                <>
                  {" "}
                  <div className="title-box">
                    <h6 className="menu-title">About Us</h6>
                  </div>
                  <ul className="nav flex-column">
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${
                          location.pathname.includes("/aboutus") ? "active" : ""
                        }`}
                        to="/aboutus"
                      >
                        About us
                      </Link>
                    </li>
                  </ul>
                </>
              )}
              {(role === "superadmin" ||
                decoded.permissions.includes("Terms")) && (
                <>
                  {" "}
                  <div className="title-box">
                    <h6 className="menu-title">Terms & Conditions</h6>
                  </div>
                  <ul className="nav flex-column">
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${
                          location.pathname.includes("/termsandconditions")
                            ? "active"
                            : ""
                        }`}
                        to="/termsandconditions"
                      >
                        Terms & Conditions
                      </Link>
                    </li>
                  </ul>
                </>
              )}
              {(role === "superadmin" ||
                decoded.permissions.includes("Privacy")) && (
                <>
                  {" "}
                  <div className="title-box">
                    <h6 className="menu-title">Privacy Policy</h6>
                  </div>
                  <ul className="nav flex-column">
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${
                          location.pathname.includes("/privacy") ? "active" : ""
                        }`}
                        to="/privacy"
                      >
                        Privacy Policy
                      </Link>
                    </li>
                  </ul>
                </>
              )}
            </div>
          )}
          {(role === "superadmin" || decoded.permissions.includes("Query")) && (
            <div
              id="query"
              className={`main-icon-menu-pane tab-pane ${
                activemenu === "query" ? "active" : ""
              }`}
              role="tabpanel"
              aria-labelledby="dasboard-tab"
            >
              <div className="title-box">
                <h6 className="menu-title">Query</h6>
              </div>
              <ul className="nav flex-column">
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      location.pathname.includes("/query") ? "active" : ""
                    }`}
                    to="/query"
                  >
                    Queries
                  </Link>
                </li>
                {/*end nav-item*/}
              </ul>

              {/*end nav*/}
            </div>
          )}
          {(role === "superadmin" ||
            decoded.permissions.includes("Appointments")) && (
            <div
              id="appointments"
              className={`main-icon-menu-pane tab-pane ${
                activemenu === "appointments" ? "active" : ""
              }`}
              role="tabpanel"
              aria-labelledby="dasboard-tab"
            >
              <div className="title-box">
                <h6 className="menu-title">Appointments</h6>
              </div>
              <ul className="nav flex-column">
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      location.pathname.includes("/appointments")
                        ? "active"
                        : ""
                    }`}
                    to="/appointments"
                  >
                    Appointments
                  </Link>
                </li>
                {/*end nav-item*/}
              </ul>

              {/*end nav*/}
            </div>
          )}

          {/*  */}
        </div>
        {/*end menu-body*/}
      </div>
      {/* end main-menu-inner*/}
    </div>
  );
};

export default Sidebar;
