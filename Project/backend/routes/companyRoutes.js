const express = require('express');
const router = express.Router();

//userController functions import
const {loginCompany, signupCompany} = require('../controllers/companyController');

//login route
router.post('/login', loginCompany)

//signup route
router.post('/signup', signupCompany)

module.exports = router;