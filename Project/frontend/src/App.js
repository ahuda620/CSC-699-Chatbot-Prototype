import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";


import 'bootstrap/dist/css/bootstrap.css';

import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Footer from "./component/Footer"
import JobDetail from "./pages/JobDetail"
import UploadJob from "./pages/UploadJob"
import CompanyProfile from "./pages/CompanyProfile"
import JobSearch from "./pages/JobSearch";
import SaveJobs from "./pages/SaveJob";
import CompanyJobs from "./pages/CompanyJobs";
import Navigationbar from "./component/Navigationbar.js";
import PersonalPage from "./pages/PersonalPage";
import ResumeForm from "./resumeBuilder/ResumeForm";

import { useAuthContext } from "./Hooks/useAuthContext";
const padding = {
  paddingBottom: "50px"
};


function App() { 
  const { user } = useAuthContext();
  return (
    <main>
      <Navigationbar  />
      <Routes style={padding}>
        <Route path="/" element={<JobSearch  />} />
        <Route path="/profile" element={user ? <Profile />: <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/resume_builder" element={<ResumeForm />} />
        <Route path="/companyprofile" element={<CompanyProfile />} />
        <Route path="/companyprofile/:id" element={<CompanyProfile />} />
        <Route path="/job_detail" element={<JobDetail />} />
        <Route path="/my_jobs" element={<SaveJobs  />} />
        <Route path="/view_company_jobs" element={<CompanyJobs  />} />
        {/* <Route path="/jobSearch" element={<JobSearch  />} /> */}
        <Route path="/about" element={<About  />} />
        <Route path="/about/:name" element={<PersonalPage/>} />
      </Routes>
      {/* <Footer/> */}
    </main>
  );
}
export default App;
