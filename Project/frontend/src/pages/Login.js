import React, { useState } from "react";
import axios from "axios";
//import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../Hooks/useAuthContext";
import "../Style/pageLayout.css";

import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBBtn,
  MDBIcon,
  MDBRadio,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";

const Login = () => {
  const { dispatch } = useAuthContext();
  //Personal Account State
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  
  //Company Account State
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPassword, setCompanyPassword] = useState("");
  
  const [justifyActive, setJustifyActive] = useState(false);

  const [accountType, setAccountType] = useState("");

  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }

    setJustifyActive(value);
  };

  //Company or Personal account function
  const accountTypeHandler = (event) => {
    setAccountType(event.target.value);
  };

  //SignUp API Point
  async function signup(event) {
    event.preventDefault();

    const personalAccountData = {
      firstName: firstname,
      lastName: lastname,
      email: email,
      password: password,
      accountType: accountType
    };
  
    const companyAccountData = {
      companyName: companyName,
      companyWebsite: companyWebsite,
      companyEmail: companyEmail,
      companyPassword: companyPassword,
      accountType: accountType
    }

    if(accountType === "company"){
      axios
        .post(`http://localhost:4000/company/signup`, companyAccountData)
        .then(function (response) {
          console.log(response);
  
          //save the user to local storage
          localStorage.setItem("user", JSON.stringify(response));
  
          //update the auth context
          dispatch({ type: "LOGIN", payload: response });
        })
        .catch(function (error) {
          console.log(error.response.data);
          alert(error.response.data.error);
        });
    }
    else if(accountType === "personal"){
      axios
        .post(`http://localhost:4000/user/signup`, personalAccountData)
        .then(function (response) {
          console.log(response);
  
          //save the user to local storage
          localStorage.setItem("user", JSON.stringify(response));
  
          //update the auth context
          dispatch({ type: "LOGIN", payload: response });
        })
        .catch(function (error) {
          console.log(error.response.data);
          alert(error.response.data.error);
        });
    }
    else{
      alert("Account type not selected");
    }
  }

  //Login API Point
  async function logIn(event) {
    event.preventDefault();
    
    const personalAccountData = {
      email: email,
      password: password,
      accountType: accountType
    };

    const companyAccountData = {
      companyEmail: companyEmail,
      companyPassword: companyPassword,
      accountType: accountType
    }

    if(accountType == "company"){
      axios
        .post(`http://localhost:4000/company/login`, companyAccountData)
        .then(function (response) {
          console.log(companyEmail, companyPassword);

          //save the user to local storage
          localStorage.setItem("user", JSON.stringify(response));

          //update the auth context
          dispatch({ type: "LOGIN", payload: response });
        })
        .catch(function (error) {
          console.log(error.response.data);
          alert(error.response.data.error);
        });
    }
    else if(accountType == "personal"){
      axios
        .post(`http://localhost:4000/user/login`, personalAccountData)
        .then(function (response) {
          console.log(email);

          //save the user to local storage
          localStorage.setItem("user", JSON.stringify(response));

          //update the auth context
          dispatch({ type: "LOGIN", payload: response });
        })
        .catch(function (error) {
          console.log(error.response.data);
          alert(error.response.data.error);
        });
    }
    else{
      alert("Account type not selected");
    }
  };

  return (
    <div className="div_min_size">
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
      <MDBTabs
        pills
        justify
        className="mb-3 d-flex flex-row justify-content-between "
      >
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleJustifyClick(true)}
            active={justifyActive === true}
          >
            Login
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleJustifyClick(false)}
            active={justifyActive === false}
          >
            Register
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        <MDBTabsPane show={justifyActive === true}>
          <div className="text-center mb-3">
            <p>Sign in with:</p>

            <div
              className="d-flex justify-content-between mx-auto"
              style={{ width: "40%" }}
            >
              <MDBBtn
                tag="a"
                color="none"
                className="m-1"
                style={{ color: "#1266f1" }}
              >
                <MDBIcon fab icon="facebook-f" size="sm" />
              </MDBBtn>

              <MDBBtn
                tag="a"
                color="none"
                className="m-1"
                style={{ color: "#1266f1" }}
              >
                <MDBIcon fab icon="twitter" size="sm" />
              </MDBBtn>

              <MDBBtn
                tag="a"
                color="none"
                className="m-1"
                style={{ color: "#1266f1" }}
              >
                <MDBIcon fab icon="google" size="sm" />
              </MDBBtn>

              <MDBBtn
                tag="a"
                color="none"
                className="m-1"
                style={{ color: "#1266f1" }}
              >
                <MDBIcon fab icon="github" size="sm" />
              </MDBBtn>
            </div>

            <p className="text-center mt-3">or:</p>
          </div>
          {/* LOGIN INPUT FIELDS */}
          {accountType === "company" ? 
          <div className="Company Account Login">
          <MDBInput
            wrapperClass="mb-4"
            label="Company Email address"
            id="form1"
            type="email"
            value={companyEmail}
            onChange={(event) => setCompanyEmail(event.target.value)}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Password"
            id="form2"
            type="password"
            value={companyPassword}
            onChange={(event) => setCompanyPassword(event.target.value)}
          />
          </div>
          :
          <div className="Personal Account Login">
            <MDBInput
            wrapperClass="mb-4"
            label="Email address"
            id="form1"
            type="email"
            value={email}
            onChange={(event) => setemail(event.target.value)}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Password"
            id="form2"
            type="password"
            value={password}
            onChange={(event) => setpassword(event.target.value)}
          />
          </div>
          }

          <div className="d-flex justify-content-between mx-4 mb-4">
            <MDBCheckbox
              name="flexCheck"
              value=""
              id="flexCheckDefault"
              label="Remember me"
            />
            <a href="!#">Forgot password?</a>
          </div>

          {/* Radio buttons for account type selection */}
          <div className="mb-4">
            <label className="form-label">Account Type:</label>
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                id="personalAccount"
                name="accountType"
                value="personal"
                checked={accountType === "personal"}
                onChange={() => setAccountType("personal")}
              />
              <label className="form-check-label">Personal</label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                id="companyAccount"
                name="accountType"
                value="company"
                checked={accountType === "company"}
                onChange={() => setAccountType("company")}
              />
              <label className="form-check-label">Company</label>
            </div>
          </div>

          <MDBBtn className="mb-4 w-100" onClick={logIn}>
            Log in
          </MDBBtn>
          <p className="text-center">
            Not a member?{" "}
            <a
              href="#!"
              onClick={() => handleJustifyClick(false)}
              active={justifyActive === false}
            >
              Register
            </a>
          </p>
        </MDBTabsPane>

        <MDBTabsPane show={justifyActive === false}>
          <div className="text-center mb-3">
            <p>Sign in with:</p>

            <div
              className="d-flex justify-content-between mx-auto"
              style={{ width: "40%" }}
            >
              <MDBBtn
                tag="a"
                color="none"
                className="m-1"
                style={{ color: "#1266f1" }}
              >
                <MDBIcon fab icon="facebook-f" size="sm" />
              </MDBBtn>

              <MDBBtn
                tag="a"
                color="none"
                className="m-1"
                style={{ color: "#1266f1" }}
              >
                <MDBIcon fab icon="twitter" size="sm" />
              </MDBBtn>

              <MDBBtn
                tag="a"
                color="none"
                className="m-1"
                style={{ color: "#1266f1" }}
              >
                <MDBIcon fab icon="google" size="sm" />
              </MDBBtn>

              <MDBBtn
                tag="a"
                color="none"
                className="m-1"
                style={{ color: "#1266f1" }}
              >
                <MDBIcon fab icon="github" size="sm" />
              </MDBBtn>
            </div>

            <p className="text-center mt-3">or:</p>
          </div>

          {/* REGISTRATION INPUT FIELDS */}
          {accountType === "company" ?
          <div className="Company Account Registration"> 
          <MDBInput
            wrapperClass="mb-4"
            value={companyName}
            label="Company Name"
            id="form1"
            type="text"
            onChange={(event) => setCompanyName(event.target.value)}
          />
          <MDBInput
            wrapperClass="mb-4"
            value={companyWebsite}
            label="Company Website"
            id="form2"
            type="text"
            onChange={(event) => setCompanyWebsite(event.target.value)}
            />
          <MDBInput
            wrapperClass="mb-4"
            value={companyEmail}
            label="Company Email"
            id="form3"
            type="email"
            onChange={(event) => setCompanyEmail(event.target.value)}
          />
          <MDBInput
            wrapperClass="mb-4"
            value={companyPassword}
            label="Company Password"
            id="form4"
            type="password"
            onChange={(event) => setCompanyPassword(event.target.value)}
          />  
          </div>
          :
          <div className="Personal Account Registration">
          <MDBInput
            wrapperClass="mb-4"
            value={firstname}
            label="First Name"
            id="form1"
            type="text"
            onChange={(event) => setFirstname(event.target.value)}
          />
          <MDBInput
            wrapperClass="mb-4"
            value={lastname}
            label="Last Name"
            id="form2"
            type="text"
            onChange={(event) => setLastname(event.target.value)}
            />
          <MDBInput
            wrapperClass="mb-4"
            value={email}
            label="Email"
            id="form3"
            type="email"
            onChange={(event) => setemail(event.target.value)}
          />
          <MDBInput
            wrapperClass="mb-4"
            value={password}
            label="Password"
            id="form4"
            type="password"
            onChange={(event) => setpassword(event.target.value)}
          />
          </div>}
      
          
          <div className="d-flex justify-content-center mb-4">
            <MDBCheckbox
              name="flexCheck"
              id="flexCheckDefault"
              label="I have read and agree to the terms"
            />
          </div>

          {/* Radio buttons for account type selection */}
          <div className="mb-4">
            <span>Account Type: </span>

            <MDBRadio
              label="Personal"
              id="personalAccount"
              name="accountType"
              value="personal"
              checked={accountType === "personal"}
              onChange={accountTypeHandler}
              inline
            />
            <MDBRadio
              name="accountType"
              id="inlineRadio2"
              value="company"
              label="Company"
              checked={accountType === "company"}
              onChange={accountTypeHandler}
              inline
            />
          </div>

          <MDBBtn type="button" className="mb-4 w-100 " onClick={signup}>
            Sign up
          </MDBBtn>
        </MDBTabsPane>
      </MDBTabsContent>
    </MDBContainer>
    </div>
  );
};

export default Login;
