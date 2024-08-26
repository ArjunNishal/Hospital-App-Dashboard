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

const SingleBlogPage = () => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const id = decoded.id;
  const role = decoded.role;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const bid = searchParams.get("bid");
  const navigate = useNavigate("");

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBlogById = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`blog/getblog/${bid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlog(response.data.data);
      console.log(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching the blog");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bid) {
      fetchBlogById();
    } else {
      setError("No blog ID provided");
      setLoading(false);
      navigate("/blogs");
    }
    // fetchBlogById();
  }, [bid]);
  console.log(blog);

  const handleBlockUnblock = (adminId, isBlocked) => {
    Swal.fire({
      title:
        isBlocked === 2
          ? "Block Blog"
          : isBlocked === 1
          ? "Activate Blog"
          : "Deactivate Blog",
      text: `Are you sure you want to ${
        isBlocked === 2 ? "Block" : isBlocked === 1 ? "Activate" : "Deactivate"
      } this Blog?`,
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
      const response = await axiosInstance.put(
        `blog/edit/blog/${adminId}/status`,
        {
          //   adminId,
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
        text: "An error occurred while changing status of Blog.",
      });
    }
  };

  return (
    <>
      {role === "superadmin" || decoded.permissions.includes("Manage Blogs") ? (
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
                      backpage={"Blog"}
                      currentpage={`${blog?.title}`}
                      backurl={""}
                      maintab={""}
                      heading={`${blog?.title}`}
                    />
                    {blog && (
                      <div className="card">
                        <div className="card-header">
                          <div className="d-flex justify-content-end align-items-center ">
                            {/* <h4 className="card-title">{blog?.title}</h4> */}
                            <div>
                              <div className="me-2 d-inline ">
                                <span
                                  className={`badge badge-purple px-3 py-2  ${
                                    blog?.status === 1
                                      ? "bg-soft-success"
                                      : "bg-soft-danger"
                                  }  fw-semibold mt-3`}
                                >
                                  <i className="fa-solid fa-circle"></i>{" "}
                                  {blog?.status === 1 ? "Active" : "Inactive"}{" "}
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
                                  {blog.status === 1 && (
                                    <a
                                      onClick={() =>
                                        handleBlockUnblock(blog._id, 0)
                                      }
                                      className="dropdown-item"
                                      href="#"
                                    >
                                      <i className="fa-solid fa-circle text-danger "></i>{" "}
                                      Deactivate
                                    </a>
                                  )}

                                  {blog.status === 0 && (
                                    <a
                                      onClick={() =>
                                        handleBlockUnblock(blog._id, 1)
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
                              {decoded.permissions.includes("Create Blogs") && (
                                <Link
                                  to={`/editblog?bid=${blog._id}`}
                                  className="btn btn-outline-primary"
                                >
                                  <i className="las la-pen text-secondary font-16" />{" "}
                                  Edit Post
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="text-center blog_title_img_div">
                            <img
                              // src="assets/images/small/1.jpg"
                              src={`${renderUrl}uploads/blogs/${blog?.image}`}
                              alt
                              className="blog_title_img"
                            />
                          </div>
                          <div className="post-title mt-4">
                            <div className="row">
                              <div className="col">
                                <span className="badge text-capitalize badge-soft-primary">
                                  {blog?.category?.name}
                                </span>
                              </div>
                              {/*end col*/}
                              <div className="col-auto">
                                <span className="text-muted">
                                  <i className="far fa-calendar me-1" />
                                  {moment(blog?.createdAt).format(
                                    "Do MMMM  YYYY"
                                  )}
                                </span>
                              </div>
                              {/*end col*/}
                            </div>
                            {/*end row*/}
                            <h5
                              href="#"
                              className="font-20 fw-bold d-block mt-3 mb-4"
                            >
                              {blog?.title}
                            </h5>
                            <div
                              className="blog_content_main ck-content"
                              dangerouslySetInnerHTML={{
                                __html: blog?.content,
                              }}
                            ></div>
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

export default SingleBlogPage;
