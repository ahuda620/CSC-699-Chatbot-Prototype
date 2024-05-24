import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Button, Container, Col, ListGroup, Spinner } from 'react-bootstrap';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useAuthContext } from "../Hooks/useAuthContext";

const checkboxStyle = {
    marginRight: '20px',  // Adjust the value as needed
};
const skillBoxStyle = {
    marginTop: '10px',
};

const PercentComponent = (props) => {
    const [aiResponse, setAiResponse] = useState(null);
    const [missingSkills, setMissingSkills] = useState(null);
    const [loadingData, setLoadingData] = useState(false);
    const[saveSkills, setSaveSkills] = useState(null);
    const [selectedSkills, setSelectedSkills] = useState([]);
    var { user } = useAuthContext();

    const chatGPTResumeAnalysis = async (userInfo, jobInfo) => {
    /*Set what attributes of userResume and jobPost you want to send to chatGPT in the data object*/
        const data = {
            userResumeInfo: userInfo,
            jobPostInfo: jobInfo,
        }

        try{
            console.log("getting ai response");
            const response = await axios.post('http://localhost:4000/user/chatGPT', data);
            setAiResponse(response.data.chatgptresponse); //display chatgpt response to console
        }
        catch(error){
            console.log(error.response.data);
            setAiResponse(null);
        }
    }

    const getAiResponse = async ()=> {
        setLoadingData(true);
        await chatGPTResumeAnalysis(props.userInfo, props.jobInfo);
        setLoadingData(false);
    }

    useEffect(() => {
        const fetchData = async () => {
            if (aiResponse) {
                try {
                    const parsedResponse = JSON.parse(aiResponse);
                    setAiResponse(parsedResponse);
    
                    if (parsedResponse.missing_skills) {
                        setMissingSkills(parsedResponse.missing_skills);
                        console.log("Missing Skills:", parsedResponse.missing_skills);
                    } else {
                        console.log("No missing skills in the response.");
                    }
    
                    if (parsedResponse.matching_percentage) {
                        setMatchingScore(parsedResponse.matching_percentage);
                        console.log("Matching Score:", parsedResponse.matching_percentage);
                    } else {
                        console.log("No matching percentage in the response.");
                    }
    
                } catch (error) {
                    console.log("Error parsing AI response:", error);
                }
            }
        };
        fetchData();
    }, [aiResponse]);

    const addSkills = async (newSkill) => {
        setSelectedSkills((prevSkills) => {
          const updatedSkills = prevSkills.includes(newSkill)
            ? prevSkills.filter((skill) => skill !== newSkill)
            : [...prevSkills, newSkill];
          const skillsWithCommas = updatedSkills.join(', ');
          console.log("selectedSkills: " + skillsWithCommas);
      
          return updatedSkills;
        });
      };

    useEffect(() => {
        console.log('selectedSkills:', selectedSkills);
        setSaveSkills(selectedSkills.join(',\n'));
    }, [selectedSkills]);

    const storeSkills = async () => {
        if (selectedSkills.length > 0){
            try{
                const response = await axios.post('http://localhost:4000/user/updateResumeskills',
                {
                    email: user.data.email,
                    missingSkills: saveSkills
                })
                alert('Skills added');
                console.log(response.data.userResume.professional.skills);
            }
            catch(error){
                console.log(error);
            }
        }
    };

    return (
        <Container style={skillBoxStyle}>
            {!aiResponse && 
                <>
                {loadingData && <Spinner animation="border" variant="primary" />}
                <Button variant="primary" onClick={getAiResponse} disabled={loadingData}>
                    {loadingData ? 'Loading...' : 'Chat GPT'}
                </Button>
                </>
            }
            {aiResponse &&
                <Row>
                    {!loadingData && missingSkills && (
                        <Col>
                            <p class="fw-normal" style={{marginLeft: '20px', marginRight: '20px'}}>Missing Skills
                            <ListGroup>
                                {missingSkills.map((skill) => (
                                    <ListGroup.Item>
                                        <input 
                                            type="checkbox" 
                                            id={`checkbox-${skill}`} 
                                            style={checkboxStyle}  
                                            onClick={() => addSkills(skill)}checked={selectedSkills.includes(skill)}>
                                        </input>
                                        {skill}
                                    </ListGroup.Item>
                                ))}
                                <Button variant="primary" onClick={storeSkills}>Save Change</Button>
                                {/* {!saveSkills && <Button variant="primary" onClick={storeSkills}>Save Change</Button>} */}
                            </ListGroup>
                            </p>
                        </Col>
                    )}
                </Row>
            }
        </Container>

    );
};

export default PercentComponent;