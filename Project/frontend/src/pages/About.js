import React from "react";
import { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import "../Style/pageLayout.css";

import Row from "react-bootstrap/Row";

const About = () => {
  const [teamMembers, setTeamMembers] = useState(null)

  useEffect (() => {
      const fetchTeamMembers = async () => {
          const response = await fetch('http://localhost:4000/about/')
          const json = await response.json()

          if (response.ok) {
              setTeamMembers(json)
          }
      }
      fetchTeamMembers()
  }, [])
return (
  <section id="teams" className="block teams-block div_min_size" >
    <Container fluid>
      <div className="text-center font-bold my-10 opacity-30 title-holder">
        <h2>Our teams</h2>
        <div className="subtitle">Team Schedule</div>
        <div className="subtitle">Tuesday & Thursday</div>
        <div className="subtitle">2PM-3PM</div>
        <div className="subtitle">Discord</div>
      </div>
      <Row className="flex flex-wrap ">
        {teamMembers && teamMembers.map((member) => (
          <Col sm={3} key={member._id}>
          <div className="image bg-light shadow p-3 mb-5 rounded">
            <Link to={`/about/${member.teamName}`}>
              <Image className="mx-auto" src={member.teamPicture} fluid />
            </Link>
            <div className="text-center ">
              <h3>{member.teamName}</h3>
              <span className="designation">{member.teamTitle}</span>
            </div>
          </div>
        </Col>
        ))}
      </Row>
    </Container>
  </section>
);
};

export default About;