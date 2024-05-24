const Company =  require('../models/companyModel'); //importing user model/schema
const jtw = require('jsonwebtoken'); //import JSON Web Totken module for user authentication

//Function that creates a JSON Web Token
const createToken = (_id) => {
    return jtw.sign({_id}, process.env.SECRET, {expiresIn: '3d'});
}

//login company
const loginCompany = async (req, res) => {
    const {companyEmail, companyPassword, accountType} = req.body; //get email and password from request body

    try{
        const company = await Company.login(companyEmail, companyPassword, accountType); //call login function from User model login user
        const token = createToken(company._id); //create JSON Web Token
        res.status(200).json({accountType, companyEmail, token}); //respond with newly added email and JWT
    }
    catch (error){
        res.status(400).json({error: error.message}); //respond with error message
    }
}

//signup company
const signupCompany = async (req, res) => {
    const {companyName, companyEmail, companyPassword, companyWebsite, accountType} = req.body; //get email and password from request body

    try{
        const company = await Company.signup(companyName, companyEmail, companyPassword, companyWebsite, accountType); //call signup function from User model to create new user in database
        const token = createToken(company._id); //create JSON Web Token
        res.status(200).json({companyName, companyWebsite, companyEmail, accountType, token}); //respond with newly added email and JWT
    }
    catch (error){
        res.status(400).json({error: error.message}); //respond with error message
    }
}

module.exports = {loginCompany, signupCompany}