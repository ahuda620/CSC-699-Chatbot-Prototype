const mongoose = require('mongoose'); //importing mongoose
const Schema =  mongoose.Schema; //importing mongoose schema class
const bcrypt = require('bcrypt'); //importing bcrypt to hash passwords
const validator = require('validator') //importing validator to validate email and password

const companySchema = new Schema({
    accountType: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    companyCountry: {
        type: String,
        required: false,
    },
    companyState: {
        type: String,
        required: false,
    },
    companyCity: {
        type: String,
        required: false,
    },
    companyEmail: {
        type: String,
        required: true,
        unique: true
    },
    companyPassword: {
        type: String,
        required: true
    },
    companyWebsite: {
        type: String,
        required: true
    },
    companyJobs: {
        type: [String],
        required: false
    }
})

//static signup method
companySchema.statics.signup = async function (companyName, companyEmail, companyPassword, companyWebsite, accountType) {
    //Email and Password Validation
    
    //check if email and password fields are not empty
    if(!companyEmail || !companyPassword) { 
        throw Error('All fields must be filled');
    }
    
    //check if valid email
    if(!validator.isEmail(companyEmail)){
        throw Error('Email is not valid');
    }

    //check if password is strong enough
    if(!validator.isStrongPassword(companyPassword, {
        minUppercase: 0,
        minSymbols: 0
    }))
    {
        throw Error('Password not strong enough');
    }
    
    //check if email exisits
    const exisits = await this.findOne({companyEmail});
    if(exisits) {
        throw Error('Email already in use');
    }

    //generate salt to add to hashed password
    const salt = await bcrypt.genSalt(10);
    //hash password
    const hash = await bcrypt.hash(companyPassword, salt);

    //create a new document/entry in database for company collection containing email and hashed password
    const company = await this.create({companyName, companyEmail, companyPassword: hash, companyWebsite, accountType});
 
    return company; //return newly created company object
}

//static login method
companySchema.statics.login = async function(companyEmail, companyPassword, accountType){
    //check if email and password fields are not empty
    if(!companyEmail || !companyPassword) { 
        throw Error('All fields must be filled');
    }

    //check if email is in database
    const company = await this.findOne({companyEmail});
    
    //if email is NOT in database, throw error
    if(!company) {
        throw Error('Incorrect email');
    }

    //check if password matches password stored in database for email
    const match = await bcrypt.compare(companyPassword, company.companyPassword);

    //if password does NOT match, throw error
    if(!match){
        throw Error('Incorrect password');
    }

    return company;
}

module.exports = mongoose.model('Company', companySchema);