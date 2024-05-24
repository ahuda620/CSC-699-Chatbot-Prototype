const express = require('express');
const router = express.Router();

//userController functions import
const {loginUser, signupUser, savejobUser, getjobUser, deletejobUser, saveResumeUser, getResumeUser, chatGPTUser, updateResumeskillsUser} = require('../controllers/userController');


//login route
router.post('/login', loginUser)

//signup route
router.post('/signup', signupUser)

//save job listing route for user
router.patch('/jobSearch', savejobUser)

//get saved job listings route for user
router.post('/my_jobs', getjobUser)

//delete save job route for user
router.patch('/my_jobs/delete', deletejobUser)

//save resume from resumeBuilder for user
router.patch('/resume_builder', saveResumeUser);

//get user's resume from database
router.post('/resume_builder', getResumeUser);

//send user's resume and some job description to chatgpt for comparison
router.post('/chatGPT', chatGPTUser);

//update user's resume with selected job skills from the job search page
router.post('/updateResumeskills', updateResumeskillsUser);

module.exports = router;
