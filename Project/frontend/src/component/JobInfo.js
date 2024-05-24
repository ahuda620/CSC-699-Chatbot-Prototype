import React from "react";
import {useState, useEffect} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form, Stack, Button, Image, Card, Tab, Tabs } from 'react-bootstrap';

const JobInfo =(props)=> {
    const jobDetail = props.jobDetail;
    const [tab, setTab] = useState('Qualifications');

    return <>
        <p class="fw-normal">Job Info</p>
            <ul class="card-text">
                <li>Job Title: {jobDetail.job_title}</li>
                {jobDetail.job_salary_period && <li>{'Hourly or Salary: ' + jobDetail.job_salary_period}</li>}
                {jobDetail.job_min_salary && <li>{'Pay: $' + jobDetail.job_min_salary + ' - $' + jobDetail.job_max_salary}</li>}
                <li>{'Location: ' + jobDetail.job_city + ', ' + jobDetail.job_state + ' , ' + jobDetail.job_country}</li>
                {jobDetail.job_employment_type && <li>{'Employment Type: ' + jobDetail.job_employment_type}</li>}
                <li>{jobDetail.job_is_remote ? 'Remote: True' : 'Remote: False'}</li>
            </ul>
        <Tabs id="controlled-tab-example" activeKey={tab} onSelect={(k) => setTab(k)} className="mb-3">
            <Tab eventKey="Qualifications" title="Job Qualifications">
                {jobDetail.job_highlights.Qualifications && (
                    <ul>
                        {jobDetail.job_highlights.Qualifications.map((qualification, index) => (
                            <li key={index} className="card-text">{qualification}</li>
                        ))}
                    </ul>
                )}
            </Tab>
            <Tab eventKey="Responsiblities" title="Job Responsiblities">
                {jobDetail.job_highlights.Responsibilities && (
                    <ul>
                        {jobDetail.job_highlights.Responsibilities.map((responsiblity, index) => (
                            <li key={index} className="card-text">{responsiblity}</li>
                        ))}
                    </ul>
                )}
            </Tab>
            <Tab eventKey="Description" title="Job Description">
                {jobDetail.job_description &&
                    <p class="card-text">{jobDetail.job_description}</p>
                }
            </Tab>
        </Tabs>

    </>;

}

export default JobInfo;