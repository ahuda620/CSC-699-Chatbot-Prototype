const { ObjectId } = require('bson');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema
const teamSchema = new Schema({
    _id: {
        type: ObjectId
    },
    teamName: {
        type: String
    },
    teamTitle: {
        type: String
    },
    teamPicture: {
        type: String
    },
    teamEmail: {
        type: String
    },
    teamGitHub: {
        type: String
    },
    teamFavshow: {
        type: String
    },
}, { collection: 'teaminfo'});

//Model
module.exports = mongoose.model('Teaminfo', teamSchema);