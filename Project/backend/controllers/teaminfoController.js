const teamInfo = require('../models/teaminfoModel');

const get_teaminfo = async (req,res) =>{
    const teamMembers = await teamInfo.find({});
    res.status(200).json(teamMembers);
}

const get_single_teaminfo = async (req, res) =>{
    const name = req.params.name;
    const member = await teamInfo.find({"teamName": name});
    res.status(200).json(member);
}

module.exports = {
    get_teaminfo,
    get_single_teaminfo
}
