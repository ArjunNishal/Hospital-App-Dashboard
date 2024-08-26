import React, { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import jwtDecode from "jwt-decode";
import { axiosInstance, renderUrl } from "../../config";
import Swal from "sweetalert2";
import moment from "moment";
import { closemodalcategoryedit } from "../../Intoggle";
import UnauthPage from "../../components/UnauthPage";
import { Link } from "react-router-dom";

const ShowRelatedBlogs = ({ blogs }) => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const id = decoded.id;
  const role = decoded.role;

  return (
    <div className="blog_related_main">
      <div className="blogcards_row">
        <div className="row mx-0">
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
                    
                    {/*end blog-card*/}
                  </div>
                  {/*end card-body*/}
                </div>
                {/*end card*/}
              </div>
            );
          })}
          {(blogs?.length === 0 || !blogs) && (
            <div className="col-12 py-5">
              <p className="text-center">
                <b>No Blogs Found</b>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowRelatedBlogs;
