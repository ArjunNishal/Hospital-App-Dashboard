import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import Footer from "../../components/Footer";
import Breadcrumb from "../../components/Breadcrumb";
import CreateBlogCat from "./CreateBlogCat";
import Pagination from "../../components/Pagination";
import EditAdmin from "../Users/Admin/EditAdmin";
import jwtDecode from "jwt-decode";
import { axiosInstance } from "../../config";
import Swal from "sweetalert2";
import moment from "moment";
import { closemodalcategoryedit } from "../../Intoggle";
import UnauthPage from "../../components/UnauthPage";
import { Link } from "react-router-dom";

const BlogCatList = () => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const id = decoded.id;
  const role = decoded.role;

  const [blogs, setblogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setitemsPerPage] = useState(5);
  const [totalpages, settotalpages] = useState(0);
  const [selectedblog, setselectedblog] = useState({});
  const [searchvalue, setsearchvalue] = useState("");
  const [loading, setloading] = useState(false);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getallblogs = async () => {
    try {
      setloading(true);
      let url = `blog/get/categories?page=${currentPage}&limit=${itemsPerPage}`;

      // if (decoded.role === "superadmin") {
      //   url = `blog/get/categories?page=${currentPage}&limit=${itemsPerPage}`;
      // } else if (decoded.role !== "superadmin") {
      //   url = `blog/get/categories/admin/${
      //     decoded.role === "admin" ? decoded.id : decoded.adminId
      //   }?page=${currentPage}&limit=${itemsPerPage}`;
      // }

      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);
      setblogs(response.data.categories.results);
      settotalpages(response.data.categories.totalRecord);
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  useEffect(() => {
    getallblogs();
  }, []);
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
          ? "Block Blog Category"
          : isBlocked === 1
          ? "Activate Blog Category"
          : "Deactivate Blog Category",
      text: `Are you sure you want to ${
        isBlocked === 2 ? "Block" : isBlocked === 1 ? "Activate" : "Deactivate"
      } this Blog Category?`,
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
        `blog/edit/category/${adminId}/status`,
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
        text: "An error occurred while changing status of Category.",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!selectedblog?.name) {
        Swal.fire({
          icon: "error",
          title: "Enter a category name.",
        });
        return;
      }

      const response = await axiosInstance.put(
        `blog/edit/category/${selectedblog?._id}`,
        { name: selectedblog?.name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      getallblogs();
      // Display a success message using SweetAlert2
      Swal.fire({
        icon: "success",
        title: "Updated category successfully",
        text: "You have successfully Updated category.",
      });

      closemodalcategoryedit();

      setselectedblog({});
    } catch (error) {
      console.error("update error: ", error);
      //   console.log(JSON.stringify(admindata));
      // Display an error message using SweetAlert2
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response.data.message,
      });
    }
  };

  const handleSearch = async (val) => {
    try {
      setloading(true);
      const apiUrl = "admin-role/search";
      const modelName = "BlogCat";

      let mongodbQuery;

      let populateOptions = [{ path: "admin", model: "Admin" }];

      if (decoded.role === "superadmin") {
        mongodbQuery = {
          $or: [{ name: { $regex: val, $options: "i" } }],
        };
      } else if (decoded.role !== "superadmin") {
        mongodbQuery = {
          $or: [{ name: { $regex: val, $options: "i" } }],
          // admin:
          //   decoded.role === "superadmin" || decoded.role === "admin"
          //     ? decoded.id
          //     : decoded.adminId,
        };
      }

      console.log(mongodbQuery, "mongodbQuery");

      const response = await axiosInstance.post(
        apiUrl,
        {
          query: mongodbQuery,
          model: modelName,
          populateOptions: populateOptions,
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
      {role === "superadmin" ||
      decoded.permissions.includes("Manage Blog Categories") ? (
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
                  currentpage={"Blog Categories"}
                  backurl={""}
                  maintab={""}
                  heading={"Blog Categories"}
                />
                <div className="card">
                  <div className="card-header ">
                    <div className="d-flex justify-content-between flex-wrap align-items-center ">
                      <h4 className="card-title mb-md-0 mb-3">
                        Blog Categories
                      </h4>
                      <div
                        className={`d-flex justify-content-md-end justify-content-center   ${
                          decoded.permissions.includes("Create Blog Categories")
                            ? "flex-wrap"
                            : ""
                        } align-items-center gap-2`}
                      >
                        <div className="dataTable-dropdown">
                          <label>
                            <select
                              value={itemsPerPage}
                              onChange={(e) => {
                                setitemsPerPage(Number(e.target.value));
                              }}
                              className="dataTable-selector"
                            >
                              {/* <option value={1}>1</option> */}
                              <option value={5}>5</option>
                              <option value={10}>10</option>
                              <option value={15}>15</option>
                              <option value={20}>20</option>
                              <option value={25}>25</option>
                            </select>
                          </label>
                        </div>
                        {decoded.permissions.includes(
                          "Create Blog Categories"
                        ) && <CreateBlogCat getallblogs={getallblogs} />}
                        <div className="text-center app-search border ssearchbar_int_table rounded   ">
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
                    </div>
                    {/* <p className="text-muted mb-0">
                  Use <code>.table-striped</code> to add zebra-striping to any
                  table row within the <code>&lt;tbody&gt;</code>.
                </p> */}
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
                  {/*end card-header*/}
                  {!loading && (
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-striped mb-0">
                          <thead>
                            <tr>
                              <th>S.No.</th>
                              <th>Name</th>
                              <th>Admin</th>
                              <th>Date</th>
                              <th>Status</th>
                              {decoded.permissions.includes(
                                "Create Blog Categories"
                              ) && <th>Action</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {blogs?.map((ad, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  <Link
                                    className="text-primary text-capitalize"
                                    to={`/blogsbycategory?bcid=${ad._id}`}
                                  >
                                    {ad.name}
                                  </Link>
                                </td>
                                <td> {ad?.admin?.username}</td>
                                <td>
                                  {" "}
                                  {moment(ad.createdAt).format("Do MMMM  YYYY")}
                                </td>
                                <td>
                                  <div className="d-flex align-items-center ">
                                    {ad.status === 1 ? (
                                      <span className="badge badge-soft-success">
                                        Active
                                      </span>
                                    ) : ad.status === 0 ? (
                                      <span className="badge badge-soft-warning">
                                        Deactivated
                                      </span>
                                    ) : (
                                      <span className="badge badge-soft-danger">
                                        Blocked
                                      </span>
                                    )}

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
                                      className="dropdown-menu dropdown-menu-end"
                                      aria-labelledby="dLabel11"
                                    >
                                      {ad.status === 1 && (
                                        <a
                                          onClick={() =>
                                            handleBlockUnblock(ad._id, 0)
                                          }
                                          className="dropdown-item"
                                          href="#"
                                        >
                                          <i className="fa-solid fa-circle text-danger "></i>{" "}
                                          Deactivate
                                        </a>
                                      )}

                                      {ad.status === 0 && (
                                        <a
                                          onClick={() =>
                                            handleBlockUnblock(ad._id, 1)
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
                                </td>
                                {decoded.permissions.includes(
                                  "Create Blog Categories"
                                ) && (
                                  <td className="">
                                    <button
                                      data-bs-toggle="modal"
                                      data-bs-target={`#querymesssage${ad._id}`}
                                      onClick={() => {
                                        setselectedblog(ad);
                                      }}
                                      className="btn text-primary btn-sm"
                                    >
                                      <i className="las la-pen text-secondary font-16"></i>
                                    </button>
                                    <div
                                      className="modal fade bd-example-modal-lg"
                                      id={`querymesssage${ad._id}`}
                                      tabIndex={-1}
                                      role="dialog"
                                      aria-labelledby="myLargeModalLabel"
                                      aria-hidden="true"
                                    >
                                      <div
                                        className="modal-dialog "
                                        role="document"
                                      >
                                        <div className="modal-content">
                                          <div className="modal-header ">
                                            <h6
                                              className="modal-title m-0"
                                              id="myLargeModalLabel"
                                            >
                                              Update Blog Category
                                            </h6>
                                            <button
                                              type="button"
                                              className="btn-close"
                                              data-bs-dismiss="modal"
                                              id="editcategorybtnclose"
                                              aria-label="Close"
                                            />
                                          </div>
                                          {/*end modal-header*/}
                                          <div className="modal-body">
                                            <div className="card">
                                              <div className="card-body">
                                                <form onSubmit={handleSubmit}>
                                                  <div className="row mx-0">
                                                    <div className=" col-12">
                                                      <div className="mb-3">
                                                        <label
                                                          className="mb-2"
                                                          htmlFor="firstname"
                                                        >
                                                          Category Name
                                                        </label>
                                                        <input
                                                          type="text"
                                                          className="form-control"
                                                          id="categoryname"
                                                          name="categoryname"
                                                          value={
                                                            selectedblog.name
                                                          }
                                                          onChange={(e) => {
                                                            setselectedblog(
                                                              (prevData) => ({
                                                                ...prevData,
                                                                name: e.target
                                                                  .value,
                                                              })
                                                            );
                                                          }}
                                                          aria-describedby="categoryname"
                                                          placeholder="categoryname"
                                                          required
                                                        />
                                                      </div>
                                                    </div>
                                                    <div className="col-12 text-center ">
                                                      <button className="btn btn-primary btn-lg">
                                                        Save
                                                      </button>
                                                    </div>
                                                  </div>
                                                </form>
                                              </div>
                                            </div>{" "}
                                          </div>
                                          <div className="modal-footer">
                                            <button
                                              type="button"
                                              className="btn btn-de-danger btn-sm"
                                              data-bs-dismiss="modal"
                                            >
                                              Close
                                            </button>
                                          </div>
                                        </div>
                                        {/*end modal-content*/}
                                      </div>
                                      {/*end modal-dialog*/}
                                    </div>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {/*end /table*/}
                      </div>
                      {searchvalue && !loading && blogs.length === 0 && (
                        <>
                          <div className="text-center  py-5">
                            <p>
                              <b> No Blog Categories found.</b>
                            </p>
                          </div>
                        </>
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
                      {/*end /tableresponsive*/}
                    </div>
                  )}
                  <EditAdmin
                    getallblogs={getallblogs}
                    selectedblog={selectedblog}
                  />
                  {/*end card-body*/}
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

export default BlogCatList;
