const axios = require('axios');

const searchJobPost = async (search, page) => {
    try {
        const options = {
            method: "GET",
            url: `https://jsearch.p.rapidapi.com/search`,
            headers: {
                "X-RapidAPI-Key": process.env.REACT_APP_RAPIDAPI_KEY,
                "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
            },
            params: {
                query: search,
                page: page.toString(),
            },
        };
        const response = await axios.request(options);
        return response.data.data;
    } catch (error) {
        console.log(error);
    }
};

module.exports = searchJobPost;
