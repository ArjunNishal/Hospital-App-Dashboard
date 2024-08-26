import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import jwtDecode from "jwt-decode";

const Home = () => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const id = decoded.id;
  return (
    <>
      {/* leftbar-tab-menu */}
      <Sidebar />
      {/* end leftbar-tab-menu*/}
      {/* Top Bar Start */}
      {/* Top Bar Start */}
      <Topbar />
      {/* Top Bar End */}
      {/* Top Bar End */}
      <div className="page-wrapper">
        {/* Page Content*/}
        <div className="page-content-tab">
          <div className="container-fluid">
            <h3>
              Welcome!{" "}
              {decoded.role === "doctor"
                ? `Dr. ${decoded.username}`
                : `${decoded.username}`}
            </h3>
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
