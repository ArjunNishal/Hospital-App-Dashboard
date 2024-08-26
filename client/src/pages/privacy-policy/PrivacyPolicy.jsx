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

const PrivacyPolicy = () => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const id = decoded.id;
  const role = decoded.role;
  const [privacyPolicy, setPrivacyPolicy] = useState("");

  const handlePrivacyPolicyChange = (event, editor) => {
    const data = editor.getData();
    setPrivacyPolicy(data);
  };
  // const [admins, setadmins] = useState([]);
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
  //     getPrivacyPolicy(decoded.id);
  //     setselectedAdmin(decoded.id);
  //   }
  // }, []);

  const getPrivacyPolicy = async (adminid) => {
    try {
      const response = await axiosInstance.get(`about/get/privacy-policy`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setPrivacyPolicy(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching privacy policy:", error);
      //   throw new Error("Error fetching privacy policy");
    }
  };

  useEffect(() => {
    getPrivacyPolicy();
  }, []);
  const editPrivacyPolicy = async (e) => {
    e.preventDefault();
    try {
      let url = `about/edit/privacy-policy`;
      // if (decoded.role === "admin") {
      //   url = `about/edit/privacy-policy/${decoded.id}`;
      // }
      const response = await axiosInstance.put(
        url,
        {
          privacyPolicy,
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
        text: "Privacy policy updated successfully",
      });
      // if (decoded.role === "superadmin") {
      //   setPrivacyPolicy("");
      //   setselectedAdmin("");
      // }
    } catch (error) {
      console.error("Error updating privacy policy:", error.message);
      let message;
      if (!decoded.id || decoded.id === undefined || decoded.id === "") {
        message = "Please login again";
      } else {
        message = "Error updating privacy policy";
      }
      // Show error alert using SweetAlert
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `${message}`,
      });
    }
  };
  return (
    <>
      {role === "superadmin" || decoded.permissions.includes("Privacy") ? (
        <>
          <Sidebar />
          <Topbar />
          <div className="page-wrapper">
            <div className="page-content-tab">
              <div className="container-fluid">
                <Breadcrumb
                  backpage={"Dashboard"}
                  currentpage={"Privacy Policy"}
                  backurl={""}
                  maintab={""}
                  heading={"Privacy Policy"}
                />
                <div>
                  <hr />

                  {/* <h5>About us</h5> */}

                  <form onSubmit={editPrivacyPolicy}>
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
                            setPrivacyPolicy("");
                            getPrivacyPolicy(e.target.value);
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
                    {/* {decoded.role === "superadmin" &&
                    selectedAdmin !== "Choose..." &&
                    selectedAdmin !== "" ? ( */}
                      <CKEditor
                        editor={Editor}
                        data={privacyPolicy}
                        onChange={handlePrivacyPolicyChange}
                        style={{ width: "100%" }}
                      />
                    {/* // ) : decoded.role === "admin" ? (
                    //   <CKEditor
                    //     editor={Editor}
                    //     data={privacyPolicy}
                    //     onChange={handlePrivacyPolicyChange}
                    //     style={{ width: "100%" }}
                    //   />
                    // ) : (
                    //   ""
                    // )} */}

                    <div className="text-center py-3">
                      <button type="submit" className="btn btn-primary">
                        Save
                      </button>
                    </div>
                  </form>
                  <hr />
                  {privacyPolicy && (
                    <>
                      <h4 className="text-primary">Preview</h4>
                      <div className="p-md-3 p-1 border rounded ">
                        <div
                          dangerouslySetInnerHTML={{ __html: privacyPolicy }}
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

export default PrivacyPolicy;
