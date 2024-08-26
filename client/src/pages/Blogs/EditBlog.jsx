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

const EditBlog = () => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const id = decoded.id;
  const role = decoded.role;

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const bid = searchParams.get("bid");
  const [blog, setBlog] = useState(null);

  const [category, setcategory] = useState("");
  const [title, settitle] = useState("");
  const [content, setcontent] = useState("");
  const [image, setimage] = useState(null);
  const [previmage, setprevimage] = useState(null);
  const [Editore, setEditorr] = useState(null);
  const [blogcategories, setblogcategories] = useState([]);
  const [uploadedImagesarr, setuploadedImagesarr] = useState([]);
  const [uploadedImages, setuploadedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate("");

  const fetchBlogById = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`blog/getblog/${bid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlog(response.data.data);
      console.log(response.data);
      const blogdata = response.data.data;
      setcategory(blogdata.category._id);
      settitle(blogdata.title);
      setcontent(blogdata.content);
      setprevimage(blogdata.image);
      setuploadedImages(blogdata.uploadedImages);
      setLoading(false);
      //   setLoading(false);
    } catch (err) {
      console.log(err);
      //   setError("Error fetching the blog");
      //   setLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    // alert("started");
    if (bid) {
      fetchBlogById();
    } else {
      // if (!location.pathname.includes("/blog?bid=")) {
      //   navigate("/blogs");
      // }
      navigate("/blogs");

      //   setError("No blog ID provided");
      //   setLoading(false);
    }
    // fetchBlogById();
  }, [bid]);

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

      // console.log(response.data);
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

  console.log(uploadedImagesarr, image, "uploadedImagesarr");

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
      console.log(
        response.data.urls,
        "urls //////////////////////////////////////"
      );

      const newUrls = response.data.urls.filter(
        (url) => !uploadedImages.includes(url)
      );

      if (newUrls.length > 0) {
        // Add new unique URLs to uploadedImagesarr
        setuploadedImages((prevUrls) => [...prevUrls, ...newUrls]);
      }

      //   setuploadedImages();
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

  console.log(category, "category");

  const uploadblog = async (updatedContent, imageurlsnew) => {
    try {
      //   const imageurlsnew = extractImageUrls(updatedContent);
      const blogaData = new FormData();
      blogaData.append("content", updatedContent);
      blogaData.append("category", category);
      blogaData.append("title", title);
      blogaData.append("image", image);
      blogaData.append("imageurlsnew", JSON.stringify(imageurlsnew));
      blogaData.append(
        "updatedby",
        decoded.role === "admin" || decoded.role === "superadmin"
          ? decoded.id
          : decoded.adminId
      );

      const response = await axiosInstance.put(
        `blog/edit/blog/${bid}`,
        blogaData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Blog Updated successfully",
        text: "You have successfully Updated Blog.",
      });

      navigate("/blogs");
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Blog Updation Failed",
        text: error.response.data.message,
      });
    }
  };

  console.log(content, "content of the article");

  const replaceImageUrls = (content, urls) => {
    let updatedContent = content;
    const regex = /src="(blob:[^"]*)"/g; // Regular expression to match src attribute values

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

  return (
    <>
      {decoded.permissions.includes("Create Blogs") ? (
        <>
          <Sidebar />
          <Topbar />
          <div className="page-wrapper">
            <div className="page-content-tab">
              <div className="container-fluid">
                {loading && (
                  <div className="col-12">
                    <div className="text-center py-5">
                      <div
                        className="spinner-border spinner-border-custom-2 text-secondary"
                        role="status"
                      ></div>
                    </div>
                  </div>
                )}
                <Breadcrumb
                  backpage={"Blog"}
                  currentpage={`Edit Post`}
                  backurl={""}
                  maintab={""}
                  heading={`Edit Post`}
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
                              aria-placeholder="Select Category"
                              id="category"
                            >
                              <option value="Choose" selected>
                                Select
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
                              required={!previmage ? true : false}
                              multiple={false}
                              onChange={handleImageChange}
                            />
                          </div>
                          <div className="col-md-6 col-12"></div>
                          <div className="col-md-6 col-12 mb-3">
                            <div className="selected_image border rounded p-2 my-2">
                              <p className="text-center">
                                <b>Old file:</b> {previmage}
                              </p>
                              <img
                                src={`${renderUrl}uploads/blogs/${previmage}`}
                                alt="Selected"
                              />
                            </div>
                          </div>
                          {image && (
                            <div className="col-md-6 col-12 mb-3">
                              <div className="selected_image border rounded p-2 my-2">
                                <p className="text-center">
                                  <b>New file:</b> {image.name}
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
                              Save
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

export default EditBlog;
