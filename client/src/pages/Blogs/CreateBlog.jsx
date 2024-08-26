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

const CreateBlog = () => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const id = decoded.id;
  const role = decoded.role;

  const [category, setcategory] = useState("");
  const [title, settitle] = useState("");
  const [content, setcontent] = useState("");
  const [image, setimage] = useState(null);
  const [Editorr, setEditorr] = useState(null);
  const [blogcategories, setblogcategories] = useState([]);
  const [uploadedImages, setuploadedImages] = useState([]);
  const [uploadedImagesarr, setuploadedImagesarr] = useState([]);
  const navigate = useNavigate("");

  const getblogcategories = async () => {
    try {
      let url = `blog/get/categories?page=1&limit=99999999999999999999999999999999`;

      // if (decoded.role === "superadmin") {
      //   url = `blog/get/categories`;
      // } else if (decoded.role !== "superadmin") {
      //   url = `blog/getcategories/${
      //     decoded.role === "admin" ? decoded.id : decoded.adminId
      //   }`;
      // }

      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);
      setblogcategories(response.data.categories.results);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getblogcategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the first file from the FileList
    if (file) {
      setimage(file); // Update state with the selected file
    }
    // console.log(file);
  };

  const handlecontentchange = (event, editor) => {
    const data = editor.getData();
    setcontent(data);
  };

  // console.log(uploadedImagesarr, image, "uploadedImagesarr");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (category === "" || !category || category === " ") {
        return Swal.fire({
          icon: "warning",
          title: "Please Select a category for blog",
          // text: ,
        });
      }
      if (content === "" || !content || content === " ") {
        return Swal.fire({
          icon: "warning",
          title: "Please enter Content for blog",
          // text: ,
        });
      }

      const formData = new FormData();
      for (let i = 0; i < uploadedImagesarr.length; i++) {
        formData.append("files", uploadedImagesarr[i]);
      }

      const response = await axiosInstance.post("blog/upload/image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(
      //   response.data.urls,
      //   "urls //////////////////////////////////////"
      // );

      setuploadedImages(response.data.urls);

      const updatedContent = replaceImageUrls(content, response.data.urls);
      console.log(updatedContent, "updatedContent");
      setcontent(updatedContent);
      uploadblog(updatedContent, response.data.urls);
    } catch (error) {
      console.log(error);
      // alert(error);
      Swal.fire({
        icon: "error",
        title: "Blog Creation Failed",
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

  const uploadblog = async (updatedContent, newurls) => {
    try {
      // const imageurlsnew = extractImageUrls(updatedContent);
      console.log(newurls, "newurls..............................");
      const blogaData = new FormData();
      blogaData.append("content", updatedContent);
      blogaData.append("category", category);
      blogaData.append("title", title);
      blogaData.append("image", image);
      blogaData.append("uploadedImages", JSON.stringify(newurls));
      // uploadedImages
      blogaData.append(
        "admin",
        decoded.role === "admin" || decoded.role === "superadmin"
          ? decoded.id
          : decoded.adminId
      );
      blogaData.append(
        "createdby",
        decoded.role === "admin" || decoded.role === "superadmin"
          ? decoded.id
          : decoded.adminId
      );

      // console.log(uploadedImages, "uploadedImages");

      const response = await axiosInstance.post("blog/create/blog", blogaData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "Blog Created successfully",
        text: "You have successfully Created Blog.",
      });

      // navigate("/blogs");
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Blog Creation Failed",
        text: error.response.data.message,
      });
    }
  };

  // console.log(content, "content of the article");

  function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader, setuploadedImagesarr);
    };
  }

  class MyUploadAdapter {
    constructor(loader, setuploadedImagesarr) {
      this.loader = loader;
      this.setuploadedImagesarr = setuploadedImagesarr;
    }

    async upload() {
      const file = await this.loader.file;
      // const formData = new FormData();
      // formData.append("file", file);

      try {
        // const response = await axiosInstance.post("/upload/image", formData, {
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        //   },
        // });
        const url = URL.createObjectURL(file);
        console.log(file, url, "555555555555555555555555555555555");
        // const url = response.data.url;
        this.setuploadedImagesarr((prev) => [...prev, file]);
        return { default: url };
      } catch (error) {
        console.error("Upload failed:", error);
        throw error;
      }
    }

    abort() {
      // Abort the upload process if necessary.
    }
  }
  console.log(content);
  return (
    <>
      {decoded.permissions.includes("Create Blogs") ? (
        <>
          <Sidebar />
          <Topbar />
          <div className="page-wrapper">
            <div className="page-content-tab">
              <div className="container-fluid">
                <Breadcrumb
                  backpage={"Blog"}
                  currentpage={`Create New Post`}
                  backurl={""}
                  maintab={""}
                  heading={`Create New Post`}
                />
                <div className="create_blog_form">
                  <div className="card">
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
                        <div className="row mx-0">
                          <div className="col-md-6 col-12 mb-3">
                            <label className="mb-1" htmlFor="category">
                              Select Blog Category
                            </label>
                            <select
                              name="category"
                              className="form-select"
                              value={category}
                              required
                              onChange={(e) => {
                                setcategory(e.target.value);
                              }}
                              aria-placeholder="Select"
                              id="category"
                            >
                              <option value="" selected>
                                Select Category
                              </option>
                              {blogcategories?.map((cat, index) => {
                                return (
                                  <option className="text-capitalize" key={index} value={cat._id}>
                                    {cat.name}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div className="col-md-6 col-12 mb-3">
                            <label className="mb-1" htmlFor="title">
                              Title of Post
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
                            <label className="mb-1" htmlFor="title">
                              Post Image
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
                          {image && (
                            <div className="col-md-6 col-12 mb-2">
                              <div className="selected_image border rounded p-2 my-2">
                                <p className="text-center">
                                  <b>Selected file:</b> {image.name}
                                </p>
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt="Selected"
                                />
                              </div>
                            </div>
                          )}
                          <div className="col-12">
                            <div className="blog_content_box">
                              <label className="mb-3">
                                <b>Post Content</b>
                              </label>
                              {/* <CKEditor
                                editor={ClassicEditor}
                                data={content}
                                onChange={handlecontentchange}
                                config={{
                                  extraPlugins: [MyCustomUploadAdapterPlugin],
                                  height: "300px",
                                }}
                                style={{ width: "100%" }}
                              /> */}
                              <CKEditor
                                editor={Editor}
                                data={content}
                                onChange={(event, editor) => {
                                  const data = editor.getData();
                                  // console.log(editor, data, "editor data");
                                  setcontent(data);
                                  setEditorr(editor);
                                }}
                                style={{ width: "100%" }}
                                config={{
                                  extraPlugins: [MyCustomUploadAdapterPlugin],
                                  height: "300px",
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-12 py-3 text-center ">
                            <button className="btn btn-lg btn-primary">
                              Create Post
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

export default CreateBlog;
