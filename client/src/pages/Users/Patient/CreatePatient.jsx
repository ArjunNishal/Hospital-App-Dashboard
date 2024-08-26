import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import Topbar from "../../../components/Topbar";
import Footer from "../../../components/Footer";
import Breadcrumb from "../../../components/Breadcrumb";
import jwtDecode from "jwt-decode";
import Swal from "sweetalert2";
import { axiosInstance, permissionslistconsultant } from "../../../config";
import { useNavigate } from "react-router-dom";
import {
  closemodalConsultantAdmin,
  closemodalCreateAdmin,
} from "../../../Intoggle";

const CreatePatient = ({ getalladmins }) => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const id = decoded.id;
  // const fileInputRef = React.useRef(null);
  const navigate = useNavigate("");

  // const permissionslist = ["handledoc", "handleconsultant", "handlepatient"];
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    mobileno: "",
    password: "",
    role: "patient",
    dob: "",
    middlename: "",
    age: "",
    gender: "",
    maritalstatus: "",
    religion: "",
    address: "",
    city: "",
    state: "",
    country: "",
    lga: "",
    occupation: "",
    language: "",
    tribe: "",
    bloodgroup: "",
    remarks: "",
    allergies: "",
    tpaID: "",
    tpavalidity: "",
    nationalidentification: "",
    alternatenumber: "",
    gaurdianname: "",
  });

  const {
    username,
    email,
    mobileno,
    password,
    dob,
    role,
    // permissions,
    firstname,
    lastname,
    middlename,
    age,
    gender,
    maritalstatus,
    religion,
    address,
    city,
    state,
    country,
    lga,
    occupation,
    language,
    tribe,
    gaurdianname,
    bloodgroup,
    remarks,
    allergies,
    tpaID,
    tpavalidity,
    nationalidentification,
    alternatenumber,
  } = formData;
  // const [photoimg, setphotoimg] = useState(null);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isvalidmobile, setisvalidmobile] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChangemob = (e) => {
    let inputMobileNo = e.target.value.replace(/\D/g, "");
    setisvalidmobile(true);
    if (inputMobileNo.length > 11) {
      inputMobileNo = inputMobileNo.slice(0, 11);
      // setisvalidmobile(false);
    }

    setFormData({
      ...formData,
      [e.target.name]: inputMobileNo,
    });
  };
  // const handleImageChange = (e) => {
  //   const file = e.target.files[0]; // Get the first file from the FileList
  //   if (file) {
  //     setphotoimg(file);
  //   }
  //   // console.log(file);
  // };

  const handleChange = (e) => {
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

      setIsValidEmail(isEmailValid);

      if (value === "") {
        setIsValidEmail(true);
      }
      setFormData({
        ...formData,
        [e.target.name]: value,
      });
    } else if (name === "mobileno" || name === "alternatenumber") {
      let inputMobileNo = e.target.value.replace(/\D/g, "");
      setisvalidmobile(true);
      if (inputMobileNo.length > 11) {
        inputMobileNo = inputMobileNo.slice(0, 11);
        // setisvalidmobile(false);
      }

      setFormData({
        ...formData,
        [e.target.name]: inputMobileNo,
      });
    } else if (name === "dob") {
      // let inputAge = value.replace(/\D/g, ""); // Remove non-digit characters
      // if (inputAge.length > 3) {
      //   inputAge = inputAge.slice(0, 3); // Limit to maximum 3 digits
      // }
      setFormData({
        ...formData,
        [name]: value,
        // age: calculateAge(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const calculateAge = (dob) => {
    const dobDate = new Date(dob);
    const ageDiffMs = Date.now() - dobDate.getTime();
    const ageDate = new Date(ageDiffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  console.log(formData, "formData");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!isValidEmail) {
        Swal.fire({
          icon: "error",
          title: "Enter a valid email address.",
        });
        return setIsValidEmail(false);
      }
      // if (mobileno.length < 10 || mobileno.length > 11) {
      //   Swal.fire({
      //     icon: "error",
      //     title: "Enter a 10 digit or a 11 digit mobile number.",
      //   });
      //   return setisvalidmobile(false);
      // }
      if (mobileno.length < 11 || mobileno.length > 11) {
        Swal.fire({
          icon: "error",
          title: "Enter an 11 digit mobile number.",
        });
        return setisvalidmobile(false);
      }
      // if (
      //   alternatenumber &&
      //   (alternatenumber.length < 10 || alternatenumber.length > 11)
      // ) {
      //   Swal.fire({
      //     icon: "error",
      //     title: "Enter a 10 digit or a 11 digit alternate mobile number.",
      //   });
      //   return setisvalidmobile(false);
      // }
      if (
        alternatenumber &&
        (alternatenumber.length < 11 || alternatenumber.length > 11)
      ) {
        Swal.fire({
          icon: "error",
          title: "Enter an 11 digit alternate mobile number.",
        });
        return setisvalidmobile(false);
      }

      // const formdata = new FormData();

      // formdata.append(
      //   "createdby",
      //   decoded.role === "admin" || decoded.role === "superadmin"
      //     ? decoded.id
      //     : decoded.memberid
      // );
      // formdata.append(
      //   "adminid",
      //   decoded.role === "admin" || decoded.role === "superadmin"
      //     ? decoded.id
      //     : decoded.adminId
      // );
      // formdata.append("username", username);
      // formdata.append("email", email);
      // formdata.append("mobileno", mobileno);
      // formdata.append("password", password);
      // formdata.append("dob", dob);
      // formdata.append("role", role);
      // formdata.append("firstName", firstname);
      // formdata.append("lastName", lastname);
      // formdata.append("middlename", middlename);
      // formdata.append("age", age);
      // formdata.append("gender", gender);
      // formdata.append("maritalstatus", maritalstatus);
      // formdata.append("religion", religion);
      // formdata.append("address", address);
      // formdata.append("city", city);
      // formdata.append("state", state);
      // formdata.append("country", country);
      // formdata.append("lga", lga);
      // formdata.append("occupation", occupation);
      // formdata.append("language", language);
      // formdata.append("tribe", tribe);
      // formdata.append("gaurdianname", gaurdianname);
      // formdata.append("bloodgroup", bloodgroup);
      // formdata.append("remarks", remarks);
      // formdata.append("allergies", allergies);
      // formdata.append("tpaID", tpaID);
      // formdata.append("tpavalidity", tpavalidity);
      // formdata.append("nationalidentification", nationalidentification);
      // formdata.append("alternatenumber", alternatenumber);
      // formdata.append("photo", photoimg);

      const patientdata = {
        createdby:
          decoded.role === "admin" || decoded.role === "superadmin"
            ? decoded.id
            : decoded.memberid,
        adminid:
          decoded.role === "admin" || decoded.role === "superadmin"
            ? decoded.id
            : decoded.adminId,
        username: username,
        email: email,
        mobileno: mobileno,
        password: password,
        dob: dob,
        role: role,
        firstName: firstname,
        lastName: lastname,
        middlename: middlename,
        age: age,
        gender: gender,
        maritalstatus: maritalstatus,
        religion: religion,
        address: address,
        city: city,
        state: state,
        country: country,
        lga: lga,
        occupation: occupation,
        language: language,
        tribe: tribe,
        gaurdianname: gaurdianname,
        bloodgroup: bloodgroup,
        remarks: remarks,
        allergies: allergies,
        tpaID: tpaID,
        tpavalidity: tpavalidity,
        nationalidentification: nationalidentification,
        alternatenumber: alternatenumber,
      };

      const response = await axiosInstance.post(
        "admin-role/addpatient",
        patientdata,
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
        title: "Registration Successful",
        text: "You have successfully created Patient.",
      });

      closemodalConsultantAdmin();

      setFormData({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        mobileno: "",
        password: "",
        role: "patient",
        dob: "",
        middlename: "",
        age: "",
        gender: "",
        maritalstatus: "",
        religion: "",
        address: "",
        city: "",
        state: "",
        country: "",
        lga: "",
        occupation: "",
        language: "",
        tribe: "",
        bloodgroup: "",
        remarks: "",
        allergies: "",
        tpaID: "",
        tpavalidity: "",
        nationalidentification: "",
        alternatenumber: "",
        gaurdianname: "",
      });
      // fileInputRef.current.value = "";
      // setphotoimg(null);
      //   navigate("/fpoadmins");
    } catch (error) {
      console.error("Registration error: ", error);
      //   console.log(JSON.stringify(admindata));
      // Display an error message using SweetAlert2
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.response.data.Error,
      });
    }
  };

  //   const handleoptionsp = (e) => {
  //     console.log(
  //       e.target.name,
  //       e.target.checked,
  //       formData.permissions.includes(`${e.target.name}`)
  //     );

  //     if (
  //       e.target.checked === true &&
  //       !formData.permissions.includes(`${e.target.name}`)
  //     ) {
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         permissions: [...prevData.permissions, e.target.name],
  //       }));
  //     } else if (
  //       e.target.checked === false &&
  //       formData.permissions.includes(`${e.target.name}`)
  //     ) {
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         permissions: prevData.permissions.filter(
  //           (permission) => permission !== e.target.name
  //         ),
  //       }));
  //     }
  //   };
  //   useEffect(() => {
  //     console.log(formData.permissions);
  //   }, [formData.permissions]);

  const openModalCreateAdmin = () => {
    setFormData({
      username: "",
      firstname: "",
      lastname: "",
      email: "",
      mobileno: "",
      password: "",
      role: "patient",
      //   permissions: [],
    });
  };

  return (
    <>
      {decoded.permissions.includes("Create Patient") ? (
        <>
          {" "}
          <button
            data-bs-toggle="modal"
            data-bs-target="#createConsultantModal"
            className="btn-primary btn d-inline "
            onClick={openModalCreateAdmin}
          >
            <i className="fa-solid fa-plus"></i> Add Patient
          </button>
          <div
            className="modal fade bd-example-modal-lg"
            id="createConsultantModal"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="myLargeModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-xl" role="document">
              <div className="modal-content">
                <div className="modal-header ">
                  <h6 className="modal-title m-0" id="myLargeModalLabel">
                    Create New Patient
                  </h6>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    id="createConsultantModalbtnclose"
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
                      <div className="card-header">
                        <h4 className="card-title">Create New Patient</h4>
                      </div>
                      <div className="card-body">
                        <div className="create-admin-form">
                          <form onSubmit={handleSubmit}>
                            <div className="row mx-0">
                              <div className="col-md-6 col-lg-4 col-12">
                                <div className="mb-3">
                                  <label htmlFor="firstname">First Name</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="firstname"
                                    name="firstname"
                                    value={firstname}
                                    onChange={handleChange}
                                    aria-describedby="firstname"
                                    placeholder="First Name"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 col-lg-4 col-12">
                                <div className="mb-3">
                                  <label htmlFor="middlename">
                                    Middle Name
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="middlename"
                                    value={middlename}
                                    onChange={handleChange}
                                    name="middlename"
                                    aria-describedby="middlename"
                                    placeholder="Middle Name"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 col-lg-4 col-12">
                                <div className="mb-3">
                                  <label htmlFor="lastname">Last Name</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="lastname"
                                    value={lastname}
                                    onChange={handleChange}
                                    name="lastname"
                                    aria-describedby="lastname"
                                    placeholder="Last Name"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 col-lg-4 col-12">
                                <div className="mb-3">
                                  <label htmlFor="username">Username</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    value={username}
                                    onChange={handleChange}
                                    name="username"
                                    aria-describedby="username"
                                    placeholder="username"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 col-lg-4 col-12">
                                <div className="mb-3">
                                  <label htmlFor="gaurdianname">
                                    Guardian Name
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="gaurdianname"
                                    value={gaurdianname}
                                    onChange={handleChange}
                                    name="gaurdianname"
                                    aria-describedby="gaurdianname"
                                    placeholder="Guardian Name"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 col-lg-4 col-12">
                                <div className="mb-3">
                                  <label htmlFor="bloodgroup">
                                    Blood Group
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="bloodgroup"
                                    value={bloodgroup}
                                    onChange={handleChange}
                                    name="bloodgroup"
                                    aria-describedby="bloodgroup"
                                    placeholder=" Blood Group"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 col-lg-4 col-12">
                                <div className="mb-3">
                                  <label htmlFor="email">Email</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="email"
                                    value={email}
                                    onChange={handleChange}
                                    name="email"
                                    aria-describedby="email"
                                    placeholder="Email"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 col-lg-4 col-12">
                                <div className="mb-3">
                                  <label htmlFor="mobileno">Mobile No.</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="mobileno"
                                    value={mobileno}
                                    onChange={handleChangemob}
                                    name="mobileno"
                                    aria-describedby="mobileno"
                                    placeholder="Mobile No."
                                    required
                                  />
                                </div>
                              </div>{" "}
                              <div className=" col-md-6 col-lg-4 col-12">
                                <div className="mb-3">
                                  <label htmlFor="alternatenumber">
                                    Telephone number
                                  </label>
                                  <input
                                    type="number"
                                    onFocus={(e) =>
                                      e.target.addEventListener(
                                        "wheel",
                                        function (e) {
                                          e.preventDefault();
                                        },
                                        { passive: false }
                                      )
                                    }
                                    className={`form-control`}
                                    id="alternatenumber"
                                    name="alternatenumber"
                                    value={alternatenumber}
                                    onChange={handleChange}
                                    aria-describedby="alternatenumber"
                                    placeholder="Telephone number"
                                    required={true}
                                  />
                                  {/* <div className="invalid-feedback">
                                    {errors.tribe}
                                  </div> */}
                                </div>
                              </div>
                              <div className="col-md-6 col-lg-4 col-12">
                                {/* <div className="mb-3">
                                <label htmlFor="password">Password</label>
                                <input
                                  type="password"
                                  className="form-control"
                                  id="password"
                                  name="password"
                                  value={password}
                                  onChange={handleChange}
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
                                    onChange={handleChange}
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
                              <div className=" col-md-6 col-lg-4 col-12">
                                <div className="mb-3">
                                  <label htmlFor="dob">DOB</label>
                                  <input
                                    type="date"
                                    className={`form-control`}
                                    id="dob"
                                    name="dob"
                                    value={dob}
                                    onChange={handleChange}
                                    aria-describedby="dob"
                                    placeholder="DOB"
                                    required={true}
                                    //
                                  />
                                  {/* <div className="invalid-feedback">
                                    {errors.dob}
                                  </div> */}
                                </div>
                              </div>
                              <div className=" col-md-6 col-lg-4 col-12">
                                <div className="mb-3">
                                  <label htmlFor="age">Age</label>
                                  <input
                                    type="text"
                                    className={`form-control`}
                                    id="age"
                                    name="age"
                                    value={age}
                                    onChange={handleChange}
                                    aria-describedby="age"
                                    placeholder="Age"
                                    required={true}
                                    // disabled
                                    //
                                  />
                                  {/* <div className="invalid-feedback">
                                    {errors.dob}
                                  </div> */}
                                </div>
                              </div>
                              <div className=" col-md-6 col-lg-4 col-12">
                                <div className="mb-3">
                                  <label htmlFor="gender">Gender</label>

                                  <select
                                    className={`form-select `}
                                    id="gender"
                                    value={gender}
                                    name="gender"
                                    onChange={handleChange}
                                    aria-label="Default select example"
                                    required={true}
                                  >
                                    <option selected="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    {/* <option value="3">Others</option> */}
                                  </select>

                                  {/* <div className="invalid-feedback">
                                    {errors.gender}
                                  </div> */}
                                </div>
                              </div>{" "}
                              <div className=" col-md-6 col-lg-4 col-12">
                                <div className="mb-3">
                                  <label htmlFor="maritalstatus">
                                    Marital Status
                                  </label>

                                  <select
                                    className={`form-select `}
                                    id="maritalstatus"
                                    value={maritalstatus}
                                    name="maritalstatus"
                                    onChange={handleChange}
                                    aria-label="Default select example"
                                    required={true}
                                  >
                                    <option selected="">Select</option>
                                    <option value="married">Married</option>
                                    <option value="single">Single</option>
                                    <option value="divorced">Divorced</option>
                                    <option value="widowed">Widowed</option>
                                  </select>

                                  {/* <div className="invalid-feedback">
                                    {errors.maritalstatus}
                                  </div> */}
                                </div>
                              </div>{" "}
                              <div className=" col-md-6 col-lg-4 col-12">
                                <div className="mb-3">
                                  <label htmlFor="religion">Religion</label>
                                  {/* <input
                                    type="text"
                                    className={`form-control`}
                                    id="religion"
                                    name="religion"
                                    value={religion}
                                    onChange={handleChange}
                                    aria-describedby="religion"
                                    placeholder="Religion"
                                    required={true}
                                    //
                                  /> */}
                                  <select
                                    className={`form-select`}
                                    id="religion"
                                    value={religion}
                                    name="religion"
                                    onChange={handleChange}
                                    aria-label="Default select example"
                                    required={true}
                                    // disabled={Disabled}
                                  >
                                    <option selected="">Select</option>
                                    <option value="Muslim">Muslim</option>
                                    <option value="Christian">Christian</option>
                                    <option value="Pagan">Pagan</option>
                                    <option value="Others">Others</option>
                                  </select>
                                  {/* <div className="invalid-feedback">
                                    {errors.dob}
                                  </div> */}
                                </div>
                              </div>
                              <div className=" col-md-12 col-lg-12 col-12">
                                <div className="mb-3">
                                  <label htmlFor="address">Address</label>
                                  <input
                                    type="text"
                                    className={`form-control `}
                                    id="address"
                                    name="address"
                                    value={address}
                                    onChange={handleChange}
                                    aria-describedby="address"
                                    placeholder="Address"
                                    required={true}
                                  />
                                  {/* <div className="invalid-feedback">
                                    {errors.address}
                                  </div> */}
                                </div>
                              </div>{" "}
                              <div className=" col-md-6 col-lg-4 col-12">
                                <div className="mb-3">
                                  <label htmlFor="city">City</label>
                                  <input
                                    type="text"
                                    className={`form-control `}
                                    id="city"
                                    name="city"
                                    value={city}
                                    onChange={handleChange}
                                    aria-describedby="city"
                                    placeholder="City"
                                    required={true}
                                  />
                                  {/* <div className="invalid-feedback">
                                    {errors.city}
                                  </div> */}
                                </div>
                              </div>
                              <div className=" col-md-6 col-lg-4 col-12">
                                <div className="mb-3">
                                  <label htmlFor="state">State</label>
                                  <input
                                    type="text"
                                    className={`form-control `}
                                    id="state"
                                    name="state"
                                    value={state}
                                    onChange={handleChange}
                                    aria-describedby="state"
                                    placeholder="State"
                                    required={true}
                                  />
                                  {/* <div className="invalid-feedback">
                                    {errors.state}
                                  </div> */}
                                </div>
                              </div>
                              <div className=" col-md-6 col-lg-4 col-12">
                                <div className="mb-3">
                                  <label htmlFor="country">Country</label>
                                  <input
                                    type="text"
                                    className={`form-control `}
                                    id="country"
                                    name="country"
                                    value={country}
                                    onChange={handleChange}
                                    aria-describedby="country"
                                    placeholder="Country"
                                    required={true}
                                  />
                                  {/* <div className="invalid-feedback">
                                    {errors.country}
                                  </div> */}
                                </div>
                              </div>{" "}
                              <div className=" col-md-6 col-lg-4 col-12">
                                <div className="mb-3">
                                  <label htmlFor="lga">LGA</label>
                                  <input
                                    type="text"
                                    className={`form-control `}
                                    id="lga"
                                    name="lga"
                                    value={lga}
                                    onChange={handleChange}
                                    aria-describedby="lga"
                                    placeholder="LGA"
                                    required={true}
                                  />
                                  {/* <div className="invalid-feedback">
                                    {errors.lga}
                                  </div> */}
                                </div>
                              </div>
                              <div className=" col-md-6 col-lg-4 col-12">
                                <div className="mb-3">
                                  <label htmlFor="occupation">Occupation</label>
                                  <input
                                    type="text"
                                    className={`form-control `}
                                    id="occupation"
                                    name="occupation"
                                    value={occupation}
                                    onChange={handleChange}
                                    aria-describedby="occupation"
                                    placeholder="Occupation"
                                    required={true}
                                  />
                                  {/* <div className="invalid-feedback">
                                    {errors.specialization}
                                  </div> */}
                                </div>
                              </div>
                              <div className=" col-md-6 col-lg-4 col-12">
                                <div className="mb-3">
                                  <label htmlFor="language">Language</label>
                                  <input
                                    type="text"
                                    className={`form-control`}
                                    id="language"
                                    name="language"
                                    value={language}
                                    onChange={handleChange}
                                    aria-describedby="language"
                                    placeholder="Language"
                                    required={true}
                                  />
                                  {/* <div className="invalid-feedback">
                                    {errors.language}
                                  </div> */}
                                </div>
                              </div>
                              <div className=" col-md-6 col-lg-4 col-12">
                                <div className="mb-3">
                                  <label htmlFor="tribe">Tribe</label>
                                  <input
                                    type="text"
                                    className={`form-control`}
                                    id="tribe"
                                    name="tribe"
                                    value={tribe}
                                    onChange={handleChange}
                                    aria-describedby="tribe"
                                    placeholder="Tribe"
                                    required={true}
                                  />
                                  {/* <div className="invalid-feedback">
                                    {errors.tribe}
                                  </div> */}
                                </div>
                              </div>
                              <div className=" col-md-6 col-lg-4 col-12">
                                <div className="mb-3">
                                  <label htmlFor="tpaID">TPA ID</label>
                                  <input
                                    type="text"
                                    className={`form-control`}
                                    id="tpaID"
                                    name="tpaID"
                                    value={tpaID}
                                    onChange={handleChange}
                                    aria-describedby="tpaID"
                                    placeholder="TPA ID"
                                    required={true}
                                  />
                                  {/* <div className="invalid-feedback">
                                    {errors.tribe}
                                  </div> */}
                                </div>
                              </div>
                              <div className=" col-md-6 col-lg-4 col-12">
                                <div className="mb-3">
                                  <label htmlFor="tpavalidity">
                                    TPA Validity
                                  </label>
                                  <input
                                    type="text"
                                    className={`form-control`}
                                    id="tpavalidity"
                                    name="tpavalidity"
                                    value={tpavalidity}
                                    onChange={handleChange}
                                    aria-describedby="tpavalidity"
                                    placeholder="TPA Validity"
                                    required={true}
                                  />
                                  {/* <div className="invalid-feedback">
                                    {errors.tribe}
                                  </div> */}
                                </div>
                              </div>
                              <div className=" col-md-6 col-lg-6 col-12">
                                <div className="mb-3">
                                  <label htmlFor="remarks">Remarks</label>
                                  <textarea
                                    rows={1}
                                    className={`form-control`}
                                    id="remarks"
                                    name="remarks"
                                    value={remarks}
                                    onChange={handleChange}
                                    aria-describedby="remarks"
                                    placeholder="Remarks"
                                    required={true}
                                  />
                                  {/* <div className="invalid-feedback">
                                    {errors.tribe}
                                  </div> */}
                                </div>
                              </div>
                              <div className=" col-md-6 col-lg-6 col-12">
                                <div className="mb-3">
                                  <label htmlFor="allergies">
                                    Any Known Allergies
                                  </label>
                                  <textarea
                                    rows={1}
                                    className={`form-control`}
                                    id="allergies"
                                    name="allergies"
                                    value={allergies}
                                    onChange={handleChange}
                                    aria-describedby="allergies"
                                    placeholder="Any Known Allergies"
                                    required={true}
                                  />
                                  {/* <div className="invalid-feedback">
                                    {errors.tribe}
                                  </div> */}
                                </div>
                              </div>
                              <div className=" col-md-6 col-lg-4 col-12">
                                <div className="mb-3">
                                  <label htmlFor="nationalidentification">
                                    National Identification No.
                                  </label>
                                  <input
                                    type="text"
                                    className={`form-control`}
                                    id="nationalidentification"
                                    name="nationalidentification"
                                    value={nationalidentification}
                                    onChange={handleChange}
                                    aria-describedby="nationalidentification"
                                    placeholder="National Identification No."
                                    required={true}
                                  />
                                  {/* <div className="invalid-feedback">
                                    {errors.tribe}
                                  </div> */}
                                </div>
                              </div>{" "}
                              {/* <div className=" col-md-6 col-lg-4 col-12">
                                <div className="mb-3">
                                  <label htmlFor="photo">Patient Photo</label>
                                  <input
                                    ref={fileInputRef}
                                    type="file"
                                    className={`form-control`}
                                    id="photo"
                                    name="photo"
                                    onChange={handleImageChange}
                                    aria-describedby="photo"
                                    placeholder="photo"
                                    required={true}
                                  />
                                  <div className="row mx-0">
                                    <div className="col-6">
                                      {photoimg && (
                                        <div className="mt-2 border rounded shadow p-1">
                                          <p className="m-0">Selected Photo</p>
                                          <img
                                            className="form-select-image"
                                            src={URL.createObjectURL(photoimg)}
                                            alt="Selected"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div> */}
                              <div className="col-12 text-center ">
                                <button className="btn btn-primary btn-lg">
                                  Create Patient
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
      ) : (
        ""
      )}
    </>
  );
};

export default CreatePatient;
