import React from 'react';
import axios from "axios";
import { Button, Card, Container, Row  } from 'react-bootstrap';
import {useState, useEffect} from 'react';
import { useAuthContext } from "../Hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import "../Style/pageLayout.css";

const handlegetJobs = async (user) => {
  try {
    const response = await axios.post('http://localhost:4000/user/my_jobs', {email : user.data.email});
    const jobs = await response.data.user.userJobs;
    //console.log(jobs);
    // console.log(typeof jobs);
    return jobs;
    
  } catch (error) {
    console.log(error);
  }  
};

const handleremoveJobId = async (user, jobPost) => {
  try {
    const response = await axios.patch('http://localhost:4000/user/my_jobs/delete', 
    {
      email : user.data.email,
      jobPost : jobPost
    })
    console.log(response.data.user.userJobs);
    window.location.reload(true);
  } 
  catch (error) {
    console.log(error.response.data);
      alert(error.response.data.error);
  }
}


const SaveJobs = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [userJobObjects, setUserJobObjects] = useState([]);

  useEffect(() => {
    if(user){
      handlegetJobs(user).then(setUserJobObjects);
    }
  }, [user], [userJobObjects]);

  const jobDetailsPage = (jobPost) => {
    navigate("/job_detail", {state : {jobPost: jobPost}});
  }


  return (
    <div className='div_min_size'>
      <Container>
        <Row>
        {userJobObjects.map((jobPost) => (
          <Card key = {jobPost.job_id}>
            <Card.Header>{jobPost.employer_name}</Card.Header>
            <Card.Body>
              <Card.Title>{jobPost.job_title}</Card.Title>
              <Card.Text>
                {jobPost.job_city}, {jobPost.job_state}
              </Card.Text>
              <Button type="button" onClick={() => handleremoveJobId(user, jobPost)}>Remove</Button>
              <Button type="button" href={jobPost.job_apply_link} target="_blank">Apply</Button>
              <Button type="button" onClick={() => jobDetailsPage(jobPost)}>View Job Details</Button>
            </Card.Body>
          </Card>
        ))}
      </Row>
      </Container>
    </div> 
  )
}

export default SaveJobs;