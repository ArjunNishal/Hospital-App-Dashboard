import jwtDecode from "jwt-decode";
import React, { useState } from "react";
import { axiosInstance, renderUrl } from "../../config";
import Swal from "sweetalert2";

const BasicinfoForm = ({
  Disabled,
  formData,
  setFormData,
  getProfile,
  // photoimg,
  // setphotoimg,
  setDisabled,
}) => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const id = decoded.id;

  const {
    title,
    licenseno,
    middlename,
    firstname,
    lastname,
    email,
    mobileno,
    dob,
    age,
    gender,
    maritalstatus,
    placeofbirth,
    religion,
    address,
    city,
    state,
    country,
    lga,
    specialization,
    language,
    tribe,
    staffid,
    role,
    designation,
    department,
    specialist,
    fathername,
    mothername,
    bloodgroup,
    dateofjoining,
    emergencycontact,
    permanentaddress,
    qualification,
    workexperience,
    note,
    nationalidentification,
    pan,
    localidentification,
    referencecontact,
    // photo,
  } = formData;

  const [errors, seterrors] = useState({});
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isvalidmobile, setisvalidmobile] = useState(true);

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
    } else if (
      name === "mobileno" ||
      name === "emergencycontact" ||
      name === "referencecontact"
    ) {
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
    } else if (name === "age") {
      let inputAge = value.replace(/\D/g, ""); // Remove non-digit characters
      if (inputAge.length > 3) {
        inputAge = inputAge.slice(0, 3); // Limit to maximum 3 digits
      }
      setFormData({
        ...formData,
        [name]: inputAge,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  console.log(formData, "formdata");

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const validationRules = {
        title: "Please enter Title",
        licenseno: "Please enter license no.",
        middlename: "Please enter middle name",
        firstname: "Please enter first name",
        lastname: "Please enter last name",
        email: "Please enter email",
        mobileno: "Please enter phone",
        dob: "Please enter DOB",
        age: "Please enter Age",
        gender: "Please enter Gender",
        maritalstatus: "Please enter Marital status",
        placeofbirth: "Please enter Place of Birth",
        religion: "Please enter Religion",
        address: "Please enter Address",
        city: "Please enter City",
        state: "Please enter State",
        country: "Please enter Country",
        lga: "Please enter LGA",
        specialization: "Please enter Specialization",
        language: "Please enter Language",
        tribe: "Please enter Tribe",
        staffid: "Please enter Staff ID",
        department: "Please enter Department",
        specialist: "Please enter Specialist",
        fathername: "Please enter Father name",
        mothername: "Please enter mother name",
        bloodgroup: "Please enter blood group",
        dateofjoining: "Please enter date of joining",
        emergencycontact: "Please enter emergency contact",
        permanentaddress: "Please enter permanent address",
        qualification: "Please enter qualification",
        workexperience: "Please enter work experience",
        note: "Please enter note",
        pan: "Please enter pan",
        nationalidentification: "Please enter national identification number",
        localidentification: "Please enter local identification number",
        referencecontact: "Please enter reference contact",
        // photo: "Please enter photo",
      };

      // Check each field against its validation rule
      let validationErrors = {};

      // Check each field against its validation rule
      Object.keys(validationRules).forEach((field) => {
        console.log(formData[field]);
        if (!formData[field] && field !== "middlename") {
          // Add error message to the validationErrors object
          validationErrors[field] = validationRules[field];
        }
      });

      // Update the state with the accumulated errors
      seterrors(validationErrors);
      // If there are validation errors, stop form submission
      if (Object.keys(validationErrors).length > 0) {
        return;
      }
      // alert("submitted");

      // const formdataprofile = new FormData();

      // formdataprofile.append("title", title);
      // formdataprofile.append("licenseno", licenseno);
      // formdataprofile.append("middlename", middlename);
      // formdataprofile.append("firstname", firstname);
      // formdataprofile.append("lastname", lastname);
      // formdataprofile.append("email", email);
      // formdataprofile.append("mobileno", mobileno);
      // formdataprofile.append("dob", dob);
      // formdataprofile.append("age", age);
      // formdataprofile.append("gender", gender);
      // formdataprofile.append("maritalstatus", maritalstatus);
      // formdataprofile.append("placeofbirth", placeofbirth);
      // formdataprofile.append("religion", religion);
      // formdataprofile.append("address", address);
      // formdataprofile.append("city", city);
      // formdataprofile.append("state", state);
      // formdataprofile.append("country", country);
      // formdataprofile.append("lga", lga);
      // formdataprofile.append("specialization", specialization);
      // formdataprofile.append("language", language);
      // formdataprofile.append("tribe", tribe);
      // formdataprofile.append("staffid", staffid);
      // formdataprofile.append("role", role);
      // formdataprofile.append("designation", designation);
      // formdataprofile.append("department", department);
      // formdataprofile.append("specialist", specialist);
      // formdataprofile.append("fathername", fathername);
      // formdataprofile.append("mothername", mothername);
      // formdataprofile.append("bloodgroup", bloodgroup);
      // formdataprofile.append("dateofjoining", dateofjoining);
      // formdataprofile.append("emergencycontact", emergencycontact);
      // formdataprofile.append("permanentaddress", permanentaddress);
      // formdataprofile.append("qualification", qualification);
      // formdataprofile.append("workexperience", workexperience);
      // formdataprofile.append("note", note);
      // formdataprofile.append("nationalidentification", nationalidentification);
      // formdataprofile.append("pan", pan);
      // formdataprofile.append("localidentification", localidentification);
      // formdataprofile.append("referencecontact", referencecontact);
      // formdataprofile.append("photo", photoimg);

      const formdataprofile = {
        title,
        licenseno,
        middlename,
        firstname,
        lastname,
        email,
        mobileno,
        dob,
        age,
        gender,
        maritalstatus,
        placeofbirth,
        religion,
        address,
        city,
        state,
        country,
        lga,
        specialization,
        language,
        tribe,
        staffid,
        role,
        designation,
        department,
        specialist,
        fathername,
        mothername,
        bloodgroup,
        dateofjoining,
        emergencycontact,
        permanentaddress,
        qualification,
        workexperience,
        note,
        nationalidentification,
        pan,
        localidentification,
        referencecontact,
        // photo,
      };

      console.log(formData);

      const response = await axiosInstance.post(
        "admin-role/updateroleprofile",
        formdataprofile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      const newdetails = response.data.savedUser.profiledetails;

      setFormData({
        title: newdetails.title,
        licenseno: newdetails.licenseno,
        middlename: newdetails.middlename,
        firstname: newdetails.firstname,
        lastname: newdetails.lastname,
        email: newdetails.email,
        mobileno: newdetails.mobileno,
        dob: newdetails.dob,
        age: newdetails.age,
        gender: newdetails.gender,
        maritalstatus: newdetails.maritalstatus,
        placeofbirth: newdetails.placeofbirth,
        religion: newdetails.religion,
        address: newdetails.address,
        city: newdetails.city,
        state: newdetails.state,
        country: newdetails.country,
        lga: newdetails.lga,
        specialization: newdetails.specialization,
        language: newdetails.language,
        tribe: newdetails.tribe,
        staffid: newdetails.staffid,
        role: newdetails.role,
        designation: newdetails.designation,
        department: newdetails.department,
        specialist: newdetails.specialist,
        fathername: newdetails.fathername,
        mothername: newdetails.mothername,
        bloodgroup: newdetails.bloodgroup,
        dateofjoining: newdetails.dateofjoining,
        emergencycontact: newdetails.emergencycontact,
        permanentaddress: newdetails.permanentaddress,
        qualification: newdetails.qualification,
        workexperience: newdetails.workexperience,
        note: newdetails.note,
        nationalidentification: newdetails.nationalidentification,
        pan: newdetails.pan,
        localidentification: newdetails.localidentification,
        referencecontact: newdetails.referencecontact,
        // photo: newdetails.photo,
      });

      getProfile();

      setDisabled(true);

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "You have Updated Profile.",
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response.data.Error,
      });
    }
  };
  return (
    <form onSubmit={handlesubmit}>
      <div className="row mx-0">
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="title">Staff ID</label>
            <input
              type="text"
              className={`form-control ${errors.staffid ? "is-invalid " : ""}`}
              id="staffid"
              name="staffid"
              value={staffid}
              onChange={handleChange}
              aria-describedby="staffid"
              placeholder="Staff ID"
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.staffid}</div>{" "}
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="title">Role</label>
            {/* <input
              type="text"
              className={`form-control ${errors.role ? "is-invalid " : ""}`}
              id="role"
              name="role"
              value={role}
              onChange={handleChange}
              aria-describedby="role"
              placeholder="Role"
              required={true}
              disabled={Disabled}
            /> */}
            <select
              className={`form-select ${errors.role ? "is-invalid " : ""}`}
              id="role"
              value={role}
              name="role"
              onChange={handleChange}
              aria-label="Default select example"
              required={true}
              disabled={Disabled}
            >
              <option selected="">Select Role</option>
              <option value="Doctor">Doctor</option>
              <option value="Admin">Admin</option>
              <option value="Nurse">Nurse</option>
            </select>
            {/* Doctor | Admin | Nurse  */}
            <div className="invalid-feedback">{errors.role}</div>{" "}
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              className={`form-control ${errors.title ? "is-invalid " : ""}`}
              id="title"
              name="title"
              value={title}
              onChange={handleChange}
              aria-describedby="title"
              placeholder="Title"
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.title}</div>{" "}
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="licenseno">License NO.</label>
            <input
              type="text"
              className={`form-control ${
                errors.licenseno ? "is-invalid " : ""
              }`}
              id="licenseno"
              name="licenseno"
              value={licenseno}
              onChange={handleChange}
              aria-describedby="licenseno"
              placeholder="License NO."
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.licenseno}</div>
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="firstname">First Name</label>
            <input
              type="text"
              className={`form-control ${
                errors.firstname ? "is-invalid " : ""
              }`}
              id="firstname"
              name="firstname"
              value={firstname}
              onChange={handleChange}
              aria-describedby="firstname"
              placeholder="First Name"
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.firstname}</div>
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="middlename">Middle Name</label>
            <input
              type="text"
              className={`form-control ${
                errors.middlename ? "is-invalid " : ""
              }`}
              id="middlename"
              name="middlename"
              value={middlename}
              onChange={handleChange}
              aria-describedby="middlename"
              placeholder="Middle Name"
              // required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.middlename}</div>
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="lastname">Last Name</label>
            <input
              type="text"
              className={`form-control ${errors.lastname ? "is-invalid " : ""}`}
              id="lastname"
              name="lastname"
              value={lastname}
              onChange={handleChange}
              aria-describedby="lastname"
              placeholder="Last Name"
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.lastname}</div>
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="dob">DOB</label>
            <input
              type="date"
              className={`form-control ${errors.dob ? "is-invalid " : ""}`}
              id="dob"
              name="dob"
              value={dob}
              onChange={handleChange}
              aria-describedby="dob"
              placeholder="DOB"
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.dob}</div>
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="age">Age</label>
            <input
              type="text"
              className={`form-control ${errors.age ? "is-invalid " : ""}`}
              id="age"
              name="age"
              value={age}
              onChange={handleChange}
              aria-describedby="age"
              placeholder="Age"
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.age}</div>
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="gender">Gender</label>

            <select
              className={`form-select ${errors.gender ? "is-invalid " : ""}`}
              id="gender"
              value={gender}
              name="gender"
              onChange={handleChange}
              aria-label="Default select example"
              required={true}
              disabled={Disabled}
            >
              <option selected="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>

            <div className="invalid-feedback">{errors.gender}</div>
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="maritalstatus">Marital Status</label>

            <select
              className={`form-select ${
                errors.maritalstatus ? "is-invalid " : ""
              }`}
              id="maritalstatus"
              value={maritalstatus}
              name="maritalstatus"
              onChange={handleChange}
              aria-label="Default select example"
              required={true}
              disabled={Disabled}
            >
              <option selected="">Select Marital status</option>
              <option value="married">Married</option>
              <option value="single">Single</option>
              <option value="divorced">Divorced</option>
              {/* <option value="3">Others</option> */}
            </select>

            <div className="invalid-feedback">{errors.maritalstatus}</div>
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="placeofbirth">Place of Birth</label>
            <input
              type="text"
              className={`form-control ${
                errors.placeofbirth ? "is-invalid " : ""
              }`}
              id="placeofbirth"
              name="placeofbirth"
              value={placeofbirth}
              onChange={handleChange}
              aria-describedby="placeofbirth"
              placeholder="Place of Birth"
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.placeofbirth}</div>
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="religion">Religion</label>
            {/* <input
              type="text"
              className={`form-control ${errors.religion ? "is-invalid " : ""}`}
              id="religion"
              name="religion"
              value={religion}
              onChange={handleChange}
              aria-describedby="religion"
              placeholder="Religion"
              required={true}
              disabled={Disabled}
            /> */}
            <select
              className={`form-select ${errors.religion ? "is-invalid " : ""}`}
              id="religion"
              value={religion}
              name="religion"
              onChange={handleChange}
              aria-label="Default select example"
              required={true}
              disabled={Disabled}
            >
              <option selected="">Select Religion</option>
              <option value="Muslim">Muslim</option>
              <option value="Christian">Christian</option>
              <option value="Pagan">Pagan</option>
              <option value="Others">Others</option>
            </select>
            <div className="invalid-feedback">{errors.religion}</div>
          </div>
        </div>{" "}
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="mobileno">Phone</label>
            <input
              type="text"
              className={`form-control ${errors.mobileno ? "is-invalid " : ""}`}
              id="mobileno"
              name="mobileno"
              value={mobileno}
              onChange={handleChange}
              aria-describedby="mobileno"
              placeholder="Phone"
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.mobileno}</div>
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="title">Emergency Contact No.</label>
            <input
              type="text"
              className={`form-control ${
                errors.emergencycontact ? "is-invalid " : ""
              }`}
              id="emergencycontact"
              name="emergencycontact"
              value={emergencycontact}
              onChange={handleChange}
              aria-describedby="emergencycontact"
              placeholder="Emergency Contact No."
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.emergencycontact}</div>{" "}
          </div>
        </div>
        <div className=" col-md-12 col-lg-12 col-12">
          <div className="mb-3">
            <label htmlFor="address">Current Address</label>
            <input
              type="text"
              className={`form-control ${errors.address ? "is-invalid " : ""}`}
              id="address"
              name="address"
              value={address}
              onChange={handleChange}
              aria-describedby="address"
              placeholder="Address"
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.address}</div>
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="city">City</label>
            <input
              type="text"
              className={`form-control ${errors.city ? "is-invalid " : ""}`}
              id="city"
              name="city"
              value={city}
              onChange={handleChange}
              aria-describedby="city"
              placeholder="City"
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.city}</div>
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="state">State</label>
            <input
              type="text"
              className={`form-control ${errors.state ? "is-invalid " : ""}`}
              id="state"
              name="state"
              value={state}
              onChange={handleChange}
              aria-describedby="state"
              placeholder="State"
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.state}</div>
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              className={`form-control ${errors.country ? "is-invalid " : ""}`}
              id="country"
              name="country"
              value={country}
              onChange={handleChange}
              aria-describedby="country"
              placeholder="Country"
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.country}</div>
          </div>
        </div>{" "}
        <div className=" col-md-12 col-lg-12 col-12">
          <div className="mb-3">
            <label htmlFor="address">Permanent Address</label>
            <input
              type="text"
              className={`form-control ${
                errors.permanentaddress ? "is-invalid " : ""
              }`}
              id="permanentaddress"
              name="permanentaddress"
              value={permanentaddress}
              onChange={handleChange}
              aria-describedby="permanentaddress"
              placeholder="Permanent Address"
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.permanentaddress}</div>
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="lga">LGA</label>
            <input
              type="text"
              className={`form-control ${errors.lga ? "is-invalid " : ""}`}
              id="lga"
              name="lga"
              value={lga}
              onChange={handleChange}
              aria-describedby="lga"
              placeholder="LGA"
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.lga}</div>
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className={`form-control ${
                errors.email || !isValidEmail ? "is-invalid " : ""
              }`}
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              aria-describedby="email"
              placeholder="Email"
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">
              {errors.email ? errors.email : "Enter Valid Email address"}
            </div>
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="title">Designation</label>
            {/* <input
              type="text"
              className={`form-control ${
                errors.designation ? "is-invalid " : ""
              }`}
              id="designation"
              name="designation"
              value={designation}
              onChange={handleChange}
              aria-describedby="designation"
              placeholder="Designation"
              required={true}
              disabled={Disabled}
            /> */}
            <select
              className={`form-select ${
                errors.designation ? "is-invalid " : ""
              }`}
              id="designation"
              value={designation}
              name="designation"
              onChange={handleChange}
              aria-label="Default select example"
              required={true}
              disabled={Disabled}
            >
              <option selected="">Select Role</option>
              <option value="Doctor">Doctor</option>
              <option value="Nurse">Nurse</option>
              <option value="Other Staff">Other Staff</option>
            </select>
            <div className="invalid-feedback">{errors.designation}</div>{" "}
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="title">Department</label>
            {/* <input
              type="text"
              className={`form-control ${
                errors.department ? "is-invalid " : ""
              }`}
              id="department"
              name="department"
              value={department}
              onChange={handleChange}
              aria-describedby="department"
              placeholder="Department"
              required={true}
              disabled={Disabled}
            /> */}
            <select
              className={`form-select ${
                errors.department ? "is-invalid " : ""
              }`}
              id="department"
              value={department}
              name="department"
              onChange={handleChange}
              aria-label="Default select example"
              required={true}
              disabled={Disabled}
            >
              <option selected="">Select Department</option>
              <option value="Nursing">Nursing</option>
              <option value="Clinic">Clinic</option>
              <option value="Theatre">Theatre</option>
              <option value="Emergency">Emergency</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="Nutrition and Dietetics">
                Nutrition and Dietetics
              </option>
              <option value=" Laboratory"> Laboratory</option>
            </select>
            {/* Nursing | Clinic | Theatre | Emergency | Pharmacy | Nutrition and Dietetics | Laboratory */}
            <div className="invalid-feedback">{errors.department}</div>{" "}
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="title">Specialist</label>
            {/* <input
              type="text"
              className={`form-control ${
                errors.specialist ? "is-invalid " : ""
              }`}
              id="specialist"
              name="specialist"
              value={specialist}
              onChange={handleChange}
              aria-describedby="specialist"
              placeholder="Specialist"
              required={true}
              disabled={Disabled}
            /> */}
            <select
              className={`form-select ${
                errors.specialist ? "is-invalid " : ""
              }`}
              id="specialist"
              value={specialist}
              name="specialist"
              onChange={handleChange}
              aria-label="Default select example"
              required={true}
              disabled={Disabled}
            >
              <option selected="">Select Specialist</option>
              <option value="MidWife">MidWife</option>
              <option value="Obstetrician">Obstetrician</option>
              <option value="Anaesthetist">Anaesthetist</option>
              <option value="Gynaecologist">Gynaecologist</option>
              <option value="Paediatrician">Paediatrician</option>
              <option value="Neonatal Nurse">Neonatal Nurse</option>
              <option value="Sonographer">Sonographer</option>
              <option value="Obsteric Physiotherapist">
                Obsteric Physiotherapist
              </option>
              <option value="Health Visitor">Health Visitor</option>
              <option value="Dietician">Dietician</option>
            </select>
            {/* MidWife | Obstetrician | Anaesthetist |Gynaecologist |Paediatrician 
            | Neonatal Nurse | Sonographer | Obsteric Physiotherapist | Health Visitor | Dietician  */}
            <div className="invalid-feedback">{errors.specialist}</div>{" "}
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="title">Father's Name</label>
            <input
              type="text"
              className={`form-control ${
                errors.fathername ? "is-invalid " : ""
              }`}
              id="fathername"
              name="fathername"
              value={fathername}
              onChange={handleChange}
              aria-describedby="fathername"
              placeholder="Father's Name"
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.fathername}</div>{" "}
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="title">Mother's Name</label>
            <input
              type="text"
              className={`form-control ${
                errors.mothername ? "is-invalid " : ""
              }`}
              id="mothername"
              name="mothername"
              value={mothername}
              onChange={handleChange}
              aria-describedby="mothername"
              placeholder="Mother's Name"
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.mothername}</div>{" "}
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="title">Blood Group</label>
            <input
              type="text"
              className={`form-control ${
                errors.bloodgroup ? "is-invalid " : ""
              }`}
              id="bloodgroup"
              name="bloodgroup"
              value={bloodgroup}
              onChange={handleChange}
              aria-describedby="bloodgroup"
              placeholder="Blood Group"
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.bloodgroup}</div>{" "}
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="title">Date of Joining</label>
            <input
              type="date"
              className={`form-control ${
                errors.dateofjoining ? "is-invalid " : ""
              }`}
              id="dateofjoining"
              name="dateofjoining"
              value={dateofjoining}
              onChange={handleChange}
              aria-describedby="dateofjoining"
              placeholder="Date of Joining"
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.dateofjoining}</div>{" "}
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="title">Qualification</label>
            <input
              type="text"
              className={`form-control ${
                errors.qualification ? "is-invalid " : ""
              }`}
              id="qualification"
              name="qualification"
              value={qualification}
              onChange={handleChange}
              aria-describedby="qualification"
              placeholder="Qualification"
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.qualification}</div>{" "}
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="title">Work Experience</label>
            <input
              type="text"
              className={`form-control ${
                errors.workexperience ? "is-invalid " : ""
              }`}
              id="workexperience"
              name="workexperience"
              value={workexperience}
              onChange={handleChange}
              aria-describedby="workexperience"
              placeholder="Work Experience"
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.workexperience}</div>{" "}
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="title">National Identification No.</label>
            <input
              type="number"
              className={`form-control ${
                errors.nationalidentification ? "is-invalid " : ""
              }`}
              id="nationalidentification"
              name="nationalidentification"
              value={nationalidentification}
              onChange={handleChange}
              aria-describedby="nationalidentification"
              placeholder="National Identification No."
              required={true}
              disabled={Disabled}
              onFocus={(e) =>
                e.target.addEventListener(
                  "wheel",
                  function (e) {
                    e.preventDefault();
                  },
                  { passive: false }
                )
              }
            />
            <div className="invalid-feedback">
              {errors.nationalidentification}
            </div>{" "}
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="title">Local Identification No.</label>
            <input
              type="number"
              className={`form-control ${
                errors.localidentification ? "is-invalid " : ""
              }`}
              id="localidentification"
              name="localidentification"
              value={localidentification}
              onChange={handleChange}
              onFocus={(e) =>
                e.target.addEventListener(
                  "wheel",
                  function (e) {
                    e.preventDefault();
                  },
                  { passive: false }
                )
              }
              aria-describedby="localidentification"
              placeholder="Local Identification No."
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.localidentification}</div>{" "}
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="title">Reference Contact</label>
            <input
              type="number"
              className={`form-control ${
                errors.referencecontact ? "is-invalid " : ""
              }`}
              id="referencecontact"
              name="referencecontact"
              value={referencecontact}
              onChange={handleChange}
              onFocus={(e) =>
                e.target.addEventListener(
                  "wheel",
                  function (e) {
                    e.preventDefault();
                  },
                  { passive: false }
                )
              }
              aria-describedby="referencecontact"
              placeholder="Reference Contact"
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.referencecontact}</div>{" "}
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="title">PAN Number</label>
            <input
              type="text"
              className={`form-control ${errors.pan ? "is-invalid " : ""}`}
              id="pan"
              name="pan"
              value={pan}
              onChange={handleChange}
              aria-describedby="pan"
              placeholder="PAN Number"
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.pan}</div>{" "}
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="specialization">Specialization</label>
            <input
              type="text"
              className={`form-control ${
                errors.specialization ? "is-invalid " : ""
              }`}
              id="specialization"
              name="specialization"
              value={specialization}
              onChange={handleChange}
              aria-describedby="specialization"
              placeholder="Specialization"
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.specialization}</div>
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="language">Language</label>
            <input
              type="text"
              className={`form-control ${errors.language ? "is-invalid " : ""}`}
              id="language"
              name="language"
              value={language}
              onChange={handleChange}
              aria-describedby="language"
              placeholder="Language"
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.language}</div>
          </div>
        </div>
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="tribe">Tribe</label>
            <input
              type="text"
              className={`form-control ${errors.tribe ? "is-invalid " : ""}`}
              id="tribe"
              name="tribe"
              value={tribe}
              onChange={handleChange}
              aria-describedby="tribe"
              placeholder="Tribe"
              required={true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.tribe}</div>
          </div>
        </div>
        {/* <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="photo">Photo</label>
            <input
              type="file"
              className={`form-control ${errors.photo ? "is-invalid " : ""}`}
              id="photo"
              name="photo"
              onChange={handleImageChange}
              aria-describedby="photo"
              placeholder="photo"
              required={photo ? false : true}
              disabled={Disabled}
            />
            <div className="invalid-feedback">{errors.photo}</div>
            <div className="row mx-0">
              <div className="col-6">
                {photoimg && !Disabled && (
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
              <div className="col-6">
                {photo && (
                  <div className="mt-2 border rounded shadow p-1">
                    <p className="m-0">Current Photo</p>
                    <img
                      className="form-select-image"
                      src={`${renderUrl}uploads/profileform/${photo}`}
                      alt="Selected"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div> */}
        <div className=" col-md-6 col-lg-4 col-12">
          <div className="mb-3">
            <label htmlFor="title">Note</label>
            <textarea
              className={`form-control ${errors.note ? "is-invalid " : ""}`}
              id="note"
              name="note"
              value={note}
              onChange={handleChange}
              aria-describedby="note"
              placeholder="Note"
              required={true}
              disabled={Disabled}
              rows={1}
            />
            <div className="invalid-feedback">{errors.note}</div>{" "}
          </div>
        </div>
        {!Disabled && (
          <div className="col-12 text-center my-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={Disabled}
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default BasicinfoForm;
