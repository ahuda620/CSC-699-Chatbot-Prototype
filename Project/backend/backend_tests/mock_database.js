require('dotenv').config(); //importing dotenv module to use the enviorment variables in the .env file
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Company = require('../models/companyModel') ;

//Sample data to initialize mock jest Test Database
const users = [{
    "accountType": "personal",
    "firstName": "Spongebob",
    "lastName": "Squarepants",
    "email": "spongebob@test.com",
    "password": "$2b$10$7jT8yNHtQEm4xh33umRSHOFbpyd.YDfsz5BPguFdgR5BbK7n8V.eq",
    "userJobinterests": [],
    "userResume": {
      "professional": {
        "skills": "Fry cooking\nJelly fishing\nKung Fu",
        "summary": "Fry cook and star of the best children's show of all time",
        "work": [
          {
            "jobTitle": "Fry Cook",
            "company": "Krusty Krab",
            "startDate": "July 1999",
            "endDate": "Present",
            "jobDetails": "Fry cooking, serving customers, handling cash register, annoying Squidward",
          }
        ]
      },
      "certification": [],
      "education": [],
      "profile": {
        "address": "",
        "email": "spongebob@test.com",
        "firstname": "Spongebob",
        "github": "n/a",
        "lastname": "Squarepants",
        "linkedin": "n/a",
        "phone": "9999999999",
        "website": "n/a"
      }
    },
    "userJobs": [
      {
        "employer_name": "Long John Silver's",
        "employer_logo": "https://upload.wikimedia.org/wikipedia/commons/b/bd/Long_John_Silvers_logo.jpg",
        "employer_website": "http://www.ljsilvers.com",
        "employer_company_type": "Restaurant",
        "job_publisher": "ZipRecruiter",
        "job_id": "sm4u0-5eYsB4PI1LAAAAAA==",
        "job_employment_type": "FULLTIME",
        "job_title": "Fry Cook",
        "job_apply_link": "https://www.ziprecruiter.com/c/Long-John-Silvers/Job/Fry-Cook/-in-Lafayette,IN?jid=8c3c62592efd3dd4",
        "job_apply_is_direct": false,
        "job_apply_quality_score": 0.6976,
        "apply_options": [
          {
            "publisher": "ZipRecruiter",
            "apply_link": "https://www.ziprecruiter.com/c/Long-John-Silvers/Job/Fry-Cook/-in-Lafayette,IN?jid=8c3c62592efd3dd4",
            "is_direct": false
          },
          {
            "publisher": "Snagajob",
            "apply_link": "https://www.snagajob.com/jobs/797960148",
            "is_direct": true
          },
          {
            "publisher": "Lensa",
            "apply_link": "https://lensa.com/fry-cook-jobs/lafayette/jd/271690f85bf6e320f342119086dec0ec",
            "is_direct": false
          },
          {
            "publisher": "Jobilize",
            "apply_link": "https://www.jobilize.com/job/us-lafayette-fry-cook-long-john-silver-s-hiring-now-job-immediately",
            "is_direct": false
          }
        ],
        "job_description": "The Cook is responsible for preparing menu items to be served to restaurant guests; continually ensuring the highest quality by observing the appropriate procedures and cooking times; maintaining proper shortening levels and cleanliness while maintaining a constant awareness of projected sales and product requirements.\n\nThe successful Cook is able to:\n• Ensure every order is prepared as the guest requested, with the highest possible quality and as quickly as possible.\n• Treat all guests and team members with respect.\n• Maintain a safe, secure, and comfortable work area for guests and team members.\n• Ensure all ingredients and food products are properly stored, handled, prepared, and presented with the greatest care and concern for food safety.\n• Unload inventory from delivery trucks. Stock inventory using day dots to ensure proper rotation.\n• Clean interior of building as required; clean strains and filters in accordance with standard operating procedures.\n\nMinimum Requirements:\n• No previous experience required.\n• Ability to read and interpret documents such as safety rules, operating and maintenance instructions, procedure manuals and training materials.\n\nPhysical Demands/Working Conditions:\n\nWhile performing duties of this role, the employee is regularly required to stand and walk; talk and hear to communicate with employees; and taste/smell. The employee is frequently required to handle, feel and reach with hands and arms. The employee is occasionally required to sit, climb, or balance; and stoop, kneel, crouch, or crawl. The employee must occasionally lift and/or move up to 50 pounds. Specific vision abilities required for this role include peripheral vision and the ability to adjust focus.\n\nThe employee is occasionally exposed to cooking fumes. The noise level in the work environment is usually moderate.",
        "job_is_remote": false,
        "job_posted_at_timestamp": 1701043200,
        "job_posted_at_datetime_utc": "2023-11-27T00:00:00.000Z",
        "job_city": "Lafayette",
        "job_state": "IN",
        "job_country": "US",
        "job_latitude": 40.416702,
        "job_longitude": -86.87529,
        "job_benefits": null,
        "job_google_link": "https://www.google.com/search?gl=us&hl=en&rciv=jb&q=fry+cook&start=0&ibp=htl;jobs#fpstate=tldetail&htivrt=jobs&htiq=fry+cook&htidocid=sm4u0-5eYsB4PI1LAAAAAA%3D%3D",
        "job_offer_expiration_datetime_utc": "2023-12-28T00:00:00.000Z",
        "job_offer_expiration_timestamp": 1703721600,
        "job_required_experience": {
          "no_experience_required": true,
          "required_experience_in_months": null,
          "experience_mentioned": true,
          "experience_preferred": false
        },
        "job_required_skills": null,
        "job_required_education": {
          "postgraduate_degree": false,
          "professional_certification": false,
          "high_school": false,
          "associates_degree": false,
          "bachelors_degree": false,
          "degree_mentioned": false,
          "degree_preferred": false,
          "professional_certification_mentioned": false
        },
        "job_experience_in_place_of_education": false,
        "job_min_salary": null,
        "job_max_salary": null,
        "job_salary_currency": null,
        "job_salary_period": null,
        "job_highlights": {
          "Qualifications": [
            "No previous experience required",
            "Ability to read and interpret documents such as safety rules, operating and maintenance instructions, procedure manuals and training materials"
          ],
          "Responsibilities": [
            "The Cook is responsible for preparing menu items to be served to restaurant guests; continually ensuring the highest quality by observing the appropriate procedures and cooking times; maintaining proper shortening levels and cleanliness while maintaining a constant awareness of projected sales and product requirements",
            "Ensure every order is prepared as the guest requested, with the highest possible quality and as quickly as possible",
            "Treat all guests and team members with respect",
            "Maintain a safe, secure, and comfortable work area for guests and team members",
            "Ensure all ingredients and food products are properly stored, handled, prepared, and presented with the greatest care and concern for food safety",
            "Unload inventory from delivery trucks",
            "Stock inventory using day dots to ensure proper rotation",
            "Clean interior of building as required; clean strains and filters in accordance with standard operating procedures"
          ]
        },
        "job_job_title": "Cook",
        "job_posting_language": "en",
        "job_onet_soc": "35201500",
        "job_onet_job_zone": "2",
        "job_occupational_categories": [
          "35-2014.00: Cooks, Restaurant"
        ],
        "job_naics_code": "7222",
        "job_naics_name": "Limited-Service Eating Places"
      }
    ],
    "__v": 1
}]

const companies = [{
    "accountType": "company",
    "companyName": "Krusty Krab",
    "companyEmail": "krustykrab@test.com",
    "companyPassword": "$2b$10$iO7fsZD4iJd5PD3gF643c.4SlrpfY7YK7QInNOJ/Yo4LQjMoXLJG2",
    "companyWebsite": "krustykrab.com",
    "companyJobs": [],
    "__v": 0
  }]

module.exports.connect = async () => {
    await mongoose.connect(process.env.TESTDB_URI);
    User.create(users);
    Company.create(companies);
}

module.exports.disconnect = async () => {
    await User.collection.drop();
    await Company.collection.drop();
    await mongoose.connection.close();
}

module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
}

