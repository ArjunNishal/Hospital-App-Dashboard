import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import Topbar from "../../../components/Topbar";
import Footer from "../../../components/Footer";
import Breadcrumb from "../../../components/Breadcrumb";
import jwtDecode from "jwt-decode";
import Swal from "sweetalert2";
import {
  addpermissions,
  axiosInstance,
  permissionslistdoc,
} from "../../../config";
import { useNavigate } from "react-router-dom";
import {
  closemodalEditConsultant,
  closemodalEditDoctor,
} from "../../../Intoggle";

const EditDoctor = ({ getalladmins, selectedadmin }) => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const id = decoded.id;

  const navigate = useNavigate("");

  // const permissionslistEdit = [
  //   "handledoc",
  //   "handleconsultant",
  //   "handlepatient",
  // ];

  const [permissionslistu, setpermissionslistu] = useState([]);
  // console.log(permissionslistu, "permissionslistu ============== ");
  // const navigate = useNavigate("");
  // createdby

  const getpermissions = async () => {
    try {
      const response = await axiosInstance.post(
        "admin-role/getpermissions",
        { creatorid: selectedadmin.createdby._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.permissions);
      console.log(response.data.permissions, "response.data.permissions");

      const filterpermissions = permissionslistdoc.filter((el) =>
        response.data.permissions.includes(el)
      );
      console.log(filterpermissions, "filterpermissions");

      let mergedPermissions = filterpermissions;

      if (decoded.role === "admin" || decoded.role === "superadmin") {
        mergedPermissions = [
          ...new Set([...filterpermissions, ...addpermissions]),
        ];
      }
      console.log(
        mergedPermissions,
        "mergedPermissions",
        "addpermissions = ",
        addpermissions
      );
      setpermissionslistu(mergedPermissions);
    } catch (error) {
      console.log(error);
    }
  };

  const [EditFormdata, setEditFormdata] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    mobileno: "",
    password: "",
    role: "doctor",
    permissions: [],
  });

  const {
    username,
    email,
    mobileno,
    password,
    role,
    permissions,
    firstname,
    lastname,
  } = EditFormdata;

  const setvalues = () => {
    const details = selectedadmin;
    console.log(EditFormdata, details, "EditFormdata ****************");
    getpermissions();
    setEditFormdata({
      username: details?.username,
      firstname: details?.firstName,
      lastname: details?.lastName,
      email: details?.email,
      mobileno: details?.mobileno,
      password: details?.password,
      role: details?.role,
      permissions: details?.permissions,
    });
  };

  useEffect(() => {
    setvalues();
  }, [selectedadmin]);

  const [isValidEmailEdit, setIsValidEmailEdit] = useState(true);
  const [isvalidmobileEdit, setisvalidmobileEdit] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChangemobEdit = (e) => {
    let inputMobileNo = e.target.value.replace(/\D/g, "");
    setisvalidmobileEdit(true);
    if (inputMobileNo.length > 11) {
      inputMobileNo = inputMobileNo.slice(0, 11);
      // setisvalidmobileEdit(false);
    }

    setEditFormdata({
      ...EditFormdata,
      [e.target.name]: inputMobileNo,
    });
  };

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;

    // Check if the email has a dot (.) after @
    if (name === "email") {
      const atIndex = value.indexOf("@");
      const dotIndex = value.lastIndexOf(".");

      const isEmailValid =
        atIndex !== -1 &&
        dotIndex !== -1 &&
        dotIndex > atIndex + 1 &&
        /[a-zA-Z]{2,}$/.test(value.substring(dotIndex + 1));

      setIsValidEmailEdit(isEmailValid);

      if (value === "") {
        setIsValidEmailEdit(true);
      }
    }

    setEditFormdata({
      ...EditFormdata,
      [name]: value,
    });
  };

  //   console.log(EditFormdata, "EditFormdata");

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    try {
      if (!isValidEmailEdit) {
        Swal.fire({
          icon: "error",
          title: "Enter a valid email address.",
        });
        return setIsValidEmailEdit(false);
      }
      // if (mobileno.length < 10 || mobileno.length > 11) {
      //   Swal.fire({
      //     icon: "error",
      //     title: "Enter a 10 digit or a 11 digit mobile number.",
      //   });
      //   return setisvalidmobileEdit(false);
      // }
      if (mobileno.length < 11 || mobileno.length > 11) {
        Swal.fire({
          icon: "error",
          title: "Enter an 11 digit mobile number.",
        });
        return setisvalidmobileEdit(false);
      }

      if (EditFormdata.permissions.length === 0) {
        return Swal.fire({
          icon: "warning",
          title: "Please select atleast one permission for editing doctor.",
        });
      }

      console.log(EditFormdata, username, "EditFormdata");

      //   const admindata = new EditFormdata();
      //   admindata.append("username", username);
      //   admindata.append("email", email);
      //   admindata.append("mobileno", mobileno);
      //   admindata.append("password", password);
      //   admindata.append("role", role);
      //   admindata.append("firstname", firstname);
      //   admindata.append("lastname", lastname);
      //   admindata.append("permissions", permissions);

      //   console.log(JSON.stringify(admindata));
      const admindata = {
        username,
        email,
        mobileno,
        password,
        role,
        firstName: firstname,
        lastName: lastname,
        permissions: permissions,
      };

      const response = await axiosInstance.put(
        `admin-role/edit/doctor/${selectedadmin._id}`,
        admindata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      getalladmins();
      // Display a success message using SweetAlert2
      Swal.fire({
        icon: "success",
        title: "Update Successful",
        text: "You have successfully updated doctor.",
      });

      closemodalEditDoctor();
      //   navigate("/fpoadmins");
    } catch (error) {
      console.error("Update error: ", error);
      //   console.log(JSON.stringify(admindata));
      // Display an error message using SweetAlert2
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response.data.Error,
      });
    }
  };

  const handleoptionspedit = (e) => {
    console.log(
      e.target.name,
      e.target.checked,
      EditFormdata.permissions.includes(`${e.target.name}`),
      "//////////////////////////"
    );

    if (
      e.target.checked === true &&
      !EditFormdata.permissions.includes(`${e.target.name}`)
    ) {
      setEditFormdata((prevData) => ({
        ...prevData,
        permissions: [...prevData.permissions, e.target.name],
      }));
    } else if (
      e.target.checked === false &&
      EditFormdata.permissions.includes(`${e.target.name}`)
    ) {
      setEditFormdata((prevData) => ({
        ...prevData,
        permissions: prevData.permissions.filter(
          (permission) => permission !== e.target.name
        ),
      }));
    }
  };
  useEffect(() => {
    console.log(EditFormdata.permissions, "////////////////////////");
  }, [EditFormdata.permissions]);

  return (
    <>
      {" "}
      <div
        className="modal fade bd-example-modal-lg"
        id="editdoctorModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="myLargeModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header ">
              <h6 className="modal-title m-0" id="myLargeModalLabel">
                Edit Doctor
              </h6>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="editdoctorModalbtnclose"
                aria-label="Close"
              />
            </div>
            {/*end modal-header*/}
            <div className="modal-body">
              <div>
                {/* <Sidebar />
        <Topbar />
        <div className="page-wrapper">
          <div className="page-content-tab">
            <div className="container-fluid">
              <Breadcrumb
                backpage={"Dashboard"}
                currentpage={"Create Admin"}
                backurl={""}
                maintab={""}
                heading={"Create Admin"}
              />
            </div> */}
                <div className="card">
                  {/* <div className="card-header">
                      <h4 className="card-title">Edit Doctor</h4>
                    </div> */}
                  <div className="card-body">
                    <div className="create-admin-form">
                      <form onSubmit={handleSubmitEdit}>
                        <div className="row mx-0">
                          <div className=" col-md-6 col-12">
                            <div className="mb-3">
                              <label htmlFor="firstname">First Name</label>
                              <input
                                type="text"
                                className="form-control"
                                id="firstname"
                                name="firstname"
                                value={firstname}
                                onChange={handleChangeEdit}
                                aria-describedby="firstname"
                                placeholder="First Name"
                                required
                              />
                            </div>
                          </div>
                          <div className=" col-md-6 col-12">
                            <div className="mb-3">
                              <label htmlFor="lastname">Last Name</label>
                              <input
                                type="text"
                                className="form-control"
                                id="lastname"
                                value={lastname}
                                onChange={handleChangeEdit}
                                name="lastname"
                                aria-describedby="lastname"
                                placeholder="Last Name"
                              />
                            </div>
                          </div>
                          <div className=" col-md-6 col-12">
                            <div className="mb-3">
                              <label htmlFor="username">Username</label>
                              <input
                                type="text"
                                className="form-control"
                                id="username"
                                value={username}
                                onChange={handleChangeEdit}
                                name="username"
                                aria-describedby="username"
                                placeholder="username"
                                required
                              />
                            </div>
                          </div>
                          <div className=" col-md-6 col-12">
                            <div className="mb-3">
                              <label htmlFor="email">Email</label>
                              <input
                                type="text"
                                className="form-control"
                                id="email"
                                value={email}
                                onChange={handleChangeEdit}
                                name="email"
                                aria-describedby="email"
                                placeholder="Email"
                                required
                              />
                            </div>
                          </div>
                          <div className=" col-md-6 col-12">
                            <div className="mb-3">
                              <label htmlFor="mobileno">Mobile No.</label>
                              <input
                                type="text"
                                className="form-control"
                                id="mobileno"
                                value={mobileno}
                                onChange={handleChangemobEdit}
                                name="mobileno"
                                aria-describedby="mobileno"
                                placeholder="Mobile No."
                                required
                              />
                            </div>
                          </div>
                          <div className=" col-md-6 col-12">
                            {/* <div className="mb-3">
                                  <label htmlFor="password">Password</label>
                                  <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={handleChangeEdit}
                                    aria-describedby="password"
                                    placeholder="Password"
                                    required
                                  />
                                </div> */}
                            <label htmlFor="password">Password</label>
                            <div className="input-group mb-3 input-group-merge">
                              <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="form-control"
                                name="password"
                                value={password}
                                onChange={handleChangeEdit}
                                placeholder="Enter password"
                                aria-describedby="password"
                                required
                                autocomplete="off"
                              />
                              <span
                                className="input-group-text cursor-pointer"
                                onClick={handleTogglePassword}
                              >
                                <i
                                  className={`fa-regular ${
                                    showPassword ? "fa-eye" : "fa-eye-slash"
                                  }`}
                                />
                              </span>
                            </div>
                          </div>
                          <div className="col-12">
                            <label className="mb-3">
                              <b>Permissions</b>
                            </label>
                            <div className="row mb-3 mx-0">
                              {permissionslistu.map((el, index) => {
                                // console.log(
                                //   permissionslistdoc.includes(el),
                                //   el,
                                //   "el details"
                                // );
                                return (
                                  <div
                                    key={index}
                                    className="col-md-4 mb-2 col-12"
                                  >
                                    <input
                                      type="checkbox"
                                      className="btn-check"
                                      name={el}
                                      id={`btn-check-outlinededit${index}`}
                                      checked={
                                        EditFormdata?.permissions?.includes(el)
                                          ? true
                                          : false
                                      }
                                      onChange={handleoptionspedit}
                                      autoComplete="off"
                                    />
                                    <label
                                      className="btn btn-outline-primary w-100"
                                      htmlFor={`btn-check-outlinededit${index}`}
                                    >
                                      {el}
                                    </label>
                                  </div>
                                );
                              })}
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
                  </div>
                </div>

                {/* <Footer />
          </div>
        </div> */}
              </div>{" "}
            </div>
            {/*end modal-body*/}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-de-danger btn-sm"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
            </div>
            {/*end modal-footer*/}
          </div>
          {/*end modal-content*/}
        </div>
        {/*end modal-dialog*/}
      </div>
    </>
  );
};

export default EditDoctor;
