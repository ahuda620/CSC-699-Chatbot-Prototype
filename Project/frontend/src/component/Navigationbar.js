import React from "react";
//import Container from 'react-bootstrap/Container';
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
//import NavDropdown from 'react-bootstrap/NavDropdown';
import NavbarCollapse from "react-bootstrap/esm/NavbarCollapse";

//for logout and sign buttons

import { useAuthContext } from '../Hooks/useAuthContext';
import { useLogout } from "../pages/Logout"; 


const Navigationbar = () => {
  //For logout button
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const handleClick = () => {
    console.log(user.data.email);
    logout();
  }
  return (
    <Navbar bg="primary" variant="dark" expand="md">
      <Navbar.Brand className="ps-4 " href="/">
        Easy Connect
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <NavbarCollapse id="basic-navbar-nav">
        <Nav className="justify-content-center flex-grow-1 pe-3">
          <Nav.Link href="/">Search</Nav.Link>
          {user && user.data.accountType === "personal" && (
            <Nav.Link href="/resume_builder">Resume Builder</Nav.Link>
          )}
          {user && user.data.accountType === "company" && (
            <div><Nav.Link href="/add_jobs">Add Jobs</Nav.Link></div>
          )}
          {/* <Nav.Link href="/jobSearch">Search</Nav.Link> */}
          {user && user.data.accountType === "personal" && (
            <Nav.Link href="/my_jobs">My Jobs</Nav.Link>
          )}
          {user && user.data.accountType === "company" && (
            <Nav.Link href="/view_company_jobs">Your Jobs</Nav.Link>
          )}
          <Nav.Link href="/about">About</Nav.Link>
        </Nav>
        <Nav className="justify-content-end">
          {/* If user state is null in AuthContext (user is not logged in), show login button, hide logout button */}
          {!user && (
            <div>
              <Nav.Link href="/login">Log In</Nav.Link>
            </div>
          )}
          {/* If user state is not null in AuthContext (user is logged in), show logout button, hide login button */}
          {user &&(
            <div>
              {/* Line below is how you access the current user's email */}
              <Navbar.Text> Signed in as: {user.data.email}{user.data.companyEmail} </Navbar.Text>
              <Nav.Link onClick={handleClick}>Log Out</Nav.Link>
            </div>
          )}
        </Nav>
      </NavbarCollapse>
    </Navbar>
  );
};

export default Navigationbar;