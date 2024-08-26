import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import Topbar from "../../../components/Topbar";
import Footer from "../../../components/Footer";
import Breadcrumb from "../../../components/Breadcrumb";
import jwtDecode from "jwt-decode";
import Swal from "sweetalert2";
import {
  axiosInstance,
  permissionslistconsultant,
  renderUrl,
} from "../../../config";
import { useNavigate } from "react-router-dom";
import {
  closemodalEditConsultant,
  closemodalEditPatient,
} from "../../../Intoggle";

const ViewPatient = ({ getalladmins, selectedadmin }) => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const id = decoded.id;
  const fileInputRef = React.useRef(null);

  const navigate = useNavigate("");
  const [patientdetails, setpatientdetails] = useState({
    username: "",
    email: "",
    mobileno: "",
    password: "",
    role: "",
    firstname: "",
    lastname: "",
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
    gaurdianname: "",
    bloodgroup: "",
    remarks: "",
    allergies: "",
    tpaID: "",
    tpavalidity: "",
    nationalidentification: "",
    alternatenumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    setpatientdetails({
      username: selectedadmin.username,
      email: selectedadmin.email,
      mobileno: selectedadmin.mobileno,
      password: selectedadmin.password,
      role: selectedadmin.role,
      firstname: selectedadmin.firstname,
      lastname: selectedadmin.lastname,
      dob: selectedadmin.dob,
      middlename: selectedadmin.middlename,
      age: selectedadmin.age,
      gender: selectedadmin.gender,
      maritalstatus: selectedadmin.maritalstatus,
      religion: selectedadmin.religion,
      address: selectedadmin.address,
      city: selectedadmin.city,
      state: selectedadmin.state,
      country: selectedadmin.country,
      lga: selectedadmin.lga,
      occupation: selectedadmin.occupation,
      language: selectedadmin.language,
      tribe: selectedadmin.tribe,
      gaurdianname: selectedadmin.gaurdianname,
      bloodgroup: selectedadmin.bloodgroup,
      remarks: selectedadmin.remarks,
      allergies: selectedadmin.allergies,
      tpaID: selectedadmin.tpaID,
      tpavalidity: selectedadmin.tpavalidity,
      nationalidentification: selectedadmin.nationalidentification,
      alternatenumber: selectedadmin.alternatenumber,
    });
  }, [selectedadmin]);

  console.log(selectedadmin, "selectedadmin");
  return (
    <>
      <div
        className="modal fade bd-example-modal-lg"
        id="viewpatient"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="myLargeModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl" role="document">
          <div className="modal-content">
            <div className="modal-header ">
              <h6 className="modal-title m-0" id="myLargeModalLabel">
                Patient Details
              </h6>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="editpatientmodalbtnclose"
                aria-label="Close"
              />
            </div>
            {/*end modal-header*/}
            <div className="modal-body">
              <div>
                <div className="card mb-0">
                  <div className="card-body ">
                    <div className="create-admin-form">
                      <div className="row mx-0">
                        <div className="col-md-6 col-12">
                          <div className="d-flex">
                            <div className="details_heading">
                              <p>
                                <b>Username&nbsp;</b>
                              </p>
                              <p>
                                <b>Email&nbsp;</b>
                              </p>
                              <p>
                                <b>Mobile No.&nbsp;</b>
                              </p>
                              <p>
                                <b>Password&nbsp;</b>
                              </p>
                              <p>
                                <b>Role&nbsp;</b>
                              </p>
                              <p>
                                <b>First Name&nbsp;</b>
                              </p>
                              <p>
                                <b>Last Name&nbsp;</b>
                              </p>
                              <p>
                                <b>DOB&nbsp;</b>
                              </p>
                              <p>
                                <b>Middlename&nbsp;</b>
                              </p>
                              <p>
                                <b>Age&nbsp;</b>
                              </p>
                              <p>
                                <b>Allergies&nbsp;</b>
                              </p>
                              <p>
                                <b>Tpa ID&nbsp;</b>
                              </p>
                              <p>
                                <b>TPA Validity&nbsp;</b>
                              </p>
                              <p>
                                <b>National Identification&nbsp;</b>
                              </p>
                              <p>
                                <b>Alternate Number&nbsp;</b>
                              </p>
                            </div>
                            <div className="details-detail">
                              <p>
                                - &nbsp; {patientdetails?.username || "N/A"}
                              </p>
                              <p>- &nbsp; {patientdetails?.email || "N/A"}</p>
                              <p>
                                - &nbsp; {patientdetails?.mobileno || "N/A"}
                              </p>
                              <p>
                                - &nbsp; {patientdetails?.password || "N/A"}
                              </p>
                              <p>- &nbsp; {patientdetails?.role || "N/A"}</p>
                              <p>
                                - &nbsp; {patientdetails?.firstName || "N/A"}
                              </p>
                              <p>
                                - &nbsp; {patientdetails?.lastname || "N/A"}
                              </p>
                              <p>- &nbsp; {patientdetails?.dob || "N/A"}</p>
                              <p>
                                - &nbsp; {patientdetails?.middlename || "N/A"}
                              </p>
                              <p>- &nbsp; {patientdetails?.age || "N/A"}</p>
                              <p>
                                - &nbsp; {patientdetails?.allergies || "N/A"}
                              </p>
                              <p>- &nbsp; {patientdetails?.tpaID || "N/A"}</p>
                              <p>
                                - &nbsp; {patientdetails?.tpavalidity || "N/A"}
                              </p>
                              <p>
                                - &nbsp;{" "}
                                {patientdetails?.nationalidentification ||
                                  "N/A"}
                              </p>
                              <p>
                                - &nbsp;{" "}
                                {patientdetails?.alternatenumber || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-12">
                          <div className="d-flex">
                            <div className="details_heading">
                              <p>
                                <b>Gender&nbsp;</b>
                              </p>
                              <p>
                                <b>Marrital Status&nbsp;</b>
                              </p>
                              <p>
                                <b>Religion&nbsp;</b>
                              </p>
                              <p>
                                <b>Address&nbsp;</b>
                              </p>
                              <p>
                                <b>City&nbsp;</b>
                              </p>
                              <p>
                                <b>State&nbsp;</b>
                              </p>
                              <p>
                                <b>Country&nbsp;</b>
                              </p>
                              <p>
                                <b>LGA&nbsp;</b>
                              </p>
                              <p>
                                <b>Occupation&nbsp;</b>
                              </p>
                              <p>
                                <b>Language&nbsp;</b>
                              </p>
                              <p>
                                <b>Tribe&nbsp;</b>
                              </p>
                              <p>
                                <b>Guardian Name&nbsp;</b>
                              </p>
                              <p>
                                <b>Blood Group&nbsp;</b>
                              </p>
                              <p>
                                <b>Remarks&nbsp;</b>
                              </p>
                            </div>
                            <div className="details-detail">
                              <p>- &nbsp; {patientdetails?.gender || "N/A"}</p>
                              <p>
                                - &nbsp;{" "}
                                {patientdetails?.maritalstatus || "N/A"}
                              </p>
                              <p>
                                - &nbsp; {patientdetails?.religion || "N/A"}
                              </p>
                              <p>- &nbsp; {patientdetails?.address || "N/A"}</p>
                              <p>- &nbsp; {patientdetails?.city || "N/A"}</p>
                              <p>- &nbsp; {patientdetails?.state || "N/A"}</p>
                              <p>- &nbsp; {patientdetails?.country || "N/A"}</p>
                              <p>- &nbsp; {patientdetails?.lga || "N/A"}</p>
                              <p>
                                - &nbsp; {patientdetails?.occupation || "N/A"}
                              </p>
                              <p>
                                - &nbsp; {patientdetails?.language || "N/A"}
                              </p>
                              <p>- &nbsp; {patientdetails?.tribe || "N/A"}</p>
                              <p>
                                - &nbsp; {patientdetails?.gaurdianname || "N/A"}
                              </p>
                              <p>
                                - &nbsp; {patientdetails?.bloodgroup || "N/A"}
                              </p>
                              <p>- &nbsp; {patientdetails?.remarks || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

export default ViewPatient;
