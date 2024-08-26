import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import Footer from "../../components/Footer";
import Breadcrumb from "../../components/Breadcrumb";
import CreateBlogCat from "./CreateBlogCat";
import Pagination from "../../components/Pagination";
import EditAdmin from "../Users/Admin/EditAdmin";
import jwtDecode from "jwt-decode";
import { axiosInstance, renderUrl } from "../../config";
import Swal from "sweetalert2";
import moment from "moment";
import { closemodalcategoryedit } from "../../Intoggle";
import UnauthPage from "../../components/UnauthPage";
import { Link, useLocation, useNavigate } from "react-router-dom";

const BlogsByCat = () => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const id = decoded.id;
  const role = decoded.role;

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const bcid = searchParams.get("bcid");

  const [blogs, setblogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setitemsPerPage] = useState(6);
  const [totalpages, settotalpages] = useState(0);
  const [category, setcategory] = useState("");
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const [searchvalue, setsearchvalue] = useState("");

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getallblogs = async () => {
    try {
      let url;
      setloading(true);

      if (decoded.role === "superadmin") {
        url = `blog/get/blogsbycat/admin/${bcid}?page=${currentPage}&limit=${itemsPerPage}`;
      } else if (decoded.role !== "superadmin") {
        url = `blog/get/blogsbycat/admin/${bcid}?page=${currentPage}&limit=${itemsPerPage}`;
      }

      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);
      setblogs(response.data.blogs.results);
      settotalpages(response.data.blogs.totalRecord);
      setcategory(response.data.category);
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  useEffect(() => {
    if (bcid) {
      getallblogs();
    } else {
      //   setError("No blog category ID provided");
      setloading(false);
      navigate("/blogs");
    }
    // fetchBlogById();
  }, [bcid]);

  //   useEffect(() => {
  //     getallblogs();
  //   }, []);
  useEffect(() => {
    getallblogs();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

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

      getallblogs();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error occurred while changing status of Blog.",
      });
    }
  };

  const handleSearch = async (val) => {
    try {
      setloading(true);
      const apiUrl = "admin-role/search";
      const modelName = "Blog";
      // const role = roleid._id;
      // const mongodbQuery = {
      //   $or: [
      //     { name: { $regex: val, $options: "i" } },
      //     { phone: { $regex: val, $options: "i" } },
      //     // { radio: rid },
      //   ],
      // };
      let mongodbQuery;

      if (decoded.role === "superadmin") {
        mongodbQuery = {
          title: { $regex: val, $options: "i" },
          category: bcid,
        };
      } else if (decoded.role !== "superadmin") {
        mongodbQuery = {
          title: { $regex: val, $options: "i" },
          category: bcid,
        };
      }

      console.log(mongodbQuery, "mongodbQuery");

      const response = await axiosInstance.post(
        apiUrl,
        {
          query: mongodbQuery,
          model: modelName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        console.log(response.data, "members search");
        setblogs(response.data.data);
        // setSearchResults(response.data.data);
      } else {
        console.error("Error:", response.data.message);
      }
      setloading(false);
    } catch (error) {
      console.error("Error:", error);
      setloading(false);
    }
  };

  const handlesearchevent = (e) => {
    const value = e.target.value;
    if (value === "") {
      getallblogs();
    } else if (value !== "" && value) {
      handleSearch(value);
    }
    setsearchvalue(value);
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
                <Breadcrumb
                  backpage={"Blog"}
                  currentpage={"Blog List"}
                  backurl={""}
                  maintab={""}
                  heading={`Blog List for ${category}`}
                />
                <div className="blogcards_row">
                  <div className="row mx-0">
                    <div className="col-12 p-0 d-flex justify-content-center ">
                      <div className="text-center app-search border ssearchbar_int shadow rounded-pill ">
                        <form role="search" action="#" method="get">
                          <input
                            type="search"
                            name="search"
                            className="form-control top-search mb-0"
                            placeholder="Search..."
                            onChange={(e) => {
                              handlesearchevent(e);
                            }}
                          />
                          <button type="submit">
                            <i className="ti ti-search" />
                          </button>
                        </form>
                      </div>
                    </div>

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
                    <div className="col-12 my-2">
                      <div className="text-end">
                        <div className="dataTable-dropdown mb-md-0 mb-3">
                          <label>
                            Show entries{" "}
                            <select
                              value={itemsPerPage}
                              onChange={(e) => {
                                setitemsPerPage(Number(e.target.value));
                              }}
                              className="dataTable-selector"
                            >
                              {/* <option value={1}>1</option> */}
                              <option value={6}>6</option>
                              <option value={12}>12</option>
                              <option value={15}>15</option>
                              <option value={21}>21</option>
                              <option value={27}>27</option>
                            </select>
                          </label>
                        </div>
                      </div>
                    </div>
                    {blogs?.map((bl, index) => {
                      return (
                        <div key={index} className="col-lg-4">
                          <div className="card shadow">
                            <div className="card-body">
                              <div className="blog-card">
                                <img
                                  //   src="assets/images/small/img-1.jpg"
                                  src={`${renderUrl}uploads/blogs/${bl?.image}`}
                                  alt
                                  className="blog_card_img rounded"
                                />
                                <div className="text-end">
                                  <span
                                    className={`badge badge-purple px-3 py-2  ${
                                      bl?.status === 1
                                        ? "bg-soft-success"
                                        : "bg-soft-danger"
                                    }  fw-semibold mt-3`}
                                  >
                                    <i className="fa-solid fa-circle"></i>{" "}
                                    {bl?.status === 1 ? "Active" : "Inactive"}{" "}
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
                                    {bl?.status === 1 && (
                                      <a
                                        onClick={() =>
                                          handleBlockUnblock(bl?._id, 0)
                                        }
                                        className="dropdown-item"
                                        href="#"
                                      >
                                        <i className="fa-solid fa-circle text-danger "></i>{" "}
                                        Deactivate
                                      </a>
                                    )}

                                    {bl?.status === 0 && (
                                      <a
                                        onClick={() =>
                                          handleBlockUnblock(bl._id, 1)
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
                                <h4 className="my-3">
                                  <a href className>
                                    {bl?.title}
                                  </a>
                                </h4>
                                <span className="badge badge-purple text-capitalize px-3 py-2 bg-soft-primary fw-semibold mt-3">
                                  {bl?.category?.name}
                                </span>
                                {/* <p className="text-muted">
                                    The standard chunk of Lorem Ipsum used since
                                    the 1500s is reproduced below for those
                                    interested. Cum sociis natoque penatibus et
                                    magnis.
                                  </p> */}
                                <hr className="hr-dashed" />
                                <div className="d-flex justify-content-between">
                                  <div className="meta-box">
                                    <div className="media">
                                      <img
                                        src="assets/images/users/user-5.jpg"
                                        alt
                                        className="thumb-sm rounded-circle me-2"
                                      />
                                      <div className="media-body align-self-center text-truncate">
                                        <h6 className="m-0 text-dark">
                                          {bl?.createdby?.username}
                                        </h6>
                                        <p className="m-0">
                                          by{" "}
                                          {bl?.createdby?.role === "superadmin"
                                            ? "Super admin"
                                            : bl?.createdby?.role === "admin"
                                            ? "Admin"
                                            : bl?.createdby?.role ===
                                              "consultant"
                                            ? "Consultant"
                                            : bl?.createdby?.role === "doctor"
                                            ? "Doctor"
                                            : ""}
                                        </p>
                                        <ul className="p-0 list-inline mb-0">
                                          <li className="list-inline-item">
                                            {moment(bl?.createdAt).format(
                                              "Do MMMM  YYYY"
                                            )}
                                          </li>
                                        </ul>
                                      </div>
                                      {/*end media-body*/}
                                    </div>
                                  </div>
                                  {/*end meta-box*/}
                                  <div className="align-self-center">
                                    <Link
                                      to={`/blog?bid=${bl?._id}`}
                                      className="btn btn-primary rounded-pill"
                                    >
                                      Read more{" "}
                                      <i className="fas fa-chevron-right" />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                              {/*end blog-card*/}
                            </div>
                            {/*end card-body*/}
                          </div>
                          {/*end card*/}
                        </div>
                      );
                    })}
                    {(blogs?.length === 0 || !blogs) && !loading && (
                      <div className="col-12 py-5">
                        <p className="text-center">
                          <b>No Blogs Found</b>
                        </p>
                      </div>
                    )}
                    {!searchvalue && (
                      <Pagination
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalItems={totalpages}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                      />
                    )}
                  </div>
                </div>
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

export default BlogsByCat;
