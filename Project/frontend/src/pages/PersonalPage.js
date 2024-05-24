import React from "react";
import { useParams } from "react-router-dom";
import "../App.css";
import { useEffect, useState } from 'react'

import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBTypography,
  MDBIcon,
} from "mdb-react-ui-kit";

function Developer({  }) {
  const { name } = useParams();
  const [memberPage, setMemberPage] = useState(null)

  console.log(name)

  useEffect (() => {
      const fetchMemberPage = async () => {
          const response = await fetch(`http://localhost:4000/about/${name}`)
          const json = await response.json()

          if (response.ok) {
            setMemberPage(json)
          }
      }
      fetchMemberPage()
  }, [])
  return (
    <>
      {memberPage && memberPage.map((member) => (
        <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="6" className="mb-4 mb-lg-0">
            <MDBCard className="mb-3" style={{ borderRadius: ".5rem" }}>
              <MDBRow className="g-0">
                <MDBCol
                  md="4"
                  className="bg-primary text-center text-white"
                  style={{
                    borderTopLeftRadius: ".5rem",
                    borderBottomLeftRadius: ".5rem",
                  }}
                >
                  <MDBCardImage
                    src={member.teamPicture}
                    alt="Avatar"
                    className="my-4 rounded-circle shadow-6"
                    style={{ width: "150px", height: "150px" }}
                    fluid
                  />
                  <MDBTypography tag="h5">{member.teamName}</MDBTypography>
                  <MDBCardText>{member.teamTitle}</MDBCardText>
                  <MDBIcon far icon="edit mb-5" />
                </MDBCol>
                <MDBCol md="8">
                  <MDBCardBody className="p-4">
                    <MDBTypography tag="h6">Information</MDBTypography>
                    <hr className="mt-0 mb-4" />
                    <MDBRow className="pt-1">
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">Email</MDBTypography>
                        <MDBCardText className="text-muted">
                          {member.teamEmail}
                        </MDBCardText>
                      </MDBCol>
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">Github</MDBTypography>
                        <MDBCardText className="text-muted">
                          {member.teamGitHub}
                        </MDBCardText>
                      </MDBCol>
                    </MDBRow>

                    <MDBTypography tag="h6">Detail</MDBTypography>
                    <hr className="mt-0 mb-4" />
                    <MDBRow className="pt-1">
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">
                          Favorite Show/Movie
                        </MDBTypography>
                        <MDBCardText className="text-muted">
                          {member.teamFavshow}
                        </MDBCardText>
                      </MDBCol>
                    </MDBRow>

                    <div className="d-flex justify-content-start">
                      <a href="#!">
                        <MDBIcon fab icon="facebook me-3" size="lg" />
                      </a>
                      <a href="#!">
                        <MDBIcon fab icon="twitter me-3" size="lg" />
                      </a>
                      <a href="#!">
                        <MDBIcon fab icon="instagram me-3" size="lg" />
                      </a>
                    </div>
                  </MDBCardBody>
                </MDBCol>
              </MDBRow>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      ))}
    </>
  );
}

export default Developer;
