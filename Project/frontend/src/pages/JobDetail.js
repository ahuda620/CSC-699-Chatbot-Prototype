import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthContext } from "../Hooks/useAuthContext";
import axios from 'axios';
import {useState, useEffect} from 'react';
import { Container, Row, Col, Form, Stack, Button, Image, Card  } from 'react-bootstrap';
import "../Style/pageLayout.css";

// //send user's resume and the job post to chatGPT
// const chatGPTResumeAnalysis = async (userResume, jobPost) => {
//   /*Set what attributes of userResume and jobPost you want to send to chatGPT in the data object*/
//   const data = {
//     userResumeInfo: userResume.professional.skills,
//     jobPostInfo: jobPost.job_highlights,
//   }

//   try{
//     const response = await axios.post('http://localhost:4000/user/chatGPT', data);
//     console.log(response.data.chatgptresponse); //display chatgpt response to console
//   }
//   catch(error){
//     console.log(error.response.data);
//   }
// }

// //get user's resume from database
// const handlegetResume = async (user) => {
//   try {
//     const response = await axios.post('http://localhost:4000/user/resume_builder', {email : user.data.email});
//     const userResume = await response.data.userResume; //THIS IS WHERE USER'S RESUME IS STORED
//     return userResume; 
//   } catch (error) {
//     console.log(error);
//   }  
// };


const JobDetail = () => {
  const { user } = useAuthContext();
  const location = useLocation();
  const jobPost = location.state.jobPost; //This stores all the data about the job post 
  console.log(jobPost); //look at console log to see the all the details about the jobpost

  // useEffect(() => {
  //   if(user){
  //     handlegetResume(user).then((userResume) => {
  //       console.log(userResume); //displaying userResume in console
  //       chatGPTResumeAnalysis(userResume, jobPost);
  //     })
  //   }
  // }, []);

    const saveJob = async (jobPost) => {
        if(user){
            await axios
            .patch('http://localhost:4000/user/jobSearch', {
                email : user.data.email,
                jobData : jobPost,
            })
            .then((response) => {
                console.log(response.data.user.userJobs);
                alert("Job saved");
            })
            .catch((error) => {
                console.log(error);
                alert(error.response.data.error);
            });
        }
        else{
            alert("User not logged in");
        }
    };
  
    if(jobPost.job_highlights){
      if(jobPost.job_highlights.Qualifications){
        var jobQualifications = jobPost.job_highlights.Qualifications.map(qualification => <li class="card-text">{qualification}</li>);
      }
  
      if(jobPost.job_highlights.Responsibilities){
        var jobResponsibilities = jobPost.job_highlights.Responsibilities.map(responsiblity => <li class="card-text">{responsiblity}</li>);
      }
    }

    if(jobPost.job_posted_at_timestamp){
      var date = new Date(jobPost.job_posted_at_timestamp * 1000);
      var jobPostDate = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }


  return (
    <div class="container-sm div_min_size" key = {jobPost.job_id}>
      <div class="w-100 p-3 d-flex justify-content-center">
      <div class="card border border-primary shadow-0 ">
        <div class="card-body">
          <h5 class="card-title text-center">{jobPost.job_title}</h5>
          <hr class="hr" />
            <p class="card-text text-center">Company: {jobPost.employer_name}</p>
            <p class="card-text text-center">{jobPost.employer_website && 'Company Website: ' + jobPost.employer_website}</p>
            <p class="card-text text-center">{'Location: ' + jobPost.job_city + ', ' + jobPost.job_state + ' , ' + jobPost.job_country}</p>
            <p class="card-text text-center">Date Posted: {jobPostDate}</p>
            {jobPost.employer_logo && 
              <Col className='d-flex justify-content-center'>
                <Image
                  width={"11%"}
                  src={jobPost.employer_logo}
                />
              </Col>
            }
          <hr class="hr" />
            <p class="fw-normal">Job Info</p>
            <ul class="card-text">
              <li>Job Title: {jobPost.job_title}</li>
              {jobPost.job_salary_period && <li>{'Hourly or Salary: ' + jobPost.job_salary_period}</li>}
              {jobPost.job_min_salary && <li>{'Pay: $' + jobPost.job_min_salary + ' - $' + jobPost.job_max_salary}</li>}
              <li>{'Location: ' + jobPost.job_city + ', ' + jobPost.job_state + ' , ' + jobPost.job_country}</li>
              {jobPost.job_employment_type && <li>{'Employment Type: ' + jobPost.job_employment_type}</li>}
              <li>{jobPost.job_is_remote ? 'Remote: True' : 'Remote: False'}</li>
            </ul>
          <hr class="hr" />
            <p class="fw-normal">{jobQualifications && 'Job Qualifications'}</p>
            <ul>{jobQualifications}</ul>
            <p class="fw-normal">{jobResponsibilities && 'Job Responsiblities'}</p>
            <ul>{jobResponsibilities}</ul>
          <hr class="hr" />
          {jobPost.job_description &&
            <><p class="fw-normal">Job Description</p>
            <p class="card-text">{jobPost.job_description}</p></>
          }
        </div>
        <div class="card-footer d-flex justify-content-center">
          <Button type="button" href={jobPost.job_apply_link} target="_blank">Apply</Button>
          <Button type="button" onClick={() => saveJob(jobPost)}>Save Job</Button>
        </div>
      </div>
    </div>
  </div>
  ) 
}

export default JobDetail