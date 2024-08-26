import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import Footer from "../../components/Footer";
import jwtDecode from "jwt-decode";
import UnauthPage from "../../components/UnauthPage";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { axiosInstance, renderUrl } from "../../config";
import moment from "moment";
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";
import ShowRelatedBlogs from "./ShowRelatedBlogs";

const SingleWeek = () => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const id = decoded.id;
  const role = decoded.role;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const wid = searchParams.get("wid");
  const navigate = useNavigate("");

  const [week, setWeek] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBlogById = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`weeks/getweek/${wid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWeek(response.data.week);
      console.log(response.data);
      setLoading(false);
    } catch (err) {
      if (err.response.data.message === "Week not found") {
        navigate("/weeksdata");
      }
      setError("Error fetching the week");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (wid) {
      fetchBlogById();
    } else {
      setError("No Week ID provided");
      setLoading(false);
      navigate("/weeksdata");
    }
    fetchBlogById();
  }, [wid]);
  console.log(week);

  const handleBlockUnblock = (adminId, isBlocked) => {
    Swal.fire({
      title: isBlocked === 1 ? "Activate Week" : "Deactivate Week",
      text: `Are you sure you want to ${
        isBlocked === 2 ? "Close" : isBlocked === 1 ? "Activate" : ""
      } this Week?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        // If confirmed, make the API request to block/unblock the admin
        makeBlockUnblockRequest(adminId, isBlocked);
      }
    });
  };

  const makeBlockUnblockRequest = async (adminId, isBlocked) => {
    try {
      const response = await axiosInstance.patch(
        `weeks/updateweek/${adminId}/status`,
        {
          status: isBlocked,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchBlogById();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error occurred while changing status of the Week.",
      });
    }
  };

  return (
    <>
      {role === "superadmin" || decoded.permissions.includes("Manage Weeks") ? (
        <>
          {/* leftbar-tab-menu */}
          <Sidebar />
          {/* end leftbar-tab-menu*/}
          {/* Top Bar Start */}
          {/* Top Bar Start */}
          <Topbar />
          {/* Top Bar End */}
          {/* Top Bar End */}
          <div className="page-wrapper">
            {/* Page Content*/}
            <div className="page-content-tab">
              <div className="container-fluid">
                {loading && (
                  <div className="col-12">
                    <div className="text-center py-5">
                      <div
                        className="spinner-border spinner-border-custom-2 text-secondary"
                        role="status"
                      ></div>
                    </div>
                  </div>
                )}
                {!loading && (
                  <>
                    <Breadcrumb
                      backpage={"Weeks"}
                      currentpage={`Week - ${week?.week?.name}`}
                      backurl={""}
                      maintab={""}
                      heading={`Week - ${week?.week?.name}`}
                    />
                    {week && (
                      <div className="card">
                        <div className="card-header">
                          <div className="d-flex justify-content-between align-items-center ">
                            <h4 className="card-title">
                              Week - {week?.week?.name}
                            </h4>
                            <div>
                              <div className="me-2 d-inline ">
                                <span
                                  className={`badge badge-purple px-3 py-2  ${
                                    week?.status === 1
                                      ? "bg-soft-success"
                                      : "bg-soft-danger"
                                  }  fw-semibold mt-3`}
                                >
                                  <i className="fa-solid fa-circle"></i>{" "}
                                  {week?.status === 1 ? "Active" : "Inactive"}{" "}
                                </span>
                                <a
                                  className="dropdown-toggle arrow-none"
                                  id="dLabel11"
                                  data-bs-toggle="dropdown"
                                  href="#"
                                  role="button"
                                  aria-haspopup="false"
                                  aria-expanded="false"
                                >
                                  <i className="las la-pen text-secondary font-16" />
                                </a>
                                <div
                                  className="dropdown-menu shadow-lg  dropdown-menu-end"
                                  aria-labelledby="dLabel11"
                                >
                                  {week.status === 1 && (
                                    <a
                                      onClick={() =>
                                        handleBlockUnblock(week._id, 0)
                                      }
                                      className="dropdown-item"
                                      href="#"
                                    >
                                      <i className="fa-solid fa-circle text-danger "></i>{" "}
                                      Deactivate
                                    </a>
                                  )}

                                  {week.status === 0 && (
                                    <a
                                      onClick={() =>
                                        handleBlockUnblock(week._id, 1)
                                      }
                                      className="dropdown-item"
                                      href="#"
                                    >
                                      <i className="fa-solid fa-circle text-success"></i>{" "}
                                      Activate
                                    </a>
                                  )}
                                  {/* <a className="dropdown-item" href="#">
                                  Tasks Details
                                </a> */}
                                </div>
                              </div>
                              {(decoded.permissions.includes("Create Weeks") ||
                                decoded.role === "superadmin") && (
                                <Link
                                  to={`/editweek?wid=${week._id}`}
                                  className="btn btn-outline-primary"
                                >
                                  <i className="las la-pen text-secondary font-16" />{" "}
                                  Edit Week
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="post-title mt-4">
                            <div className="row">
                              {/*end col*/}
                              <div className="col-12 my-2 text-end">
                                <span className="text-muted">
                                  <i className="far fa-calendar me-1" />
                                  {moment(week?.createdAt).format(
                                    "Do MMMM  YYYY"
                                  )}
                                </span>
                              </div>
                              {/*end col*/}
                            </div>
                            <div className="babysection my-2 shadow">
                              <div className="row mx-0 ">
                                <div className="col-12 card-header-int-primary">
                                  <h4>
                                    {" "}
                                    <b>Baby</b>
                                  </h4>
                                  {/* <hr /> */}
                                </div>
                                <div className="col-md-3 col-12">
                                  {/* <img src="" alt="" /> */}
                                  <h5 className="text-primary">
                                    {" "}
                                    <b>Baby Image</b>
                                  </h5>
                                  <hr />
                                  <img
                                    // src="assets/images/small/1.jpg"
                                    src={`${renderUrl}uploads/weeks/${week?.baby?.image}`}
                                    alt
                                    className="week_img"
                                  />
                                </div>
                                <div className="col-md-9 col-12">
                                  <h5 className="text-primary">
                                    {" "}
                                    <b>Baby Dimensions</b>
                                  </h5>
                                  <hr />
                                  <div className="d-flex">
                                    <div className="labelsofweek">
                                      <p>
                                        <b className="text-primary">
                                          Title&nbsp;
                                        </b>
                                      </p>
                                      <p>
                                        <b className="text-primary">
                                          Length&nbsp;
                                        </b>
                                      </p>
                                      <p>
                                        <b className="text-primary">
                                          Weight&nbsp;
                                        </b>
                                      </p>
                                      <p>
                                        <b className="text-primary">
                                          Size&nbsp;
                                        </b>
                                      </p>
                                    </div>
                                    <div>
                                      <p> - {week?.baby?.title}</p>
                                      <p> - {week?.baby?.length}</p>
                                      <p> - {week?.baby?.weight}</p>
                                      <p> - {week?.baby?.size}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12 ">
                                  <h5 className="text-primary">
                                    <b>Baby Description</b>
                                  </h5>
                                  <hr />
                                  <div
                                    className="ck-content"
                                    dangerouslySetInnerHTML={{
                                      __html: week?.baby?.description,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <div className="momsection my-2 shadow">
                              <div className="row mx-0 ">
                                <div className="col-12 card-header-int-primary">
                                  <h4>
                                    {" "}
                                    <b>Mom</b>
                                  </h4>
                                  {/* <hr /> */}
                                </div>
                                <div className="col-md-3 col-12">
                                  {/* <img src="" alt="" /> */}
                                  <h5 className="text-primary">
                                    {" "}
                                    <b>Mom Image</b>
                                  </h5>
                                  <hr />
                                  <img
                                    // src="assets/images/small/1.jpg"
                                    src={`${renderUrl}uploads/weeks/${week?.mom?.image}`}
                                    alt
                                    className="week_img"
                                  />
                                </div>
                                <div className="col-12 ">
                                  <h5 className="text-primary">
                                    <b>Mom Description</b>
                                  </h5>
                                  <hr />
                                  <div
                                    className="ck-content"
                                    dangerouslySetInnerHTML={{
                                      __html: week?.mom?.description,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <div className="tipssection">
                              <div className="row mx-0 ">
                                <div className="col-12 card-header-int-primary">
                                  <h4>
                                    {" "}
                                    <b>Tips</b>
                                  </h4>
                                  {/* <hr /> */}
                                </div>
                                <div className="col-12 card my-2 shadow ">
                                  <div className="card-header">
                                    <h5 className="text-primary">
                                      <b>Symptoms</b>
                                    </h5>
                                  </div>
                                  {/* <hr /> */}
                                  <div
                                    className="ck-content"
                                    dangerouslySetInnerHTML={{
                                      __html: week?.tip?.symptoms,
                                    }}
                                  ></div>
                                </div>
                                <div className="col-12 card my-2 shadow ">
                                  <div className="card-header">
                                    <h5 className="text-primary">
                                      <b>Life Cycle</b>
                                    </h5>
                                  </div>
                                  {/* <hr /> */}
                                  <div
                                    className="ck-content"
                                    dangerouslySetInnerHTML={{
                                      __html: week?.tip?.lifestyle,
                                    }}
                                  ></div>
                                </div>
                                <div className="col-12 card my-2 shadow ">
                                  <div className="card-header">
                                    <h5 className="text-primary">
                                      <b>Sex</b>
                                    </h5>
                                  </div>
                                  {/* <hr /> */}
                                  <div
                                    className="ck-content"
                                    dangerouslySetInnerHTML={{
                                      __html: week?.tip?.sex,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <div className="card col-12 p-0">
                              <div className="card-header-int-primary">
                                <h5>Related Blogs</h5>
                              </div>
                              <div className="card-body">
                                <ShowRelatedBlogs blogs={week?.relatedblogs} />
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className="card-body pt-0">
                        <div className="row mb-3">
                          <div className="col">
                            <p className="text-dark fw-semibold mb-0">
                              Artical tags
                            </p>
                          </div>
                        </div>
                        <span className="badge bg-soft-dark px-3 py-2 fw-semibold">
                          Music
                        </span>
                        <span className="badge bg-soft-dark px-3 py-2 fw-semibold">
                          Animals
                        </span>
                        <span className="badge bg-soft-dark px-3 py-2 fw-semibold">
                          Natural
                        </span>
                        <span className="badge bg-soft-dark px-3 py-2 fw-semibold">
                          Food
                        </span>
                        <span className="badge bg-soft-dark px-3 py-2 fw-semibold">
                          Fashion
                        </span>
                        <span className="badge bg-soft-dark px-3 py-2 fw-semibold">
                          Helth
                        </span>
                        <span className="badge bg-soft-dark px-3 py-2 fw-semibold">
                          Charity
                        </span>
                      </div> */}
                      </div>
                    )}
                  </>
                )}
              </div>

              <Footer />
            </div>
          </div>
        </>
      ) : (
        <UnauthPage />
      )}
    </>
  );
};
export default SingleWeek;
