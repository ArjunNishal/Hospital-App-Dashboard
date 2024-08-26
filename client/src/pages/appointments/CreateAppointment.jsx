import React, { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import { axiosInstance } from "../../config";
import jwtDecode from "jwt-decode";
import { closeappointmentmodal } from "../../Intoggle";

const CreateAppointment = ({ getallappointments }) => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const id = decoded.id;
  const role = decoded.role;
  const [formData, setFormData] = useState({
    patientId: "",
    date: "",
    concern: "",
    time: "",
  });

  const [patients, setpatients] = useState([]);

  const getallpatients = async () => {
    try {
      //   setloading(true);
      let url;

      let params;

      if (role === "superadmin") {
        url = `admin-role/getallpatients`;
        params = {
          role: "patient",
        };
      } else {
        url = `admin-role/getallpatients`;
        params = { role: "patient", createdby: decoded?.memberid };
      }

      const response = await axiosInstance.post(
        url,
        { role: decoded.role, userId: decoded.id },
        {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      const patients = response.data.admins;
      const patientlist = patients.map((el) => {
        return {
          value: `${el._id}`,
          label: `${el.firstName}${el.lastName} (${el.username})`,
        };
      });
      setpatients(patientlist);
      //   settotalpages(response.data.data.totalRecord);
      //   setloading(false);
    } catch (error) {
      //   setloading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getallpatients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(e.target, name, value);

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.patientId) {
      return Swal.fire({
        icon: "warning",
        title: "Please select a Patient",
      });
    }

    try {
      console.log(formData);
      const response = await axiosInstance.post(
        "admin-role/create/appointments",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      getallappointments();
      // Display a success message using SweetAlert2
      closeappointmentmodal();
      Swal.fire({
        icon: "success",
        title: "Appointment Created Successfully",
        text: "You have successfully created Appointment.",
      });
      setFormData({ patientId: "", date: "", concern: "", time: "" });
      //   navigate("/fpoadmins");
    } catch (error) {
      console.error("Registration error: ", error);
      Swal.fire({
        icon: "error",
        title: "Appointment creation Failed",
        text: error.response.data.Error,
      });
    }
  };
  return (
    <>
      {/* Button trigger modal */}
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        onClick={() => {
          setFormData({
            patientId: "",
            date: "",
            concern: "",
            time: "",
          });
        }}
        data-bs-target="#appointmentmodalcreate"
      >
        Create Appointment
      </button>
      {/* Modal */}
      <div
        className="modal fade"
        id="appointmentmodalcreate"
        tabIndex={-1}
        aria-labelledby="appointmentmodalcreateLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="appointmentmodalcreateLabel">
                Create Appointment
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="appointmentclosebtn"
              />
            </div>
            <div className="modal-body">
              <div>
                <form onSubmit={handleSubmit} className="row mx-0">
                  <div className="col-12 mb-3">
                    <label class="mb-3">Patient</label>
                    <Select
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          patientId: e.value,
                        });
                      }}
                      name="patientId"
                      placeholder="Select Patient"
                      // value={patients.find(
                      //   (option) => option.value === formData.patientId
                      // )}
                      label={
                        formData.patientId
                          ? `${
                              patients.find(
                                (option) => option.value === formData.patientId
                              ).label
                            }`
                          : ""
                      }
                      options={patients}
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label>Date</label>
                    <input
                      onChange={(e) => handleChange(e)}
                      type="date"
                      name="date"
                      value={formData.date}
                      className="form-control "
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label>Time</label>
                    <input
                      onChange={(e) => handleChange(e)}
                      type="time"
                      name="time"
                      value={formData.time}
                      className="form-control "
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label>Purpose</label>
                    <input
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="concern"
                      value={formData.concern}
                      className="form-control "
                    />
                  </div>
                  <div className="col-12 mb-2 text-center">
                    <button type="submit" className="btn btn-primary">
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAppointment;
