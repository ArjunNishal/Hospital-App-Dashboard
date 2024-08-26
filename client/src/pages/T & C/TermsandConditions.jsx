import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import jwtDecode from "jwt-decode";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/Footer";
import UnauthPage from "../../components/UnauthPage";
import { axiosInstance } from "../../config";
import Swal from "sweetalert2";

const TermsandConditions = () => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const id = decoded.id;
  const role = decoded.role;

  // const [admins, setadmins] = useState([]);
  const [aboutus, setaboutus] = useState("");
  const handleaboutusChange = (event, editor) => {
    const data = editor.getData();
    setaboutus(data);
    // /edit/aboutus/:adminid
  };
  // const [selectedAdmin, setselectedAdmin] = useState("");

  // const fetchAdminList = async () => {
  //   try {
  //     // Update the URL to include a query parameter to filter by role
  //     const response = await axiosInstance.get(
  //       "admin-role/getadmins?page=1&limit=1000000000000000000000000000000000000000000000000",
  //       {
  //         params: { role: "admin" },
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     setadmins(response.data.admins.results);
  //   } catch (err) {
  //     console.log(err);
  //     //   setError("Error while fetching admin list");
  //   }
  // };
  // useEffect(() => {
  //   if (decoded.role === "superadmin") {
  //     fetchAdminList();
  //   }
  //   if (decoded.role === "admin") {
  //     getaboutus(decoded.id);
  //     setselectedAdmin(decoded.id);
  //   }
  // }, []);

  const editaboutus = async (e) => {
    e.preventDefault();
    try {
      let url = `about/edit/terms`;
      // if (decoded.role === "admin") {
      //   url = `about/edit/aboutus/${id}`;
      // }
      const response = await axiosInstance.put(
        url,
        {
          terms: aboutus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Show success alert using SweetAlert
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Terms & Conditions updated successfully",
      });
      // if (decoded.role === "superadmin") {
      //   setaboutus("");
      //   setselectedAdmin("");
      // }
    } catch (error) {
      console.error("Error updating Terms & Conditions:", error.message);
      // Show error alert using SweetAlert
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error updating Terms & Conditions",
      });
    }
  };

  const getaboutus = async (adminid) => {
    try {
      const response = await axiosInstance.get(`about/get/terms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data, "response /////////////");
      if (response.status === 200) {
        setaboutus(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching Terms & Conditions:", error);
      //   throw new Error("Error fetching privacy policy");
    }
  };

  useEffect(() => {
    getaboutus();
  }, []);

  return (
    <>
      {role === "superadmin" || decoded.permissions.includes("About us") ? (
        <>
          <Sidebar />
          <Topbar />
          <div className="page-wrapper">
            <div className="page-content-tab">
              <div className="container-fluid">
                <Breadcrumb
                  backpage={"Dashboard"}
                  currentpage={"Terms & Conditions"}
                  backurl={""}
                  maintab={""}
                  heading={"Terms & Conditions"}
                />
                <div>
                  <hr />

                  {/* <h5>About us</h5> */}

                  <form onSubmit={editaboutus}>
                    {/* {role === "superadmin" && (
                        <div className="mb-3">
                          <label className="form-label">
                            <b>Select Admin</b>
                          </label>
                          <select
                            className="form-select"
                            id="inputGroupSelect01"
                            value={selectedAdmin}
                            onChange={(e) => {
                              setselectedAdmin(e.target.value);
                              setaboutus("");
                              getaboutus(e.target.value);
                            }}
                            required={
                              decoded.role === "superadmin" ? true : false
                            }
                          >
                            <option selected>Choose...</option>
                            {admins.map((el, index) => (
                              <option key={index} value={el._id}>
                                {el.username}
                              </option>
                            ))}
                          </select>
                        </div>
                      )} */}
                    <CKEditor
                      editor={Editor}
                      data={aboutus}
                      onChange={handleaboutusChange}
                      style={{ width: "100%" }}
                      // disabled={
                      //   decoded.role === "superadmin" &&
                      //   selectedAdmin !== "Choose..." &&
                      //   selectedAdmin !== ""
                      //     ? false
                      //     : decoded.role === "fpoadmin"
                      //     ? false
                      //     : true
                      // }
                    />
                    <div className="text-center py-3">
                      <button type="submit" className="btn btn-primary">
                        Save
                      </button>
                    </div>
                  </form>
                  <hr />
                  {aboutus && (
                    <>
                      <h4 className="text-primary">Preview</h4>
                      <div className="p-md-3 p-1 border rounded ">
                        <div
                          dangerouslySetInnerHTML={{ __html: aboutus }}
                        ></div>
                      </div>
                    </>
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

export default TermsandConditions;
