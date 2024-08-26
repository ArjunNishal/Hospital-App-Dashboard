import React, { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import jwtDecode from "jwt-decode";
import { axiosInstance, renderUrl } from "../../config";
import Swal from "sweetalert2";
import moment from "moment";
import { closemodalcategoryedit } from "../../Intoggle";
import UnauthPage from "../../components/UnauthPage";
import { Link } from "react-router-dom";

const RelatedBlogs = ({ selectedblogs, setselectedblogs }) => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const id = decoded.id;
  const role = decoded.role;

  const [blogs, setblogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setitemsPerPage] = useState(6);
  const [totalpages, settotalpages] = useState(0);
  const [selectedblog, setselectedblog] = useState({});
  const [loading, setloading] = useState(false);
  const [searchvalue, setsearchvalue] = useState("");

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getallblogs = async () => {
    try {
      let url;
      setloading(true);

      if (decoded.role === "superadmin") {
        url = `blog/get/blogs?page=${currentPage}&limit=${itemsPerPage}`;
      } else if (decoded.role !== "superadmin") {
        url = `blog/get/blogs/admin/${
          decoded.role === "admin" ? decoded.id : decoded.adminId
        }?page=${currentPage}&limit=${itemsPerPage}`;
      }

      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);
      setblogs(response.data.blogs.results);
      settotalpages(response.data.blogs.totalRecord);
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  useEffect(() => {
    getallblogs();
  }, []);
  useEffect(() => {
    getallblogs();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handleSearch = async (val) => {
    try {
      setloading(true);
      const apiUrl = "admin-role/search";
      const modelName = "Blog";
      // const role = roleid._id;
      // const mongodbQuery = {
      //   $or: [
      //     { name: { $regex: val, $options: "i" } },
      //     { phone: { $regex: val, $options: "i" } },
      //     // { radio: rid },
      //   ],
      // };
      let mongodbQuery;

      if (decoded.role === "superadmin") {
        mongodbQuery = {
          title: { $regex: val, $options: "i" },
        };
      } else if (decoded.role !== "superadmin") {
        mongodbQuery = {
          title: { $regex: val, $options: "i" },
          admin:
            decoded.role === "superadmin" || decoded.role === "admin"
              ? decoded.id
              : decoded.adminId,
        };
      }

      console.log(mongodbQuery, "mongodbQuery");

      const response = await axiosInstance.post(
        apiUrl,
        {
          query: mongodbQuery,
          model: modelName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        console.log(response.data, "members search");
        setblogs(response.data.data);
        // setSearchResults(response.data.data);
      } else {
        console.error("Error:", response.data.message);
      }
      setloading(false);
    } catch (error) {
      console.error("Error:", error);
      setloading(false);
    }
  };

  const handlesearchevent = (e) => {
    const value = e.target.value;
    if (value === "") {
      getallblogs();
    } else if (value !== "" && value) {
      handleSearch(value);
    }
    setsearchvalue(value);
  };

  const handleAddBlog = (blog) => {
    if (selectedblogs.some((selectedBlog) => selectedBlog._id === blog._id)) {
      setselectedblogs(
        selectedblogs.filter((selectedBlog) => selectedBlog._id !== blog._id)
      );
    } else {
      setselectedblogs([...selectedblogs, blog]);
    }
  };

  const removeBlog = (blog) => {
    setselectedblogs(
      selectedblogs.filter((selectedBlog) => selectedBlog._id !== blog._id)
    );
  };

  const isBlogSelected = (blogId) => {
    return selectedblogs.some((selectedBlog) => selectedBlog._id === blogId);
  };
  return (
    <div className="blog_related_main">
      {selectedblogs?.length > 0 && (
        <div className="selectedblogs p-2 border rounded shadow mb-3">
          <h5>Selected Related Blogs</h5>
          <div className="d-flex gap-1 flex-wrap">
            {selectedblogs?.map((el, index) => {
              return (
                <span key={index} className={`selectedblog_badge`}>
                  {el?.title} &nbsp;
                  <button
                    type="button"
                    onClick={() => removeBlog(el)}
                    className="btn btn-sm p-0"
                  >
                    <i className="fa fa-times"></i>
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
      <div className="blogcards_row">
        <div className="row mx-0">
          <div className="col-12 p-0 d-flex justify-content-center mb-2">
            <div className="text-center app-search border ssearchbar_int shadow rounded-pill ">
              <form role="search" action="#" method="get">
                <input
                  type="search"
                  name="search"
                  className="form-control top-search mb-0"
                  placeholder="Search..."
                  onChange={(e) => {
                    handlesearchevent(e);
                  }}
                />
                <button type="submit">
                  <i className="ti ti-search" />
                </button>
              </form>
            </div>
          </div>

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
          <div className="col-12 my-2">
            <div className="text-end">
              <div className="dataTable-dropdown mb-md-0 mb-3">
                <label>
                  Show entries{" "}
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setitemsPerPage(Number(e.target.value));
                    }}
                    className="dataTable-selector"
                  >
                    {/* <option value={1}>1</option> */}
                    <option value={6}>6</option>
                    <option value={12}>12</option>
                    <option value={15}>15</option>
                    <option value={21}>21</option>
                    <option value={27}>27</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
          {blogs?.map((bl, index) => {
            return (
              <div key={index} className="col-lg-4">
                <div className="card shadow">
                  <div className="card-body">
                    <div className="blog-card">
                      <img
                        //   src="assets/images/small/img-1.jpg"
                        src={`${renderUrl}uploads/blogs/${bl?.image}`}
                        alt
                        className="blog_card_img rounded"
                      />
                      <div className="text-end">
                        <span
                          className={`badge badge-purple px-3 py-2  ${
                            bl?.status === 1
                              ? "bg-soft-success"
                              : "bg-soft-danger"
                          }  fw-semibold mt-3`}
                        >
                          <i className="fa-solid fa-circle"></i>{" "}
                          {bl?.status === 1 ? "Active" : "Inactive"}{" "}
                        </span>
                      </div>
                      <h4 className="my-3">
                        <a href className>
                          {bl?.title}
                        </a>
                      </h4>
                      <span className="badge badge-purple px-3 py-2 bg-soft-primary fw-semibold mt-3">
                        {bl?.category?.name}
                      </span>
                      {/* <p className="text-muted">
                  The standard chunk of Lorem Ipsum used since
                  the 1500s is reproduced below for those
                  interested. Cum sociis natoque penatibus et
                  magnis.
                </p> */}
                      <hr className="hr-dashed" />
                      <div className="d-flex justify-content-between">
                        <div className="meta-box">
                          <div className="media">
                            <img
                              src="assets/images/users/user-5.jpg"
                              alt
                              className="thumb-sm rounded-circle me-2"
                            />
                            <div className="media-body align-self-center text-truncate">
                              <h6 className="m-0 text-dark">
                                {bl?.createdby?.username}
                              </h6>
                              <p className="m-0">
                                by{" "}
                                {bl?.createdby?.role === "superadmin"
                                  ? "Super admin"
                                  : bl?.createdby?.role === "admin"
                                  ? "Admin"
                                  : bl?.createdby?.role === "consultant"
                                  ? "Consultant"
                                  : bl?.createdby?.role === "doctor"
                                  ? "Doctor"
                                  : ""}
                              </p>
                              <ul className="p-0 list-inline mb-0">
                                <li className="list-inline-item">
                                  {moment(bl?.createdAt).format(
                                    "Do MMMM  YYYY"
                                  )}
                                </li>
                              </ul>
                            </div>
                            {/*end media-body*/}
                          </div>
                        </div>
                        {/*end meta-box*/}
                        <div className="align-self-center">
                          <Link
                            target="_blank"
                            to={`/blog?bid=${bl?._id}`}
                            className="btn btn-primary rounded-pill"
                          >
                            Read more <i className="fas fa-chevron-right" />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="my-2">
                      <button
                        type="button"
                        onClick={() => handleAddBlog(bl)}
                        className={`btn w-100 rounded-pill ${
                          isBlogSelected(bl._id)
                            ? "btn-success"
                            : "btn-outline-primary"
                        } `}
                      >
                        {isBlogSelected(bl._id) ? "Added" : "Add"}
                      </button>
                    </div>
                    {/*end blog-card*/}
                  </div>
                  {/*end card-body*/}
                </div>
                {/*end card*/}
              </div>
            );
          })}
          {(blogs?.length === 0 || !blogs) && !loading && (
            <div className="col-12 py-5">
              <p className="text-center">
                <b>No Blogs Found</b>
              </p>
            </div>
          )}
          {!searchvalue && (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={totalpages}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RelatedBlogs;
