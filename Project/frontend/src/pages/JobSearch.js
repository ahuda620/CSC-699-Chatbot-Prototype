import React from "react";
import axios from "axios";
import {useState, useEffect} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form, Stack, Button, Image, Card, Pagination, Spinner } from 'react-bootstrap';
import { useAuthContext } from "../Hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import "../Style/pageLayout.css";
import PercentComponent from "../component/ChatGptResponce";
import JobInfo from "../component/JobInfo";
// npm install react-circular-progressbar

let active = 2;
let items = [];
for (let number = 1; number <= 5; number++) {
  items.push(
    <Pagination.Item key={number} active={number === active}>
      {number}
    </Pagination.Item>,
  );
}

//get user's resume from database
const handlegetResume = async (user) => {
    try {
        const response = await axios.post('http://localhost:4000/user/resume_builder', {email : user.data.email});
        const userResume = await response.data.userResume; //THIS IS WHERE USER'S RESUME IS STORED
        return userResume; 
    } catch (error) {
        console.log(error);
    }  
};

const JobSearch = () => {
    console.log('API Key:', process.env.REACT_APP_RAPIDAPI_KEY);
    const navigate = useNavigate();
    const [search, setSearch] = useState([]);
    // State to keep track of the active page
    const [active, setActive] = useState(1);
    const [searchResult, setSearchResult] = useState([]);
    const [searchLoader, setSearchLoader] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [page, setPage] = useState(1);
    const [jobPost, setJobPost] = useState ("");
    const [jobDetail, setJobDetails] = useState(null);
    const [userResume, setUserResume] = useState(null);
    const [pageLoading, setPageLoading] = useState(false);
    const { user } = useAuthContext();


    const itemsPerPage = 10;
    const indexOfLastItem = active * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = searchResult.slice(indexOfFirstItem, indexOfLastItem);

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

    useEffect(() => {
        if (searchResult.length > 0) {
          setJobDetails(searchResult[0]);
          setPageLoading(false);
          console.log(jobDetail);
        }
    }, [searchResult]);

    // get user skills
    useEffect(() => {
        if(user && userResume===null){
            handlegetResume(user).then((userInfo) => {
                console.log(userInfo.professional.skills); //displaying user skill in console
                //setUserResume(userInfo);                      //save all user info
                setUserResume(userInfo.professional.skills);    //only save user skill
            })
        }
    }, [user]);

    //call JSearch API
    const handleSearch = async () => {
        setPageLoading(true);
        setSearchLoader(true);
        setSearchResult([])
        try {
            const options = {
                method: "GET",
                url: `https://jsearch.p.rapidapi.com/search`,
                headers: {
                    "X-RapidAPI-Key": process.env.REACT_APP_RAPIDAPI_KEY,
                    "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
                },
                params: {
                    query: search,
                    page: page.toString(),
                },
            };

            const response = await axios.request(options);
            setSearchResult(response.data.data);
        } catch (error) {
            setSearchError(error);
            console.log(error);
        } finally {
            setSearchLoader(false);
        }
    };
    // Function to handle page changes
    const handlePageChange = (pageNumber) => {
        setActive(pageNumber);
    };
    // Generating Pagination.Items for pages 1 to 5
    const items = [];
    for (let number = 1; number <= 5; number++) {
        items.push(
        <Pagination.Item
            key={number}
            active={number === active}
            onClick={() => {handlePageChange(number); setPage(number); handleSearch(); setJobDetails(null); setPageLoading(true);}}
        >
            {number}
        </Pagination.Item>,
        );
    }
    
    return <>
    <Container className="div_min_size">
        <Stack direction="horizontal" gap={3} style={{margin: '10px'}}>
            <Form.Group as={Col} onChange={e => setSearch(e.target.value)}>
            <Form.Control
                required
                type="text"
                placeholder="Job title and Location"
            />
            </Form.Group>
            <Button type="button" onClick={handleSearch}>Search</Button>
        </Stack>
        {searchResult && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Pagination size="md" >{items}</Pagination>
            </div>
        )}
        {pageLoading && (
            <div style={{display: 'flex', justifyContent: 'center', margin: '50px'}}>
                <Spinner animation="grow" role="status" variant="primary" style={{height: "100px", width: "100px"}}>
                <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        )}
        <Row>
            <Col md={4}>
                {searchResult && (

                    <Row>
                        {searchResult.map((jobPost) => (
                            <Card key = {jobPost.job_id} style={{margin: '10px'}}>
                                <Card.Header>{jobPost.employer_name}</Card.Header>
                                <Card.Body>
                                    <Card.Title>{jobPost.job_title}</Card.Title>
                                    <Card.Text>
                                        location: {jobPost.job_city}
                                    </Card.Text>
                                    <Button type="button" onClick={() => saveJob(jobPost)}>Save Job</Button>
                                    {/* <Button type="button" href={jobPost.job_apply_link} target="_blank">Apply</Button> */}
                                    <Button type="button" onClick={() => setJobDetails(jobPost)}>View Job Details</Button>
                                </Card.Body>
                            </Card>
                        ))}
                    </Row>
                )}
            </Col>
            <Col md={8}>  
                {jobDetail && (

                    <div class="container-sm w-100 p-3 d-flex justify-content-center card border border-primary shadow-0 card-body" key = {jobDetail.job_id}>
                        <Row>
                            {jobDetail.employer_logo && <Col md={2}><Image style={{height: '30px'}} src={jobDetail.employer_logo}/></Col>}
                            <Col>
                                <h5 class="card-title text-center">{jobDetail.employer_name}</h5>
                            </Col>
                        </Row>
                        <hr class="hr" />
                        {jobDetail.employer_name && 
                            <p class="card-text text-center"> {'Job Title: ' + jobDetail.job_title} </p>
                        }
                        {jobDetail.employer_website && 
                            <p class="card-text text-center">
                                {jobDetail.employer_website && 'Company Website: ' + jobDetail.employer_website}
                            </p>
                        }
                        {jobDetail.job_city && 
                            <p class="card-text text-center">
                                {'Location: ' + jobDetail.job_city + ', ' + jobDetail.job_state + ' , ' + jobDetail.job_country}
                            </p>
                        }
                        {jobDetail.job_posted_at_timestamp && 
                            <p className="card-text text-center">Date Posted: 
                                {jobDetail.job_posted_at_timestamp ? new Date(jobDetail.job_posted_at_timestamp*1000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Invalid Date"}
                            </p>
                        } 
                        <div style={{ display: "inline-block" }}>
                            <div style={{ display: "inline-block" }}>
                                <Button type="button" href={jobDetail.job_apply_link} target="_blank">Apply</Button>
                            </div>
                            <div style={{ display: "inline-block" }}>
                                <Button type="button" onClick={() => saveJob(jobDetail)}>Save Job</Button>
                            </div>
                            <div style={{ display: "inline-block" }}>
                            {jobDetail.job_highlights.Qualifications && userResume && (
                            <PercentComponent userInfo={userResume} jobInfo={jobDetail.job_highlights.Qualifications}/>
                            )}
                            </div>
                        </div>
                        <JobInfo jobDetail={jobDetail}/>
                    </div>
                )}`
            </Col>
        </Row>
    </Container>
</>;
};


export default JobSearch;