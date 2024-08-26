import React, { useEffect, useState } from "react";
import { toggleHtmlClass } from "../Intoggle";
import { Link, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { axiosInstance, renderUrl } from "../config";

const Topbar = ({ imageUploaded }) => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const id = decoded.id;
  const role = decoded.role;
  const username = decoded.username;
  const image = decoded.image;
  const [profile, setprofile] = useState({});

  // console.log(decoded, "decoded");

  const navigate = useNavigate("");

  const logout = () => {
    try {
      localStorage.removeItem("admin");
      console.log("logout");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const getProfile = async () => {
    try {
      // setloadingprofile(true);
      const response = await axiosInstance.get(`admin-role/getprofile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log(response.data.user, "////////////////////");

      setprofile(response.data.user);

      // setloadingprofile(false);
    } catch (error) {
      console.log(error);
      // setloadingprofile(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    getProfile();
  }, [imageUploaded]);

  return (
    <div className="topbar">
      {/* Navbar */}
      <nav className="navbar-custom" id="navbar-custom">
        <ul className="list-unstyled topbar-nav float-end mb-0">
          <li className="dropdown d-none">
            <a
              className="nav-link dropdown-toggle arrow-none nav-icon"
              data-bs-toggle="dropdown"
              href="#"
              role="button"
              aria-haspopup="false"
              aria-expanded="false"
            >
              <img
                src="assets/images/flags/us_flag.jpg"
                alt
                className="thumb-xxs rounded-circle"
              />
            </a>
            <div className="dropdown-menu">
              <a className="dropdown-item" href="#">
                <img
                  src="assets/images/flags/us_flag.jpg"
                  alt
                  height={15}
                  className="me-2"
                />
                English
              </a>
              <a className="dropdown-item" href="#">
                <img
                  src="assets/images/flags/spain_flag.jpg"
                  alt
                  height={15}
                  className="me-2"
                />
                Spanish
              </a>
              <a className="dropdown-item" href="#">
                <img
                  src="assets/images/flags/germany_flag.jpg"
                  alt
                  height={15}
                  className="me-2"
                />
                German
              </a>
              <a className="dropdown-item" href="#">
                <img
                  src="assets/images/flags/french_flag.jpg"
                  alt
                  height={15}
                  className="me-2"
                />
                French
              </a>
            </div>
          </li>
          {/*end topbar-language*/}
          <li className="dropdown notification-list d-none">
            <a
              className="nav-link dropdown-toggle arrow-none nav-icon"
              data-bs-toggle="dropdown"
              href="#"
              role="button"
              aria-haspopup="false"
              aria-expanded="false"
            >
              <i className="ti ti-mail" />
            </a>
            <div className="dropdown-menu dropdown-menu-end dropdown-lg pt-0">
              <h6 className="dropdown-item-text font-15 m-0 py-3 border-bottom d-flex justify-content-between align-items-center">
                Emails{" "}
                <span className="badge bg-soft-primary badge-pill">3</span>
              </h6>
              <div className="notification-menu" data-simplebar>
                {/* item*/}
                <a href="#" className="dropdown-item py-3">
                  <small className="float-end text-muted ps-2">2 min ago</small>
                  <div className="media">
                    <div className="avatar-md bg-soft-primary">
                      <img
                        src="assets/images/users/user-1.jpg"
                        alt
                        className="thumb-sm rounded-circle"
                      />
                    </div>
                    <div className="media-body align-self-center ms-2 text-truncate">
                      <h6 className="my-0 fw-normal text-dark">
                        Your order is placed
                      </h6>
                      <small className="text-muted mb-0">
                        Dummy text of the printing and industry.
                      </small>
                    </div>
                    {/*end media-body*/}
                  </div>
                  {/*end media*/}
                </a>
                {/*end-item*/}
                {/* item*/}
                <a href="#" className="dropdown-item py-3">
                  <small className="float-end text-muted ps-2">
                    10 min ago
                  </small>
                  <div className="media">
                    <div className="avatar-md bg-soft-primary">
                      <img
                        src="assets/images/users/user-vector.png"
                        alt
                        className="thumb-sm rounded-circle"
                      />
                    </div>
                    <div className="media-body align-self-center ms-2 text-truncate">
                      <h6 className="my-0 fw-normal text-dark">
                        Meeting with designers
                      </h6>
                      <small className="text-muted mb-0">
                        It is a long established fact that a reader.
                      </small>
                    </div>
                    {/*end media-body*/}
                  </div>
                  {/*end media*/}
                </a>
                {/*end-item*/}
                {/* item*/}
                <a href="#" className="dropdown-item py-3">
                  <small className="float-end text-muted ps-2">
                    40 min ago
                  </small>
                  <div className="media">
                    <div className="avatar-md bg-soft-primary">
                      <img
                        src="assets/images/users/user-2.jpg"
                        alt
                        className="thumb-sm rounded-circle"
                      />
                    </div>
                    <div className="media-body align-self-center ms-2 text-truncate">
                      <h6 className="my-0 fw-normal text-dark">
                        UX 3 Task complete.
                      </h6>
                      <small className="text-muted mb-0">
                        Dummy text of the printing.
                      </small>
                    </div>
                    {/*end media-body*/}
                  </div>
                  {/*end media*/}
                </a>
                {/*end-item*/}
                {/* item*/}
                <a href="#" className="dropdown-item py-3">
                  <small className="float-end text-muted ps-2">1 hr ago</small>
                  <div className="media">
                    <div className="avatar-md bg-soft-primary">
                      <img
                        src="assets/images/users/user-5.jpg"
                        alt
                        className="thumb-sm rounded-circle"
                      />
                    </div>
                    <div className="media-body align-self-center ms-2 text-truncate">
                      <h6 className="my-0 fw-normal text-dark">
                        Your order is placed
                      </h6>
                      <small className="text-muted mb-0">
                        It is a long established fact that a reader.
                      </small>
                    </div>
                    {/*end media-body*/}
                  </div>
                  {/*end media*/}
                </a>
                {/*end-item*/}
                {/* item*/}
                <a href="#" className="dropdown-item py-3">
                  <small className="float-end text-muted ps-2">2 hrs ago</small>
                  <div className="media">
                    <div className="avatar-md bg-soft-primary">
                      <img
                        src="assets/images/users/user-3.jpg"
                        alt
                        className="thumb-sm rounded-circle"
                      />
                    </div>
                    <div className="media-body align-self-center ms-2 text-truncate">
                      <h6 className="my-0 fw-normal text-dark">
                        Payment Successfull
                      </h6>
                      <small className="text-muted mb-0">
                        Dummy text of the printing.
                      </small>
                    </div>
                    {/*end media-body*/}
                  </div>
                  {/*end media*/}
                </a>
                {/*end-item*/}
              </div>
              {/* All*/}
              <a
                href="javascript:void(0);"
                className="dropdown-item text-center text-primary"
              >
                View all <i className="fi-arrow-right" />
              </a>
            </div>
          </li>
          <li className="dropdown notification-list d-none">
            <a
              className="nav-link dropdown-toggle arrow-none nav-icon"
              data-bs-toggle="dropdown"
              href="#"
              role="button"
              aria-haspopup="false"
              aria-expanded="false"
            >
              <i className="ti ti-bell" />
              <span className="alert-badge" />
            </a>
            <div className="dropdown-menu dropdown-menu-end dropdown-lg pt-0">
              <h6 className="dropdown-item-text font-15 m-0 py-3 border-bottom d-flex justify-content-between align-items-center">
                Notifications{" "}
                <span className="badge bg-soft-primary badge-pill">2</span>
              </h6>
              <div className="notification-menu" data-simplebar>
                {/* item*/}
                <a href="#" className="dropdown-item py-3">
                  <small className="float-end text-muted ps-2">2 min ago</small>
                  <div className="media">
                    <div className="avatar-md bg-soft-primary">
                      <i className="ti ti-chart-arcs" />
                    </div>
                    <div className="media-body align-self-center ms-2 text-truncate">
                      <h6 className="my-0 fw-normal text-dark">
                        Your order is placed
                      </h6>
                      <small className="text-muted mb-0">
                        Dummy text of the printing and industry.
                      </small>
                    </div>
                    {/*end media-body*/}
                  </div>
                  {/*end media*/}
                </a>
                {/*end-item*/}
                {/* item*/}
                <a href="#" className="dropdown-item py-3">
                  <small className="float-end text-muted ps-2">
                    10 min ago
                  </small>
                  <div className="media">
                    <div className="avatar-md bg-soft-primary">
                      <i className="ti ti-device-computer-camera" />
                    </div>
                    <div className="media-body align-self-center ms-2 text-truncate">
                      <h6 className="my-0 fw-normal text-dark">
                        Meeting with designers
                      </h6>
                      <small className="text-muted mb-0">
                        It is a long established fact that a reader.
                      </small>
                    </div>
                    {/*end media-body*/}
                  </div>
                  {/*end media*/}
                </a>
                {/*end-item*/}
                {/* item*/}
                <a href="#" className="dropdown-item py-3">
                  <small className="float-end text-muted ps-2">
                    40 min ago
                  </small>
                  <div className="media">
                    <div className="avatar-md bg-soft-primary">
                      <i className="ti ti-diamond" />
                    </div>
                    <div className="media-body align-self-center ms-2 text-truncate">
                      <h6 className="my-0 fw-normal text-dark">
                        UX 3 Task complete.
                      </h6>
                      <small className="text-muted mb-0">
                        Dummy text of the printing.
                      </small>
                    </div>
                    {/*end media-body*/}
                  </div>
                  {/*end media*/}
                </a>
                {/*end-item*/}
                {/* item*/}
                <a href="#" className="dropdown-item py-3">
                  <small className="float-end text-muted ps-2">1 hr ago</small>
                  <div className="media">
                    <div className="avatar-md bg-soft-primary">
                      <i className="ti ti-drone" />
                    </div>
                    <div className="media-body align-self-center ms-2 text-truncate">
                      <h6 className="my-0 fw-normal text-dark">
                        Your order is placed
                      </h6>
                      <small className="text-muted mb-0">
                        It is a long established fact that a reader.
                      </small>
                    </div>
                    {/*end media-body*/}
                  </div>
                  {/*end media*/}
                </a>
                {/*end-item*/}
                {/* item*/}
                <a href="#" className="dropdown-item py-3">
                  <small className="float-end text-muted ps-2">2 hrs ago</small>
                  <div className="media">
                    <div className="avatar-md bg-soft-primary">
                      <i className="ti ti-users" />
                    </div>
                    <div className="media-body align-self-center ms-2 text-truncate">
                      <h6 className="my-0 fw-normal text-dark">
                        Payment Successfull
                      </h6>
                      <small className="text-muted mb-0">
                        Dummy text of the printing.
                      </small>
                    </div>
                    {/*end media-body*/}
                  </div>
                  {/*end media*/}
                </a>
                {/*end-item*/}
              </div>
              {/* All*/}
              <a
                href="javascript:void(0);"
                className="dropdown-item text-center text-primary"
              >
                View all <i className="fi-arrow-right" />
              </a>
            </div>
          </li>
          <li className="dropdown">
            <a
              className="nav-link dropdown-toggle nav-user"
              data-bs-toggle="dropdown"
              href="#"
              role="button"
              aria-haspopup="false"
              aria-expanded="false"
            >
              <div className="d-flex align-items-center">
                <img
                  src={`${renderUrl}uploads/profile/${image}`}
                  alt="profile-user"
                  onError={(e) => {
                    e.target.src = "assets/images/users/user-vector.png"; // Set a default image if the specified image fails to load
                  }}
                  className="rounded-circle me-2 thumb-sm"
                />
                <div>
                  {/* {image} */}
                  <small className="d-none d-md-block font-11">
                    {role === "superadmin"
                      ? "Super admin"
                      : role === "admin"
                      ? "Admin"
                      : role === "consultant"
                      ? "Consultant"
                      : role === "doctor"
                      ? "Doctor"
                      : ""}
                  </small>
                  <span className="d-none d-md-block fw-semibold font-12">
                    {profile.username} <i className="mdi mdi-chevron-down" />
                  </span>
                </div>
              </div>
            </a>
            <div className="dropdown-menu dropdown-menu-end">
              {/* <a className="dropdown-item" href="#">
                <i className="ti ti-user font-16 me-1 align-text-bottom" />{" "}
                Profile
              </a> */}
              <Link className="dropdown-item" to="/profile">
                <i className="ti ti-user font-16 me-1 align-text-bottom" />{" "}
                Profile
              </Link>
              {/* <a className="dropdown-item" href="#">
                <i className="ti ti-settings font-16 me-1 align-text-bottom" />{" "}
                Settings
              </a> */}
              <div className="dropdown-divider mb-0" />
              <a
                className="dropdown-item"
                href="javascript:void(0);"
                onClick={logout}
              >
                <i className="ti ti-power font-16 me-1 align-text-bottom" />{" "}
                Logout
              </a>
            </div>
          </li>
          {/*end topbar-profile*/}
          <li className="notification-list d-none">
            <a
              className="nav-link arrow-none nav-icon offcanvas-btn"
              href="#"
              data-bs-toggle="offcanvas"
              data-bs-target="#Appearance"
              role="button"
              aria-controls="Rightbar"
            >
              <i className="ti ti-settings ti-spin" />
            </a>
          </li>
        </ul>
        {/*end topbar-nav*/}
        <ul className="list-unstyled topbar-nav mb-0">
          <li>
            <button
              className="nav-link button-menu-mobile nav-icon"
              id="togglemenu"
              onClick={() => toggleHtmlClass("enlarge-menu")}
            >
              <i className="ti ti-menu-2" />
            </button>
          </li>
          <li className="hide-phone app-search d-none">
            <form role="search" action="#" method="get">
              <input
                type="search"
                name="search"
                className="form-control top-search mb-0"
                placeholder="Type text..."
              />
              <button type="submit">
                <i className="ti ti-search" />
              </button>
            </form>
          </li>
        </ul>
      </nav>
      {/* end navbar*/}
      <div
        className="offcanvas offcanvas-end"
        tabIndex={-1}
        id="Appearance"
        aria-labelledby="AppearanceLabel"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="m-0 font-14" id="AppearanceLabel">
            Appearance
          </h5>
          <button
            type="button"
            className="btn-close text-reset p-0 m-0 align-self-center"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="offcanvas-body d-none">
          <h6>Account Settings</h6>
          <div className="p-2 text-start mt-3">
            <div className="form-check form-switch mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="settings-switch1"
              />
              <label className="form-check-label" htmlFor="settings-switch1">
                Auto updates
              </label>
            </div>
            {/*end form-switch*/}
            <div className="form-check form-switch mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="settings-switch2"
                defaultChecked
              />
              <label className="form-check-label" htmlFor="settings-switch2">
                Location Permission
              </label>
            </div>
            {/*end form-switch*/}
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="settings-switch3"
              />
              <label className="form-check-label" htmlFor="settings-switch3">
                Show offline Contacts
              </label>
            </div>
            {/*end form-switch*/}
          </div>
        </div>
        {/*end offcanvas-body*/}
      </div>
    </div>
  );
};

export default Topbar;