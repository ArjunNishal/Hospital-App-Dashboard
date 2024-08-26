import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import jwtDecode from "jwt-decode";
import { axiosInstance } from "../../config";
import Swal from "sweetalert2";
import Breadcrumb from "../../components/Breadcrumb";
import CreateAdmin from "../Users/Admin/CreateAdmin";
import Pagination from "../../components/Pagination";
import EditAdmin from "../Users/Admin/EditAdmin";
import Footer from "../../components/Footer";
import UnauthPage from "../../components/UnauthPage";
import moment from "moment";
import CreateAppointment from "./CreateAppointment";

const Appointments = () => {
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

  const getallappointments = async () => {
    try {
      setloading(true);
      let url;

      if (role === "superadmin") {
        url = `admin-role/appointments`;
      } else {
        url = `admin-role/appointments`;
      }

      const response = await axiosInstance.post(
        url,
        { role: decoded.role, userId: decoded.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      setadmins(response.data.data.results);
      settotalpages(response.data.data.totalRecord);
      setloading(false);
    } catch (error) {
      setloading(false);
      console.log(error);
    }
  };

  //   useEffect(() => {
  //     getallappointments();
  //   }, []);
  useEffect(() => {
    getallappointments();
  }, [currentPage, itemsPerPage]);

  // useEffect(() => {
  //   alert("setcurrent page to 1");
  //   setCurrentPage(1);
  // }, [itemsPerPage]);

  const handleBlockUnblock = (adminId, isBlocked) => {
    Swal.fire({
      title:
        isBlocked === 2
          ? "Decline Appointment?"
          : isBlocked === 1
          ? "Approve Appointment?"
          : "Make Appointment Pending?",
      //   text: `Are you sure you want to ${
      //     isBlocked === 2 ? "Block" : isBlocked === 1 ? "Activate" : "Deactivate"
      //   }`,
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
        "admin-role/appointments/status",
        {
          appointmentId: adminId,
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
      const modelName = "Appointment";

      let mongodbQuery;

      let populateOptions = [
        { path: "doctor", model: "Admin" },
        { path: "patient", model: "Patient" },
      ];

      if (decoded.role === "superadmin") {
        mongodbQuery = { concern: { $regex: val, $options: "i" } };
      } else if (decoded.role === "doctor" || decoded.role === "consultant") {
        mongodbQuery = {
          doctor: decoded.memberid,
          concern: { $regex: val, $options: "i" },
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
      getallappointments();
    } else if (value !== "" && value) {
      handleSearch(value);
    }
    setsearchvalue(value);
  };

  return (
    <>
      {role === "superadmin" || decoded.permissions.includes("Appointments") ? (
        <>
          <Sidebar />
          <Topbar />
          <div className="page-wrapper">
            <div className="page-content-tab">
              <div className="container-fluid">
                <Breadcrumb
                  backpage={"Dashboard"}
                  currentpage={"Appointments"}
                  backurl={""}
                  maintab={""}
                  heading={"Appointments"}
                />
                <div className="card">
                  <div className="card-header ">
                    <div className="d-flex justify-content-between flex-wrap align-items-center ">
                      <h4 className="card-title mb-md-0 mb-3">
                        All Appointments
                      </h4>
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
                                // getallappointments();
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
                        <CreateAppointment
                          getallappointments={getallappointments}
                        />

                        <div className="text-center app-search border  ssearchbar_int_table rounded   ">
                          <form role="search" action="#" method="get">
                            <input
                              type="search"
                              name="search"
                              className="form-control top-search mb-0"
                              placeholder="Search Purpose"
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
                              <th>Doctor</th>
                              <th>Patient</th>
                              <th>Purpose</th>
                              <th>Appointment Date</th>
                              <th>Created on</th>
                              <th>Status</th>
                              {/* <th className="text-end">Action</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {admins?.map((ad, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{ad.doctor.username}</td>
                                <td> {ad.patient.username}</td>
                                <td>
                                  <div>
                                    {/* Button trigger modal */}
                                    <button
                                      type="button"
                                      className="btn btn-outline-primary border-0"
                                      data-bs-toggle="modal"
                                      data-bs-target={`#concernmodal${index}`}
                                    >
                                      <i class="fa-regular fa-eye"></i>
                                    </button>
                                    {/* Modal */}
                                    <div
                                      className="modal fade"
                                      id={`concernmodal${index}`}
                                      tabIndex={-1}
                                      aria-labelledby="concernmodalLabel"
                                      aria-hidden="true"
                                    >
                                      <div className="modal-dialog">
                                        <div className="modal-content">
                                          <div className="modal-header">
                                            <h1
                                              className="modal-title fs-5"
                                              id="concernmodalLabel"
                                            >
                                              Appointment Details
                                            </h1>
                                            <button
                                              type="button"
                                              className="btn-close"
                                              data-bs-dismiss="modal"
                                              aria-label="Close"
                                            />
                                          </div>
                                          <div className="modal-body">
                                            <div className="appointment-details">
                                              <div className="doctor-details">
                                                <div className="card card-body">
                                                  <b>Doctor</b>
                                                  <h5>
                                                    {ad.doctor.username} (
                                                    {ad.doctor.firstName}
                                                    {ad.doctor.lastName})
                                                  </h5>
                                                  <p className="m-0">
                                                    <b>Email : </b>{" "}
                                                    {ad.doctor.email}
                                                  </p>
                                                  <p className="m-0">
                                                    <b>Phone : </b>{" "}
                                                    {ad.doctor.mobileno}
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="patient-details">
                                                <div className="card card-body">
                                                  <b>Patient</b>
                                                  <h5>
                                                    {ad.patient.username} (
                                                    {ad.patient.firstName}
                                                    {ad.patient.lastName})
                                                  </h5>
                                                  <p className="m-0">
                                                    <b>Email : </b>{" "}
                                                    {ad.patient.email}
                                                  </p>
                                                  <p className="m-0">
                                                    <b>Phone : </b>{" "}
                                                    {ad.patient.mobileno}
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="concern-appointment">
                                                <p>
                                                  <b>Date : </b>
                                                  {moment(ad.date).format(
                                                    "Do MMMM YYYY"
                                                  )}
                                                </p>
                                                <p>
                                                  <b>Purpose :</b>
                                                </p>
                                                <p>{ad.concern}</p>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="modal-footer">
                                            <button
                                              type="button"
                                              className="btn btn-secondary"
                                              data-bs-dismiss="modal"
                                            >
                                              Close
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  {moment(ad.date).format("Do MMMM YYYY")}{" "},
                                  {moment(ad?.time).format("hh:mm a")}
                                </td>
                                <td>
                                  {moment(ad.createdAt).format("Do MMMM YYYY")}
                                </td>
                                <td>
                                  <div className="d-flex align-items-center ">
                                    {ad.status === 1 ? (
                                      <span className="badge badge-soft-success">
                                        Approve
                                      </span>
                                    ) : ad.status === 0 ? (
                                      <span className="badge badge-soft-warning">
                                        Pending
                                      </span>
                                    ) : (
                                      <span className="badge badge-soft-danger">
                                        Decline
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
                                          Pending
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
                                          Decline
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
                                          Approve
                                        </a>
                                      )}
                                      {/* <a className="dropdown-item" href="#">
                                Tasks Details
                              </a> */}
                                    </div>
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
                              <b> No Appointments found.</b>
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

export default Appointments;
