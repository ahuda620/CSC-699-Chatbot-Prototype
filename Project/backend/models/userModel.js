//THIS IS THE SCHEMA FOR PERSONAL ACCOUNTS
const mongoose = require('mongoose'); //importing mongoose
const Schema =  mongoose.Schema; //importing mongoose schema class
const bcrypt = require('bcrypt'); //importing bcrypt to hash passwords
const validator = require('validator') //importing validator to validate email and password

//making new user account schema object
const userSchema = new Schema({
    accountType: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    //email property
    email: {
        type: String,
        required: true,
        unique: true
    },
    //password property
    password: {
        type: String,
        required: true
    },
    userCountry: {
        type: String,
        required: false
    },
    userState: {
        type: String,
        required: false
    },
    userJobinterests: {
        type: [String],
        required: false
    },
    userRemote: {
        type: Boolean,
        required: false
    },
    userResume: {
        certification: {
            type: [{
                link: {
                    type: String
                },
                details: {
                    type: String
                }
            }]
        },
        education: {
            type: [{
                college: {
                    type: String
                },
                course: {
                    type: String
                },
                startDate: {
                    type: String
                },
                endDate: {
                    type: String
                }
            }]
        },
        professional: {
            skills: {
                type: String
            },
            summary: {
                type: String
            },
            work: {
                type: [{
                    jobTitle: {
                        type: String
                    },
                    company: {
                        type: String
                    },
                    startDate: {
                        type: String
                    },
                    endDate: {
                        type: String
                    },
                    jobDetails: {
                        type: String
                    }
                }]
            },
        },
        profile: {
            address: {
                type: String
            },
            email: {
                type: String
            },
            firstname: {
                type: String
            },
            github: {
                type: String
            },
            lastname: {
                type: String
            },
            linkedin: {
                type: String
            },
            phone: {
                type: String
            },
            website: {
                type: String
            }
        }
    },
    //job ids
    userJobs: {
        type: [Schema.Types.Mixed],
        required: false
    } 
})

//static signup method
userSchema.statics.signup = async function (firstName, lastName, email, password, accountType) {
    //Email and Password Validation
    
    //check if email and password fields are not empty
    if(!email || !password) { 
        throw Error('All fields must be filled');
    }
    
    //check if valid email
    if(!validator.isEmail(email)){
        throw Error('Email is not valid');
    }

    //check if password is strong enough
    if(!validator.isStrongPassword(password, {
        minUppercase: 0,
        minSymbols: 0
    }))
    {
        throw Error('Password not strong enough');
    }
    
    //check if email exisits
    const exisits = await this.findOne({email});
    if(exisits) {
        throw Error('Email already in use');
    }

    //generate salt to add to hashed password
    const salt = await bcrypt.genSalt(10);
    //hash password
    const hash = await bcrypt.hash(password, salt);

    //create a new document/entry in database for User collection containing email and hashed password
    const user = await this.create({firstName, lastName, email, password: hash, accountType});
 
    return user; //return newly created user object
}

//static login method
userSchema.statics.login = async function(email, password, accountType){
    //check if email and password fields are not empty
    if(!email || !password) { 
        throw Error('All fields must be filled');
    }

    //check if email is in database
    const user = await this.findOne({email});
    
    //if email is NOT in database, throw error
    if(!user) {
        throw Error('Incorrect email');
    }

    if(accountType != "personal"){
        throw Error('Incorrect account type');
    }

    //check if password matches password stored in database for email
    const match = await bcrypt.compare(password, user.password);

    //if password does NOT match, throw error
    if(!match){
        throw Error('Incorrect password');
    }

    return user;
}

//static save job listing method for user
userSchema.statics.savejobUser = async function(email, jobData){
    //check if email is in database
    const user = await this.findOne({email});
    
    //if email is NOT in database, throw error
    if(!user) {
        throw Error('Incorrect email');
    }

    if(!jobData){
        throw Error('Error occured when trying to save job post. Please try again.');
    }

    await user.userJobs.push(jobData);
    await user.save();

    return user;
}

//static get job listing method for user
userSchema.statics.getjobUser = async function(email){
    //check if email is in database
    const user = await this.findOne({email});
    
    //if email is NOT in database, throw error
    if(!user) {
        throw Error(`Incorrect email = ${email}`);
    }

    return user;
}


//static delete job listing method for user
userSchema.statics.deletejobUser = async function(email, jobPost){
    //check if email is in database
    const user = await this.findOne({email});
    
    //if email is NOT in database, throw error
    if(!user) {
        throw Error('Incorrect email');
    }

    if(!jobPost){
        throw Error('Error occured when trying to delete job post. Please try again.');
    }

    const index = user.userJobs.forEach(async (element, index)=> {
        if(JSON.stringify(element) === JSON.stringify(jobPost)){
            await user.userJobs.splice(index, 1);
            await user.save();
        }
    });
    
    return user;
}

//save resume from resumeBuilder for user
userSchema.statics.saveResumeUser = async function(certification, education, professional, profile) {
    //if email is NOT in database, throw error
    if(!await this.findOne({email: profile.email})){
        throw Error(`Incorrect email '${profile.email}'. The email you input must match the one you used when you registered your account.`);
    }

    const user = await this.findOne({email: profile.email});

    user.userResume.certification = certification;
    user.userResume.education = education;
    user.userResume.professional = professional;
    user.userResume.profile = profile;

    await user.save();
    return user.userResume;
}

//get user's resume from database
userSchema.statics.getResumeUser = async function(email) {
    //check if email is in database
    const user = await this.findOne({email});

    //empty resume object to compare to
    const emptyResume = {
        "professional": {
            "work": []
        },
        "profile": {},
        "certification": [],
        "education": []
    }
    
    //if email is NOT in database, throw error
    if(!user) {
        throw Error(`Incorrect email = ${email}`);
    }
    else if(JSON.stringify(user.userResume) === JSON.stringify(emptyResume)){
        throw Error(`Resume for '${email}' does not exist. Please use the Resume Builder to make one.`);
    }

    return user.userResume;
}

userSchema.statics.updateResumeskills = async function (email, missingSkills){
    //check if email is in database
    const user = await this.findOne({email});

    //add missing skills to resume
    user.userResume.professional.skills = user.userResume.professional.skills.concat("\n" + missingSkills);
    await user.save();
    return user.userResume;
}
module.exports = mongoose.model('User', userSchema);