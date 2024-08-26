import logo from "./logo.svg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Loginpage from "./pages/Loginpage";
import Register from "./pages/Register";
import Forgotpassword from "./pages/Forgotpassword";
import Protect from "./pages/Protect";
import AdminsAll from "./pages/Users/Admin/AdminsAll";
import CreateAdmin from "./pages/Users/Admin/CreateAdmin";
import ConsultantsList from "./pages/Users/consultant/ConsultantsList";
import DoctorsList from "./pages/Users/doctor/DoctorsList";
import CreateAboutUs from "./pages/aboutus/CreateAboutUs";
import PrivacyPolicy from "./pages/privacy-policy/PrivacyPolicy";
import Queries from "./pages/Query/Queries";
import Profiledetails from "./pages/profile/Profiledetails";
import PatientsList from "./pages/Users/Patient/PatientsList";
import BlogCatList from "./pages/Blogs/BlogCatList";
import BlogsList from "./pages/Blogs/BlogsList";
import SingleBlogPage from "./pages/Blogs/SingleBlogPage";
import CreateBlog from "./pages/Blogs/CreateBlog";
import EditBlog from "./pages/Blogs/EditBlog";
import ResetPassword from "./pages/ResetPassword";
import CreateWeek from "./pages/weeks/CreateWeek";
import WeeksList from "./pages/weeks/WeeksList";
import SingleWeek from "./pages/weeks/SingleWeek";
import Editweek from "./pages/weeks/Editweek";
import WeeksMasterList from "./pages/weeks/WeeksMasterList";
import BlogsByCat from "./pages/Blogs/BlogsByCat";
import TermsandConditions from "./pages/T & C/TermsandConditions";
import Appointments from "./pages/appointments/Appointments";

function App() {
  return (
    <>
      {/* <Admin/> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Loginpage />} />
          <Route path="/superlogin" element={<Loginpage />} />
          <Route path="/forgotpassword" element={<Forgotpassword />} />
          <Route path="/dashboard" element={<Protect Component={Home} />} />
          <Route
            path="/all-admins"
            element={<Protect Component={AdminsAll} />}
          />
          <Route
            path="/create-admin"
            element={<Protect Component={CreateAdmin} />}
          />
          <Route
            path="/all-consultants"
            element={<Protect Component={ConsultantsList} />}
          />
          <Route
            path="/all-doctors"
            element={<Protect Component={DoctorsList} />}
          />
          <Route
            path="/aboutus"
            element={<Protect Component={CreateAboutUs} />}
          />
          <Route
            path="/termsandconditions"
            element={<Protect Component={TermsandConditions} />}
          />

          <Route
            path="/privacy"
            element={<Protect Component={PrivacyPolicy} />}
          />
          <Route path="/query" element={<Protect Component={Queries} />} />
          <Route
            path="/profile"
            element={<Protect Component={Profiledetails} />}
          />
          <Route
            path="/all-patients"
            element={<Protect Component={PatientsList} />}
          />

          <Route
            path="/blogcategories"
            element={<Protect Component={BlogCatList} />}
          />
          <Route path="/blogs" element={<Protect Component={BlogsList} />} />
          <Route
            path="/blog"
            element={<Protect Component={SingleBlogPage} />}
          />
          <Route
            path="/createblog"
            element={<Protect Component={CreateBlog} />}
          />
          <Route path="/editblog" element={<Protect Component={EditBlog} />} />
          <Route
            path="/blogsbycategory"
            element={<Protect Component={BlogsByCat} />}
          />
          {/*  */}
          <Route
            path="/createweek"
            element={<Protect Component={CreateWeek} />}
          />
          <Route
            path="/weeksdata"
            element={<Protect Component={WeeksList} />}
          />
          <Route
            path="/masterweeks"
            element={<Protect Component={WeeksMasterList} />}
          />
          <Route path="/week" element={<Protect Component={SingleWeek} />} />
          <Route path="/editweek" element={<Protect Component={Editweek} />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/appointments" element={<Appointments />} />
          {/*  */}
          {/* <Route path="/forgotpassword" element={<Forgotpassword />} /> */}
          {/* <Route path="/register" element={<Registerpage />} /> */}
          {/* <Route path="/admin" element={<Protect Component={Admin} />} /> */}
          {/* <Route
            path="/fpoadmins"
            element={<Protect Component={Fpoadmins} />}
          /> */}
          {/* <Route path="/addfpo" element={<Protect Component={Addfpoadmin} />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
