import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import Swal from "sweetalert2";
import { axiosInstance, permissionslistdoc } from "../../config";
import { useNavigate } from "react-router-dom";
import {
  closemodalConsultantAdmin,
  closemodalCreateAdmin,
} from "../../Intoggle";

const CreateBlogCat = ({ getallblogs }) => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const id = decoded.id;

  const navigate = useNavigate("");

  const [formData, setFormData] = useState({
    categoryname: "",
  });

  const { categoryname } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!categoryname) {
        Swal.fire({
          icon: "error",
          title: "Enter a valid category name.",
        });
        return;
      }
      const admindata = {
        name: categoryname,
        admin:
          decoded.role === "admin" || decoded.role === "superadmin"
            ? decoded.id
            : decoded.adminId,
      };

      const response = await axiosInstance.post(
        "blog/create/category",
        admindata,
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
        title: "Category Created Successfully",
        text: "You have successfully created Category.",
      });

      closemodalConsultantAdmin();

      setFormData({
        categoryname: "",
      });
      //   navigate("/fpoadmins");
    } catch (error) {
      console.error("Server error: ", error);
      //   console.log(JSON.stringify(admindata));
      // Display an error message using SweetAlert2
      Swal.fire({
        icon: "error",
        title: "Category creation Failed",
        text: error.response.data.message,
      });
    }
  };

  const openModalCreateAdmin = () => {
    setFormData({
      categoryname: "",
    });
  };

  return (
    <>
      {decoded.permissions.includes("Create Blog Categories") ? (
        <>
          {" "}
          <button
            data-bs-toggle="modal"
            data-bs-target="#createConsultantModal"
            className="btn-primary btn d-inline "
            onClick={openModalCreateAdmin}
          >
            <i className="fa-solid fa-plus"></i> Create New Category
          </button>
          <div
            className="modal fade bd-example-modal-lg"
            id="createConsultantModal"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="myLargeModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog " role="document">
              <div className="modal-content">
                <div className="modal-header ">
                  <h6 className="modal-title m-0" id="myLargeModalLabel">
                    Create New Category
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
                      {/* <div className="card-header">
                        <h4 className="card-title">Create New Category</h4>
                      </div> */}
                      <div className="card-body">
                        <div className="create-admin-form">
                          <form onSubmit={handleSubmit}>
                            <div className="row mx-0">
                              <div className=" col-12">
                                <div className="mb-3">
                                  <label htmlFor="categoryname">
                                    Category Name
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="categoryname"
                                    name="categoryname"
                                    value={categoryname}
                                    onChange={handleChange}
                                    aria-describedby="categoryname"
                                    placeholder=" Category Name"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-12 text-center ">
                                <button className="btn btn-primary btn-lg">
                                  Create
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
export default CreateBlogCat;
