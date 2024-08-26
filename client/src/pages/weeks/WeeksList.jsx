import React, { useEffect, useState } from "react";
import Topbar from "../../components/Topbar";
import { axiosInstance } from "../../config";
import jwtDecode from "jwt-decode";
import moment from "moment";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/Footer";
import UnauthPage from "../../components/UnauthPage";
import Pagination from "../../components/Pagination";
import Swal from "sweetalert2";

const WeeksList = () => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const id = decoded.id;
  const role = decoded.role;

  console.log(decoded);
  const [surveys, setsurveys] = useState([]);
  const [error, setError] = useState(null);
  const [selectedquery, setselectedquery] = useState("");
  const [searchvalue, setsearchvalue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setitemsPerPage] = useState(10);
  const [totalpages, settotalpages] = useState(0);
  // const [searchvalue, setsearchvalue] = useState("");
  const [loading, setloading] = useState(false);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const fetchQueryList = async () => {
    try {
      setloading(true);
      let url = `weeks/getweeks?page=${currentPage}&limit=${itemsPerPage}`;

      if (decoded.role === "admin") {
        url = `weeks/getweek/admin/${decoded.id}?page=${currentPage}&limit=${itemsPerPage}`;
      } else if (decoded.role === "doctor" || decoded.role === "consultant") {
        url = `weeks/getweek/admin/${decoded.adminId}?page=${currentPage}&limit=${itemsPerPage}`;
      }

      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      settotalpages(response.data.data.totalRecord);
      setsurveys(response.data.data.results);
      setloading(false);
    } catch (err) {
      console.log(err);
      setError("Error while fetching Weeks list");
      setloading(false);
    }
  };

  useEffect(() => {
    fetchQueryList();
  }, []);
  useEffect(() => {
    fetchQueryList();
  }, [currentPage, itemsPerPage]);

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

      fetchQueryList();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error occurred while changing status of the Week.",
      });
    }
  };

  const handleSearch = async (val) => {
    try {
      setloading(true);
      const apiUrl = "admin-role/search";
      const modelName = "Week";

      let mongodbQuery;

      let populateOptions = [
        { path: "admin", model: "Admin" },
        { path: "createdby", model: "Admin" },
        { path: "week", model: "WeekMaster" },
      ];

      if (decoded.role === "superadmin") {
        mongodbQuery = {
          weekName: val,
        };
      } else if (decoded.role !== "superadmin") {
        mongodbQuery = {
          weekName: val,
          admin:
            decoded.role === "superadmin" || decoded.role === "admin"
              ? decoded.id
              : decoded.adminId,
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
        setsurveys(response.data.data);
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
      fetchQueryList();
    } else if (value !== "" && value) {
      handleSearch(value);
    }
    setsearchvalue(value);
  };

  return (
    <>
      {role === "superadmin" || decoded.permissions.includes("Manage Weeks") ? (
        <>
          <Sidebar />
          <Topbar />
          <div className="page-wrapper">
            <div className="page-content-tab">
              <div className="container-fluid">
                <Breadcrumb
                  backpage={"Dashboard"}
                  currentpage={"Weeks"}
                  backurl={""}
                  maintab={""}
                  heading={"Weeks"}
                />
              </div>
              <div className="queriesmain">
                <div className="card">
                  <div className="card-header ">
                    <div className="d-flex justify-content-between flex-wrap align-items-center ">
                      <h4 className="card-title mb-md-0 mb-3">All Weeks</h4>
                      <div
                        className={`d-flex justify-content-md-end justify-content-center  align-items-center gap-2`}
                      >
                        <div className="dataTable-dropdown ">
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
                        {/* {decoded.permissions.includes("Create Consultants") && (
                            <CreateConsultant getalladmins={getalladmins} />
                          )} */}
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
                              <th>Week Master</th>
                              <th>Admin</th>
                              <th>Created By</th>
                              <th>Date</th>
                              {/* <th>Member</th> */}
                              <th>Status</th>
                              <th className="">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {surveys?.map((ad, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{ad?.week?.name}</td>
                                <td>{ad?.admin?.username}</td>
                                <td>{ad?.createdby?.username}</td>
                                <td>
                                  {" "}
                                  {moment(ad?.createdAt).format(
                                    "Do MMMM  YYYY"
                                  )}
                                </td>
                                <td>
                                  <div className="d-flex align-items-center ">
                                    {ad?.status === 1 ? (
                                      <span className="badge badge-soft-success">
                                        Active
                                      </span>
                                    ) : (
                                      <span className="badge badge-soft-danger">
                                        Closed
                                      </span>
                                    )}

                                    {(decoded.permissions.includes(
                                      "Manage Weeks"
                                    ) ||
                                      role === "superadmin") && (
                                      <>
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
                                          {ad?.status === 1 && (
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

                                          {ad?.status === 0 && (
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
                                      </>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <Link
                                    to={`/week?wid=${ad?._id}`}
                                    className="btn text-primary"
                                  >
                                    <i class="fa-regular fa-eye"></i>
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {/*end /table*/}
                      </div>
                      {searchvalue && !loading && surveys.length === 0 && (
                        <>
                          <div className="text-center  py-5">
                            <p>
                              <b> No Weeks found.</b>
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

export default WeeksList;
