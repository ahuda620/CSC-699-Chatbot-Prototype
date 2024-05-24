const { ObjectId } = require('bson');
const mongoose = require('mongoose'); //importing mongoose
const Schema =  mongoose.Schema; //importing mongoose schema class

const jobSchema = new Schema({
    _id: {
        type: ObjectId,
        required: true,
    },
    jobTitle: {
        type: String,
        required: true,
    },
    jobCounty: {
        type: String,
        required: true,
    },
    jobState: {
        type: String,
        required: true,
    },
    jobCity: {
        type: String,
        required: true,
    },
    jobCompany: {
        type: String,
        required: true,
    },
    jobCompanyEmail: {
        type: String,
        required: true,
    },
    jobCompanyWebsite: {
        type: String,
        required: true,
    },
    jobDescription: {
        type: String,
        required: true,
    },
    jobRemote: {
        type: Boolean,
        required: true,
    },
    jobHourly: {
        type: Boolean,
        required: true,
    },
    jobSalary: {
        type: Boolean,
        required: true,
    },
    jobPay: {
        type: Number,
        required: true,
    },
    jobInternship: {
        type: Boolean,
        required: true,
    }
})

module.exports = mongoose.model('job', jobSchema);