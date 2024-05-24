const chatGPTResumeAnalysis = require('./ChatGPTResumeAnalysis');

test('POST "/user/chatGPT" should return an object', async()=> {
    const userInfo = "java";
    const jobInfo = "Certification as situation of merchandising to senior technician";
    const result = await chatGPTResumeAnalysis(userInfo, jobInfo);
    expect(result).not.toBeNull();
}, 20000);