import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import Topbar from "../../../components/Topbar";
import Footer from "../../../components/Footer";
import Breadcrumb from "../../../components/Breadcrumb";
import { Link } from "react-router-dom";
import CreateAdmin from "./CreateAdmin";
import Pagination from "../../../components/Pagination";
import { axiosInstance } from "../../../config";
import jwtDecode from "jwt-decode";
import EditAdmin from "./EditAdmin";
import Swal from "sweetalert2";
import Error505 from "../../../components/Error505";
import UnauthPage from "../../../components/UnauthPage";

const AdminsAll = () => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const id = decoded.id;
  const role = decoded.role;

  const [admins, setadmins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setitemsPerPage] = useState(5);
  const [totalpages, settotalpages] = useState(0);
  const [selectedadmin, setselectedadmin] = useState({});
  const [searchvalue, setsearchvalue] = useState("");
  const [loading, setloading] = useState(false);

  const handlePageChange = (page) => {
    // setCurrentPage(page);
    console.log(page, "page", currentPage, "currentPage");
  };

  const handleItemsPerPageChange = (e) => {
    console.log(e);
    setitemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page whenever items per page changes
  };

  const getalladmins = async () => {
    try {
      console.log("getalladmins");
      setloading(true);
      const response = await axiosInstance.get(
        `admin-role/getadmins?page=${currentPage}&limit=${itemsPerPage}`,
        {
          params: { role: "admin" },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      setadmins(response.data.admins.results);
      settotalpages(response.data.admins.totalRecord);
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };
  // alert(currentPage, "currentpage");

  // useEffect(() => {
  //   getalladmins();
  // }, []);
  useEffect(() => {
    getalladmins();
  }, [currentPage, itemsPerPage]);

  // useEffect(() => {
  //   alert("setcurrent page to 1");
  //   setCurrentPage(1);
  // }, [itemsPerPage]);

  const handleBlockUnblock = (adminId, isBlocked) => {
    Swal.fire({
      title:
        isBlocked === 2
          ? "Block Admin"
          : isBlocked === 1
          ? "Activate Admin"
          : "Deactivate Admin",
      text: `Are you sure you want to ${
        isBlocked === 2 ? "Block" : isBlocked === 1 ? "Activate" : "Deactivate"
      } this admin?`,
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
        "admin-role/block",
        {
          adminId,
          status: isBlocked,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedAdmins = admins.map((admin) => {
        if (admin._id === adminId) {
          admin.status = isBlocked;
        }
        return admin;
      });
      setadmins(updatedAdmins);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error occurred while blocking/unblocking the admin.",
      });
    }
  };

  const handleSearch = async (val) => {
    try {
      setloading(true);
      const apiUrl = "admin-role/search";
      const modelName = "Admin";

      let mongodbQuery;

      let populateOptions = null;

      if (decoded.role === "superadmin") {
        mongodbQuery = {
          $or: [
            { username: { $regex: val, $options: "i" } },
            { firstName: { $regex: val, $options: "i" } },
            { lastName: { $regex: val, $options: "i" } },
            { mobileno: { $regex: val, $options: "i" } },
            { email: { $regex: val, $options: "i" } },
          ],
          role: "admin",
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
        setadmins(response.data.data);
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
      getalladmins();
    } else if (value !== "" && value) {
      handleSearch(value);
    }
    setsearchvalue(value);
  };

  return (
    <>
      {role === "superadmin" ? (
        <>
          <Sidebar />
          <Topbar />
          <div className="page-wrapper">
            <div className="page-content-tab">
              <div className="container-fluid">
                <Breadcrumb
                  backpage={"Dashboard"}
                  currentpage={"Admins"}
                  backurl={""}
                  maintab={""}
                  heading={"Admins"}
                />
                <div className="card">
                  <div className="card-header ">
                    <div className="d-flex justify-content-between flex-wrap align-items-center ">
                      <h4 className="card-title mb-md-0 mb-3">All Admins</h4>
                      <div
                        className={`d-flex justify-content-md-end justify-content-center  flex-wrap align-items-center gap-2`}
                      >
                        <div className="dataTable-dropdown">
                          <label>
                            <select
                              value={itemsPerPage}
                              onChange={(e) => {
                                // setitemsPerPage(Number(e.target.value));
                                handleItemsPerPageChange(e);
                                // getalladmins();
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
                        <CreateAdmin getalladmins={getalladmins} />
                        <div className="text-center app-search border  ssearchbar_int_table rounded   ">
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
                  {/*end card-header*/}
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
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-striped mb-0">
                          <thead>
                            <tr>
                              <th>S.No.</th>
                              <th>Username</th>
                              <th>Email</th>
                              <th>Mobile</th>
                              <th>Status</th>
                              <th className="text-end">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {admins?.map((ad, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  <img
                                    src="assets/images/users/user-3.jpg"
                                    alt
                                    className="rounded-circle thumb-xs me-1"
                                  />{" "}
                                  {ad.username}
                                </td>
                                <td> {ad.email}</td>
                                <td> {ad.mobileno}</td>
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
                                        Blockedd
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
                                          <i className="fa-solid fa-circle text-warning "></i>{" "}
                                          Deactivate
                                        </a>
                                      )}
                                      {(ad.status === 0 || ad.status === 1) && (
                                        <a
                                          onClick={() =>
                                            handleBlockUnblock(ad._id, 2)
                                          }
                                          className="dropdown-item"
                                          href="#"
                                        >
                                          <i className="fa-solid fa-circle text-danger"></i>{" "}
                                          Block
                                        </a>
                                      )}
                                      {(ad.status === 0 || ad.status === 2) && (
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
                                <td className="">
                                  <div className="text-end">
                                    <button
                                      data-bs-toggle="modal"
                                      data-bs-target="#editAdminModal"
                                      className="btn"
                                      onClick={() => setselectedadmin(ad)}
                                    >
                                      <i className="las la-pen text-secondary font-16" />
                                    </button>

                                    {/* <a href="#">
                              <i className="las la-trash-alt text-secondary font-16" />
                            </a> */}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {/*end /table*/}
                      </div>
                      {searchvalue && !loading && admins.length === 0 && (
                        <>
                          <div className="text-center  py-5">
                            <p>
                              <b> No Admins found.</b>
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
                    getalladmins={getalladmins}
                    selectedadmin={selectedadmin}
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

export default AdminsAll;
