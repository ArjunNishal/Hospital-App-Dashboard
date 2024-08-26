import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import Footer from "../../components/Footer";
import jwtDecode from "jwt-decode";
import UnauthPage from "../../components/UnauthPage";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance, renderUrl } from "../../config";
import moment from "moment";
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import CkeditorComponent from "../../components/CkeditorComponent";
import RelatedBlogs from "./RelatedBlogs";

const CreateWeek = () => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const id = decoded.id;
  const role = decoded.role;

  const [week, setweek] = useState("");
  const [title, settitle] = useState("");
  const [babylength, setbabylength] = useState("");
  const [babyweight, setbabyweight] = useState("");
  const [babysize, setbabysize] = useState("");
  //   content of editor
  const [babycontent, setbabycontent] = useState("");
  const [Momcontent, setMomcontent] = useState("");
  const [symptomscontent, setsymptomscontent] = useState("");
  const [lifecyclecontent, setlifecyclecontent] = useState("");
  const [sexDescription, setsexDescription] = useState("");
  //   image of section
  const [babyimage, setbabyimage] = useState(null);
  const [momimage, setmomimage] = useState(null);

  const [Editorr, setEditorr] = useState(null);
  const [weeks, setweeks] = useState([]);
  const [selectedblogs, setselectedblogs] = useState([]);
  //   uploaded images arrays
  const [babyuploadedimages, setbabyuploadedimages] = useState([]);
  const [babyuploadedimgsarr, setbabyuploadedimgsarr] = useState([]);
  const [MomuploadedImages, setMomuploadedImages] = useState([]);
  const [MomuploadedImagesarr, setMomuploadedImagesarr] = useState([]);
  const [symptomsUploadedImages, setsymptomsUploadedImages] = useState([]);
  const [symptomsUploadedImagesarr, setsymptomsUploadedImagesarr] = useState(
    []
  );
  const [lifecycleuploadedImages, setlifecycleuploadedImages] = useState([]);
  const [lifecycleuploadedImagesarr, setlifecycleuploadedImagesarr] = useState(
    []
  );
  const [sexUploadedImages, setsexUploadedImages] = useState([]);
  const [sexUploadedImagesarr, setsexUploadedImagesarr] = useState([]);

  // -------------------------------------------------------------------------

  const navigate = useNavigate("");

  const getweeks = async () => {
    try {
      // setloading(true);
      let url = `weeks/get/masterweeks?page=1&limit=99999999999999999999999999999999`;

      //   if (decoded.role === "superadmin") {
      //     url = `weeks/get/masterweeks?page=${currentPage}&limit=${itemsPerPage}`;
      //   } else if (decoded.role !== "superadmin") {
      //     url = `weeks/get/masterweeks/admin/${
      //       decoded.role === "admin" ? decoded.id : decoded.adminId
      //     }?page=${currentPage}&limit=${itemsPerPage}`;
      //   }

      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);
      setweeks(response.data.categories.results);
      // settotalpages(response.data.categories.totalRecord);
      // setloading(false);
    } catch (error) {
      console.log(error);
      // setloading(false);
    }
  };

  useEffect(() => {
    getweeks();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the first file from the FileList
    if (file) {
      setbabyimage(file); // Update state with the selected file
    }
    // console.log(file);
  };

  const handlebabycontentchange = (event, editor) => {
    const data = editor.getData();
    setbabycontent(data);
  };

  // console.log(uploadedImagesarr, image, "uploadedImagesarr");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (week === "" || !week || week === " ") {
        return Swal.fire({
          icon: "warning",
          title: "Please Select a week for Week Data",
          // text: ,
        });
      }

      const weekavailability = await axiosInstance.get(
        `weeks/validate/week/${week}/${
          decoded.role === "admin" || decoded.role === "superadmin"
            ? decoded.id
            : decoded.adminId
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!weekavailability.data.status) {
        return Swal.fire({
          icon: "warning",
          title: "Week number not available",
          text: `Available week numbers: ${weekavailability.data.availableWeeks.join(
            ", "
          )}`,
        });
      }

      if (babycontent === "" || !babycontent || babycontent === " ") {
        return Swal.fire({
          icon: "warning",
          title: "Please enter Baby Content for week",
          // text: ,
        });
      }
      if (Momcontent === "" || !Momcontent || Momcontent === " ") {
        return Swal.fire({
          icon: "warning",
          title: "Please enter Mom Content for week",
          // text: ,
        });
      }
      if (
        symptomscontent === "" ||
        !symptomscontent ||
        symptomscontent === " "
      ) {
        return Swal.fire({
          icon: "warning",
          title: "Please enter Symptoms Content for week",
          // text: ,
        });
      }
      if (
        lifecyclecontent === "" ||
        !lifecyclecontent ||
        lifecyclecontent === " "
      ) {
        return Swal.fire({
          icon: "warning",
          title: "Please enter lifecycle Content for week",
          // text: ,
        });
      }
      if (sexDescription === "" || !sexDescription || sexDescription === " ") {
        return Swal.fire({
          icon: "warning",
          title: "Please enter Sex Description for week",
          // text: ,
        });
      }
      //   const formData = new FormData();
      //   for (let i = 0; i < uploadedImagesarr.length; i++) {
      //     formData.append("files", uploadedImagesarr[i]);
      //   }
      //   const response = await axiosInstance.post("week/upload/image", formData, {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   });

      const uploadImages = async (imagesArray, endpoint) => {
        const formData = new FormData();
        imagesArray.forEach((image, index) => {
          formData.append("files", image);
        });
        const response = await axiosInstance.post(endpoint, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.urls;
      };

      const babyImageUrls = await uploadImages(
        babyuploadedimgsarr,
        "weeks/upload/image"
      );
      const momImageUrls = await uploadImages(
        MomuploadedImagesarr,
        "weeks/upload/image"
      );
      const symptomsImageUrls = await uploadImages(
        symptomsUploadedImagesarr,
        "weeks/upload/image"
      );
      const lifecycleImageUrls = await uploadImages(
        lifecycleuploadedImagesarr,
        "weeks/upload/image"
      );
      const sexImageUrls = await uploadImages(
        sexUploadedImagesarr,
        "weeks/upload/image"
      );

      //   console.log(babyImageUrls, "babyImageUrls");

      //   console.log(babyImageUrls.data.urls, ">>>> babyImageUrls.data.urls");
      //   console.log(momImageUrls.data.urls, ">>>> momImageUrls.data.urls");
      //   console.log(
      //     symptomsImageUrls.data.urls,
      //     ">>>> symptomsImageUrls.data.urls"
      //   );
      //   console.log(
      //     lifecycleImageUrls.data.urls,
      //     ">>>> lifecycleImageUrls.data.urls"
      //   );
      //   console.log(sexImageUrls.data.urls, ">>>> sexImageUrls.data.urls");

      setbabyuploadedimages(babyImageUrls);
      setMomuploadedImages(momImageUrls);
      setsymptomsUploadedImages(symptomsImageUrls);
      setlifecycleuploadedImages(lifecycleImageUrls);
      setsexUploadedImages(sexImageUrls);

      const updatedContentbaby = replaceImageUrls(babycontent, babyImageUrls);
      const updatedContentmom = replaceImageUrls(Momcontent, momImageUrls);
      const updatedContentsymptoms = replaceImageUrls(
        symptomscontent,
        symptomsImageUrls
      );
      const updatedContentlifecycle = replaceImageUrls(
        lifecyclecontent,
        lifecycleImageUrls
      );
      const updatedContentsex = replaceImageUrls(sexDescription, sexImageUrls);
      //   console.log(updatedContent, "updatedContent");

      setbabycontent(updatedContentbaby);
      setMomcontent(updatedContentmom);
      setsymptomscontent(updatedContentsymptoms);
      setlifecyclecontent(updatedContentlifecycle);
      setsexDescription(updatedContentsex);

      uploadweek(
        updatedContentbaby,
        updatedContentmom,
        updatedContentsymptoms,
        updatedContentlifecycle,
        updatedContentsex,
        babyImageUrls,
        momImageUrls,
        symptomsImageUrls,
        lifecycleImageUrls,
        sexImageUrls
      );
    } catch (error) {
      console.log(error);
      // alert(error);
      Swal.fire({
        icon: "error",
        title: "Week Creation Failed",
        text: error.response.data.message,
      });
    }
  };

  const replaceImageUrls = (content, urls) => {
    let updatedContent = content;
    const regex = /src="([^"]*)"/g; // Regular expression to match src attribute values

    let match;
    let index = 0;
    while ((match = regex.exec(updatedContent)) !== null) {
      if (match.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      if (urls[index]) {
        updatedContent = updatedContent.replace(match[1], urls[index]);
        index++;
      }
    }
    return updatedContent;
  };

  const uploadweek = async (
    updatedContentbaby,
    updatedContentmom,
    updatedContentsymptoms,
    updatedContentlifecycle,
    updatedContentsex,
    babyImageUrls,
    momImageUrls,
    symptomsImageUrls,
    lifecycleImageUrls,
    sexImageUrls
  ) => {
    try {
      const weekaData = new FormData();
      weekaData.append("week", week);
      weekaData.append(
        "admin",
        decoded.role === "admin" || decoded.role === "superadmin"
          ? decoded.id
          : decoded.adminId
      );
      weekaData.append(
        "createdby",
        decoded.role === "admin" || decoded.role === "superadmin"
          ? decoded.id
          : decoded.adminId
      );
      // relatedblogs
      const relatedblogs = selectedblogs.map((el) => el._id);

      weekaData.append("relatedblogs", JSON.stringify(relatedblogs));
      // baby

      weekaData.append("babytitle", title);
      weekaData.append("babylength", babylength);
      weekaData.append("babyweight", babyweight);
      weekaData.append("babysize", babysize);
      weekaData.append("babydescription", updatedContentbaby);
      weekaData.append("babyImage", babyimage);
      // mom
      weekaData.append("momImage", momimage);
      weekaData.append("momdescription", updatedContentmom);

      // tips
      weekaData.append("tipsymptoms", updatedContentsymptoms);
      weekaData.append("tiplifestyle", updatedContentlifecycle);
      weekaData.append("tipsex", updatedContentsex);

      //   images
      weekaData.append("babyuploadedImages", JSON.stringify(babyImageUrls));
      weekaData.append("momuploadedImages", JSON.stringify(momImageUrls));
      weekaData.append(
        "symptomsuploadedImages",
        JSON.stringify(symptomsImageUrls)
      );
      weekaData.append(
        "lifestyleuploadedImages",
        JSON.stringify(lifecycleImageUrls)
      );
      weekaData.append("sexuploadedImages", JSON.stringify(sexImageUrls));

      const response = await axiosInstance.post("weeks/createweek", weekaData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "Week Created successfully",
        text: "You have successfully Created Week.",
      });

      navigate("/weeksdata");
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Week Creation Failed",
        text: error.response.data.message,
      });
    }
  };

  return (
    <>
      {decoded.permissions.includes("Create Weeks") ? (
        <>
          <Sidebar />
          <Topbar />
          <div className="page-wrapper">
            <div className="page-content-tab">
              <div className="container-fluid">
                <Breadcrumb
                  backpage={"Weeks"}
                  currentpage={`Create New Week`}
                  backurl={""}
                  maintab={""}
                  heading={`Create New Week`}
                />
                <div className="create_week_form">
                  <div className="card">
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
                        <div className="row mx-0">
                          <div className="col-md-6 col-12 mb-3">
                            <label className="mb-1" htmlFor="week">
                              Week Master
                            </label>
                            <select
                              name="weekmaster"
                              className="form-control"
                              id="weekmaster"
                              value={week}
                              onChange={(e) => {
                                setweek(e.target.value);
                              }}
                            >
                              <option value="">Select Week Master</option>
                              {weeks.map((el, index) => {
                                return (
                                  <option key={index} value={el._id}>
                                    {el.name}
                                  </option>
                                );
                              })}
                            </select>

                            {/* <input
                              type="number"
                              className={`form-control ${
                                week === 0 ? "is-invalid" : ""
                              }`}
                              value={week}
                              onChange={
                                (event) => {
                                  let { value } = event.target;

                                  // Remove leading zeros if any

                                  if (value.length > 1 && value > 0) {
                                    value = value.replace(/^0+/, "");
                                  }

                                  // Ensure maximum length is 2
                                  if (value.length > 2) {
                                    // Truncate to first 2 digits
                                    value = value.slice(0, 2);
                                  }
                                  //   else if (value.length === 1 && value > 0) {
                                  //     // Add leading zero for single digit input
                                  //     value = "0" + value;
                                  //   }

                                  setweek(value);
                                }
                                // handleInputChange(index, event)
                              }
                              onFocus={(e) =>
                                e.target.addEventListener(
                                  "wheel",
                                  function (e) {
                                    e.preventDefault();
                                  },
                                  { passive: false }
                                )
                              }
                            /> */}
                            <div className="invalid-feedback">
                              Enter valid week
                            </div>
                          </div>
                          <div className="col-12">
                            <hr />
                          </div>
                          <div className="card col-12 p-0">
                            <div className="  card-header-int-primary">
                              <h5 className="">Baby</h5>
                            </div>
                            <div className="card-body">
                              <div className="row mx-0">
                                <div className="col-md-6 col-12 mb-3">
                                  <label className="mb-1" htmlFor="title">
                                    Title
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Title"
                                    value={title}
                                    required
                                    onChange={(e) => {
                                      settitle(e.target.value);
                                    }}
                                  />
                                </div>
                                <div className="col-md-6 col-12 mb-3">
                                  <label className="mb-1" htmlFor="length">
                                    Length
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Length"
                                    value={babylength}
                                    required
                                    onChange={(e) => {
                                      setbabylength(e.target.value);
                                    }}
                                  />
                                </div>
                                <div className="col-md-6 col-12 mb-3">
                                  <label className="mb-1" htmlFor="Weight">
                                    Weight
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Weight"
                                    value={babyweight}
                                    required
                                    onChange={(e) => {
                                      setbabyweight(e.target.value);
                                    }}
                                  />
                                </div>
                                <div className="col-md-6 col-12 mb-3">
                                  <label className="mb-1" htmlFor="Size">
                                    Size
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Size"
                                    value={babysize}
                                    required
                                    onChange={(e) => {
                                      setbabysize(e.target.value);
                                    }}
                                  />
                                </div>
                                <div className="col-md-6 col-12 mb-3">
                                  <label className="mb-1" htmlFor="title">
                                    Baby Image
                                  </label>
                                  <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    required
                                    multiple={false}
                                    onChange={handleImageChange}
                                  />
                                </div>
                                {babyimage && (
                                  <div className="col-md-6 col-12 mb-2">
                                    <div className="selected_image border rounded p-2 my-2">
                                      <p className="text-center">
                                        <b>Selected file:</b> {babyimage.name}
                                      </p>
                                      <img
                                        src={URL.createObjectURL(babyimage)}
                                        alt="Selected"
                                      />
                                    </div>
                                  </div>
                                )}
                                <div className="col-12">
                                  <div className="week_content_box">
                                    <label className="mb-3">
                                      <b>Baby Description</b>
                                    </label>
                                    <CkeditorComponent
                                      content={babycontent}
                                      setcontent={setbabycontent}
                                      setuploadedImagesarr={
                                        setbabyuploadedimgsarr
                                      }
                                      uploadedImagesarr={babyuploadedimgsarr}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="card col-12 p-0">
                            <div className="  card-header-int-primary">
                              <h5 className="">Mother</h5>
                            </div>
                            <div className="card-body">
                              <div className="row mx-0">
                                <div className="col-md-6 col-12 mb-3">
                                  <label className="mb-1" htmlFor="title">
                                    Mother Image
                                  </label>
                                  <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    required
                                    multiple={false}
                                    onChange={(e) => {
                                      const file = e.target.files[0]; // Get the first file from the FileList
                                      if (file) {
                                        setmomimage(file); // Update state with the selected file
                                      }
                                    }}
                                  />
                                </div>
                                {momimage && (
                                  <div className="col-md-6 col-12 mb-2">
                                    <div className="selected_image border rounded p-2 my-2">
                                      <p className="text-center">
                                        <b>Selected file:</b> {momimage.name}
                                      </p>
                                      <img
                                        src={URL.createObjectURL(momimage)}
                                        alt="Selected"
                                      />
                                    </div>
                                  </div>
                                )}
                                <div className="col-12">
                                  <div className="week_content_box">
                                    <label className="mb-3">
                                      <b>Mother Description</b>
                                    </label>
                                    <CkeditorComponent
                                      content={Momcontent}
                                      setcontent={setMomcontent}
                                      setuploadedImagesarr={
                                        setMomuploadedImagesarr
                                      }
                                      uploadedImagesarr={MomuploadedImagesarr}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="card col-12 p-0">
                            <div className="  card-header-int-primary">
                              <h5 className="">Tips</h5>
                            </div>
                            <div className="card-body">
                              <div className="row mx-0">
                                <div className="col-12">
                                  <div className="week_content_box rounded border mb-2 p-2 shadow-sm">
                                    <label className="mb-3">
                                      <b>Symptoms</b>
                                    </label>
                                    <CkeditorComponent
                                      content={symptomscontent}
                                      setcontent={setsymptomscontent}
                                      setuploadedImagesarr={
                                        setsymptomsUploadedImagesarr
                                      }
                                      uploadedImagesarr={
                                        symptomsUploadedImagesarr
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-12">
                                  <div className="week_content_box rounded border mb-2 p-2 shadow-sm">
                                    <label className="mb-3">
                                      <b>Lifecycle</b>
                                    </label>
                                    <CkeditorComponent
                                      content={lifecyclecontent}
                                      setcontent={setlifecyclecontent}
                                      setuploadedImagesarr={
                                        setlifecycleuploadedImagesarr
                                      }
                                      uploadedImagesarr={
                                        lifecycleuploadedImagesarr
                                      }
                                    />
                                  </div>
                                </div>{" "}
                                <div className="col-12">
                                  <div className="week_content_box rounded border mb-2 p-2 shadow-sm">
                                    <label className="mb-3">
                                      <b>Gender</b>
                                    </label>
                                    <CkeditorComponent
                                      content={sexDescription}
                                      setcontent={setsexDescription}
                                      setuploadedImagesarr={
                                        setsexUploadedImagesarr
                                      }
                                      uploadedImagesarr={sexUploadedImagesarr}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="card col-12 p-0">
                            <div className="card-header-int-primary">
                              <h5>Related Posts</h5>
                            </div>
                            <div className="card-body">
                              <RelatedBlogs
                                selectedblogs={selectedblogs}
                                setselectedblogs={setselectedblogs}
                              />
                            </div>
                          </div>
                          <div className="col-12 py-3 text-center ">
                            <button
                              type="submit"
                              className="btn btn-lg btn-primary"
                            >
                              Create Week
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
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

export default CreateWeek;
