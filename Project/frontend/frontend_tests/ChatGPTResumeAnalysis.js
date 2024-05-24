const axios = require('axios');
const chatGPTResumeAnalysis = async (userInfo, jobInfo) => {
    /*Set what attributes of userResume and jobPost you want to send to chatGPT in the data object*/
    const data = {
        userResumeInfo: userInfo,
        jobPostInfo: jobInfo,
    }
    try{
        console.log("getting ai response");
        const response = await axios.post('http://localhost:4000/user/chatGPT', data);
        //console.log("response.data.chatgptresponse: ", response.data.chatgptresponse);
        return response.data.chatgptresponse; //display chatgpt response to console

    }catch(error){
        return null;
    }
}

module.exports = chatGPTResumeAnalysis;

