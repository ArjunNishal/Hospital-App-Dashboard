import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import Footer from "../../components/Footer";
import Breadcrumb from "../../components/Breadcrumb";
import { axiosInstance, renderUrl } from "../../config";
import jwtDecode from "jwt-decode";
import Swal from "sweetalert2";
import BasicinfoForm from "./BasicinfoForm";
import LoginDetailsForm from "./LoginDetailsForm";
import { closepicmodal, openprofilepicmodal } from "../../Intoggle";

const Profiledetails = () => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const id = decoded.id;
  const role = decoded.role;

  const [profile, setprofile] = useState({});
  const [image, setimage] = useState(null);

  // const [photoimg, setphotoimg] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    licenseno: "",
    middlename: "",
    firstname: "",
    lastname: "",
    email: "",
    mobileno: "",
    dob: "",
    age: "",
    gender: "",
    maritalstatus: "",
    placeofbirth: "",
    religion: "",
    address: "",
    city: "",
    state: "",
    country: "",
    lga: "",
    specialization: "",
    language: "",
    tribe: "",
    staffid: "",
    role: role,
    designation: "",
    department: "",
    specialist: "",
    mothername: "",
    bloodgroup: "",
    dateofjoining: "",
    emergencycontact: "",
    permanentaddress: "",
    qualification: "",
    workexperience: "",
    note: "",
    pan: "",
    nationalidentification: "",
    localidentification: "",
    referencecontact: "",
  });

  const [Disabled, setDisabled] = useState(true);
  const [loadingprofile, setloadingprofile] = useState(true);

  const getProfile = async () => {
    try {
      setloadingprofile(true);
      setImageUploaded(false);
      const response = await axiosInstance.get(`admin-role/getprofile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data.user, "////////////////////");

      setprofile(response.data.user);
      if (role === "doctor" || role === "consultant" || role === "admin") {
        const profiledetails = response?.data?.user?.profiledetails;

        setFormData({
          title: profiledetails?.title,
          licenseno: profiledetails?.licenseno,
          middlename: profiledetails?.middlename,
          firstname: profiledetails?.firstname,
          lastname: profiledetails?.lastname,
          email: profiledetails?.email,
          mobileno: profiledetails?.mobileno,
          dob: profiledetails?.dob,
          age: profiledetails?.age,
          gender: profiledetails?.gender,
          maritalstatus: profiledetails?.maritalstatus,
          placeofbirth: profiledetails?.placeofbirth,
          religion: profiledetails?.religion,
          address: profiledetails?.address,
          city: profiledetails?.city,
          state: profiledetails?.state,
          country: profiledetails?.country,
          lga: profiledetails?.lga,
          specialization: profiledetails?.specialization,
          language: profiledetails?.language,
          tribe: profiledetails?.tribe,
          staffid: profiledetails?.staffid,
          role: profiledetails?.role,
          designation: profiledetails?.designation,
          department: profiledetails?.department,
          specialist: profiledetails?.specialist,
          fathername: profiledetails?.fathername,
          mothername: profiledetails?.mothername,
          bloodgroup: profiledetails?.bloodgroup,
          dateofjoining: profiledetails?.dateofjoining,
          emergencycontact: profiledetails?.emergencycontact,
          permanentaddress: profiledetails?.permanentaddress,
          qualification: profiledetails?.qualification,
          workexperience: profiledetails?.workexperience,
          note: profiledetails?.note,
          nationalidentification: profiledetails?.nationalidentification,
          pan: profiledetails?.pan,
          localidentification: profiledetails?.localidentification,
          referencecontact: profiledetails?.referencecontact,
          // photo: profiledetails?.photo,
        });
      }
      setloadingprofile(false);
      setImageUploaded(true);
    } catch (error) {
      console.log(error);
      setloadingprofile(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (Disabled === false) {
      getProfile();
    }
  }, [Disabled]);

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the first file from the FileList
    if (file) {
      setimage(file);
      openprofilepicmodal(); // Update state with the selected file
    }
    // console.log(file);
  };

  const updatepic = async () => {
    try {
      // setloadingprofile(true);

      const formdata = new FormData();

      formdata.append("image", image);

      const response = await axiosInstance.post(
        `admin-role/uploadprofilepic`,
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Profile picture updated successfully",
        text: "You have successfully updated Profile picture.",
      });
      closepicmodal();
      localStorage.setItem("admin", response.data.token);
      getProfile();
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Profile picture update Failed",
        text: error.response.data.message,
      });
    }
  };

  return (
    <>
      <Sidebar />
      <Topbar imageUploaded={imageUploaded} />
      <div className="page-wrapper">
        <div className="page-content-tab">
          <div className="container-fluid">
            <Breadcrumb
              backpage={"Dashboard"}
              currentpage={"Profile"}
              backurl={""}
              maintab={""}
              heading={"Profile"}
            />
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="met-profile">
                      <div className="row mx-0 justify-content-start">
                        <div className="col-lg-4 align-self-center mb-3 mb-lg-0">
                          <div className="met-profile-main">
                            <div className="met-profile-main-pic">
                              <img
                                src={`${renderUrl}uploads/profile/${profile?.image}`}
                                onError={(e) => {
                                  e.target.src =
                                    "assets/images/users/user-vector.png"; // Set a default image if the specified image fails to load
                                }}
                                width={110}
                                style={{ objectFit: "contain" }}
                                alt
                                height={110}
                                className="rounded-circle"
                              />
                              <label
                                htmlFor="profilepic"
                                className="met-profile_main-pic-change"
                              >
                                <i className="fas fa-camera" />
                              </label>
                              <input
                                type="file"
                                hidden
                                name="profilepic"
                                onChange={handleImageChange}
                                id="profilepic"
                              />
                              <button
                                data-bs-toggle="modal"
                                id="openprofilepicmodal"
                                data-bs-target="#ppmodal"
                                className="btn-primary btn d-none mb-md-0 mb-3"
                                // onClick={open}
                              >
                                <i className="fa-solid fa-plus"></i> Add
                                Consultant
                              </button>
                              <div
                                className="modal fade bd-example-modal-lg"
                                id="ppmodal"
                                tabIndex={-1}
                                role="dialog"
                                aria-labelledby="myLargeModalLabel"
                                aria-hidden="true"
                              >
                                <div className="modal-dialog" role="document">
                                  <div className="modal-content">
                                    <div className="modal-header ">
                                      <h6
                                        className="modal-title m-0"
                                        id="myLargeModalLabel"
                                      >
                                        Update Profile Picture
                                      </h6>
                                      <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        id="closepicmodal"
                                        aria-label="Close"
                                      />
                                    </div>
                                    {/*end modal-header*/}
                                    <div className="modal-body">
                                      <div>
                                        {image && (
                                          <div className=" col-12">
                                            <div className="selected_image">
                                              <img
                                                src={URL.createObjectURL(image)}
                                                alt="Selected"
                                              />
                                              <p className="text-center">
                                                <b>Selected file:</b>{" "}
                                                {image.name}
                                              </p>
                                            </div>
                                            <div className="text-center my-2">
                                              <button
                                                type="button"
                                                onClick={updatepic}
                                                className="btn btn-primary"
                                              >
                                                Upload Image
                                              </button>
                                            </div>
                                          </div>
                                        )}
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
                            </div>
                            <div className="met-profile_user-detail">
                              <h5 className="met-user-name">
                                {profile.firstName} {profile.lastName}
                              </h5>
                              <p className="mb-0 met-user-name-post">
                                {profile.role === "superadmin"
                                  ? "Super admin"
                                  : profile.role === "admin"
                                  ? "Admin"
                                  : profile.role === "consultant"
                                  ? "Consultant"
                                  : profile.role === "doctor"
                                  ? "Doctor"
                                  : ""}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/*end col*/}
                        {/* <div className="col-lg-4 ms-auto align-self-center">
                          <ul className="list-unstyled personal-detail mb-0">
                            <li className>
                              <i className="las la-phone mr-2 text-secondary font-22 align-middle" />{" "}
                              <b> Name </b> : {profile.firstName}{" "}
                              {profile.lastName}
                            </li>
                            <li className="mt-2">
                              <i className="las la-envelope text-secondary font-22 align-middle mr-2" />{" "}
                              <b> Username </b> : {profile.username}
                            </li>
                          </ul>
                        </div> */}
                        <div className="col-lg-4 align-self-center">
                          <ul className="list-unstyled personal-detail mb-0">
                            <li className>
                              <i className="las la-phone mr-2 text-secondary font-22 align-middle" />{" "}
                              <b> phone </b> : {profile.mobileno}
                            </li>
                            <li className="mt-2">
                              <i className="las la-envelope text-secondary font-22 align-middle mr-2" />{" "}
                              <b> Email </b> : {profile.email}
                            </li>
                          </ul>
                        </div>
                        {/*end col*/}

                        {/*end col*/}
                      </div>
                      {/*end row*/}
                    </div>
                    {/*end f_profile*/}
                  </div>
                  {/*end card-body*/}
                  <div className="card-body p-0">
                    {/* Nav tabs */}
                    <ul className="nav nav-tabs" role="tablist">
                      {(role === "consultant" ||
                        role === "doctor" ||
                        role === "admin") && (
                        <li className="nav-item">
                          <a
                            className="nav-link active"
                            data-bs-toggle="tab"
                            href="#Post"
                            role="tab"
                            aria-selected="true"
                          >
                            Basic Info
                          </a>
                        </li>
                      )}
                      {/* <li className="nav-item">
                        <a
                          className={`nav-link ${
                            role === "consultant" ||
                            role === "doctor" ||
                            role === "admin"
                              ? ""
                              : "active"
                          }`}
                          data-bs-toggle="tab"
                          href="#Gallery"
                          role="tab"
                          aria-selected="false"
                        >
                          Gallery
                        </a>
                      </li> */}
                      <li className="nav-item">
                        <a
                          className={`nav-link ${
                            role === "superadmin" ? "active" : ""
                          }`}
                          data-bs-toggle="tab"
                          href="#Settings"
                          role="tab"
                          aria-selected="false"
                        >
                          Settings
                        </a>
                      </li>
                    </ul>
                    {/* Tab panes */}
                    <div className="tab-content">
                      {(role === "consultant" ||
                        role === "doctor" ||
                        role === "admin") && (
                        <div
                          className="tab-pane p-3 active"
                          id="Post"
                          role="tabpanel"
                        >
                          <div className="card">
                            <div className="card-header">
                              <div className="d-flex align-items-center justify-content-between  flex-wrap ">
                                <h4 className="card-title m-0">Basic Info</h4>
                                <div>
                                  <button
                                    onClick={() => {
                                      setDisabled(!Disabled);
                                    }}
                                    className="btn btn-sm btn-primary"
                                  >
                                    {Disabled ? (
                                      <i className="fa-solid fa-pen-to-square"></i>
                                    ) : (
                                      <i className="fa-regular fa-circle-xmark"></i>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="card-body">
                              <div className="basic_info_form">
                                <BasicinfoForm
                                  Disabled={Disabled}
                                  setDisabled={setDisabled}
                                  formData={formData}
                                  setFormData={setFormData}
                                  getProfile={getProfile}
                                  // photoimg={photoimg}
                                  // setphotoimg={setphotoimg}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* <div
                        className="tab-pane p-3"
                        id="Gallery"
                        role="tabpanel"
                      >
                        Gallery
                      </div> */}
                      <div
                        // className="tab-pane p-3"
                        className={`tab-pane p-3 ${
                          role === "superadmin" ? "active" : ""
                        }`}
                        id="Settings"
                        role="tabpanel"
                      >
                        <LoginDetailsForm
                          profile={profile}
                          getProfile={getProfile}
                        />
                        {/*end row*/}
                      </div>
                    </div>
                  </div>{" "}
                  {/*end card-body*/}
                </div>
                {/*end card*/}
              </div>
              {/*end col*/}
            </div>
            {/*end row*/}
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
};

export default Profiledetails;
