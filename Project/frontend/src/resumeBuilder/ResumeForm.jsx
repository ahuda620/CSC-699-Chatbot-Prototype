import { EditIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useEffect } from "react";
import {
  Box,
  VStack,
  Center,
  Heading,
  Progress,
  Stack,
  HStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useMediaQuery } from "@chakra-ui/react";
import BasicDetails from "./BasicDetailsForm";
import EduacationDetails from "./EducationDetails";
import ProfessionalDetails from "./ProfessionalDetailsForm";
import ResumeTemplate from "./ResumeTemplate";
import { useAuthContext } from "../Hooks/useAuthContext";

//get user's resume from database
const handlegetResume = async (user) => {
  try {
    const response = await axios.post('http://localhost:4000/user/resume_builder', {email : user.data.email});
    const userResume = await response.data.userResume; //THIS IS WHERE USER'S RESUME IS STORED
    return userResume; 
  } catch (error) {
    console.log(error.response.data.error);
  }  
};


const ResumeForm = () => {
  const { user } = useAuthContext();  
  const [page, setPage] = React.useState(0);
  const [isMobile] = useMediaQuery("(max-width: 798px)");

  const initialState = {
    profile: {
      firstname: "",
      lastname: "",
      phone: "",
      email: "",
      linkedin: "",
      github: "",
      website: "",
      address: "",
    },
    professional: {
      summary: "",
      skills: "",
      work: [],
    },
    education: [],
    certification: [],
  };

  const [resumeInfo, setResumeInfo] = useState(initialState);
    useEffect(() => {
      if(user){
        handlegetResume(user).then((userResume) => {
          console.log(userResume); //displaying userResume in console
          if(userResume){
            const savedResumeData = userResume;
            setResumeInfo(savedResumeData);  
          }
        })
      }
    }, [user]);


  const formPage = [
    "Profile Details",
    "Professional Experience",
    "Educational Details",
  ];

  const renderForm = () => {
    switch (page) {
      case 0:
        return (
          <BasicDetails
            resumeInfo={resumeInfo}
            setResumeInfo={setResumeInfo}
            setPage={setPage}
          />
        );
      case 1:
        return (
          <ProfessionalDetails
            resumeInfo={resumeInfo}
            setResumeInfo={setResumeInfo}
            setPage={setPage}
          />
        );
      case 2:
        return (
          <EduacationDetails
            resumeInfo={resumeInfo}
            setResumeInfo={setResumeInfo}
            setPage={setPage}
          />
        );
      default:
        return;
    }
  };

  return (
    <Stack mb="50px">
      <Center
        style={{ display: page === 3 ? "none" : "flex" }}
        w="100%"
        px="12px"
        flexDir="column"
      >
        <Heading p={4}>
          Build Your Resume <EditIcon boxSize={8} />
        </Heading>
        <Box w="60%" borderRadius="lg">
          <Progress
            colorScheme="blue"
            value={page === 0 ? 33.3 : page === 1 ? 66.6 : 100}
          />
        </Box>
      </Center>
      {isMobile ? (
        <HStack p={4} spacing={3} justify="center">
          <VStack
            justify="center"
            spacing={4}
            width="90%"
            style={{ display: page === 3 ? "none" : "block" }}
          >
            <Box
              p={8}
              borderRadius="lg"
              bg="#"   //1A365D
              color="white"
              boxShadow="xl"
              rounded="md"
            >
              <Center>
                <Heading mb={4}>{formPage[page]}</Heading>
              </Center>
              {renderForm()}
            </Box>
          </VStack>
          <VStack style={{ display: page === 3 ? "block" : "none" }}>
            <ResumeTemplate resumeInfo={resumeInfo} page={page} />
          </VStack>
        </HStack>
      ) : (
        <HStack p={4} spacing={3} align="stretch" justify="center">
          <VStack
            justify="center"
            spacing={4}
            width="50%"
            style={{ display: page === 3 ? "none" : "block" }}
          >
            <Box
              p={8}
              borderRadius="lg"
              bg="#"   //1A365D
              color="black"
              boxShadow="xl"
              rounded="md"
            >
              <Center>
                <Heading mb={4}>{formPage[page]}</Heading>
              </Center>
              {renderForm()}
            </Box>
          </VStack>
          <VStack style={{ width: page === 3 ? "80%" : "50%" }}>
            <ResumeTemplate resumeInfo={resumeInfo} page={page} />
          </VStack>
        </HStack>
      )}
    </Stack>
  );
};

export default ResumeForm;
