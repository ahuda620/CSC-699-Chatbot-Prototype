# CSC6990-Easy Connect

## Background
This project is a continuation of a Job Board website me and my group members made for CSC-648 (Software Engineering). For CSC-699 (Independent Study), my goal was to add a Chatbot to the website that can assist the user in answering common interview questions by providing example answers that utilize the information from the user's resume, making the answers personalized. The user's resume is stored in a collection in the MongoDB database as vector embeddings. At the time of writing this, I have finished implementing a test backend version of the Chatbot, but I did not have enough time to implement a front end for it. This is why all the code related to the Chatbot is in the `server.js` file in the `backend` folder.  The code relating to the Chatbot should probably be moved to its own file/files in the future. The `server.js` file is the main entry point for the backend portion of this website. It is also where the website connects to the MongoDB database. 
## Description
The input to the Chatbot is the user asking how to answer a specific interview question of their choice. The Chatbot then provides an example answer (utilizing information from the user's resume when applicable) to that question along with advice on how to answer the question. 

It utilizes Langchain and ChatGPT-4o for its functionality. The LLM can be changed if needed. It also uses the SELF-REFINE approach, which is described in this [research paper](https://arxiv.org/pdf/2303.17651), to provide better answers to the user. By utilizing Langchain, we can pass in the user's resume, and the advice from this [site](https://www.themuse.com/advice/interview-questions-and-answers), which explains how to best answer common interview questions, and the job description of the job that the user is applying to (hard coded in atm in the `server.js` file) as additional context to ChatGPT-4o to help the LLM answer the user's prompt. 

## Technologies Used
 - Javascript/Node.js *(Programming Language)*
 - Express *(Connecting backend to frontend)*
 - MongoDB Atlas *(Database)*
 - React *(Frontend)*
 - Axios *(Connecting frontend to backend)*
 - Langchain *(Extends LLMs capabilities)*
 - Puppeteer *(for webscraping this [site](https://www.themuse.com/advice/interview-questions-and-answers))*
 - Langchain PDFLoader *(This was used to load the user's resume which was in PDF format into the program, however now that you can upload files to ChatGPT-4o, this is probably not needed anymore)*

## APIs Used
 - ChatGPT-4o *(I already had a paid plan with OpenAI so I didn't have to worry about API calls cost, but future devs might)*
 - [JSearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch) *(This is for getting job listings to list on the website, not related to the Chatbot)*
## **Api Keys/ Access Needed**
1. OpenAPI Key
2. RapidAPI/JSearch API Key
3. Access to the MongoDB Atlas Project (ask Professor Song for an invite)

## Setup (Using Sample Resume)
**These are the steps to take if you want to use the pre-existing data in the database and don't want to load your own resume in**
Sample Resume can be found [here](https://www.cmu.edu/career/documents/sample-resumes-cover-letters/sample-resumes_scs.pdf) at page 4

**BEWARE** 
Due to the SELF-REFINE code starting at line 343 in `server.js` file, this code will make 2 API calls to ChatGPT-4o each iteration which can accumalate API costs quickly. It is capped at 4 Iterations currently. This can be changed to your needs.

1. Clone the repo `https://github.com/ahuda620/EasyConnect.git`
2. In the `.env` file in the `backend` folder make sure the enviorment variables are set
    ```
    PORT=4000
    MONGO_URI=mongodb+srv://user:pass@cluster0.vymkyhl.mongodb.net/jobdatabase
    SECRET=SiEyU5UXhnURaZgbY3viTdpDun9aAnZgwT
    OPENAI_API_KEY=YOUR_API_KEY
    ```
    - Replace `YOUR_API_KEY` with your own OpenAI key
    - The `SECRET` enviorment variable is used for authentication for the login system of the website
    - PORT 4000 is the port that the backend runs on
3. In the `.env` file in the `frontend` folder make sure the enviorment variables are set
    ```
    REACT_APP_RAPIDAPI_KEY=YOUR_API_KEY
    ```
    - Replace `YOUR_API_KEY` with your own RapidAPI/JSearch API Key
4. Navigate to the `backend` folder in the terminal
    - `cd Project/backend`
5. Type `npm install` to install the backend dependencies
6. Type `npm start` to start the backend of the website and the Chatbot
7. Give a prompt to the Chatbot `How do I answer "Tell me about yourself"?` and push enter
8. Wait for the Chatbot to generate an answer
    - Note: This can take a couple minutes due to the SELF-REFINE approach
    - Note: If you just wanted to start the backend for the website, you don't have to type anything to the Chatbot after `npm start`
    - The output should look similar to this:
![Chatbot Output](chatbot_output_example.png)
9. You can type `exit` if you want to exit the Chatbot. Note: This will terminate the program with its current implementation
10. If you want to start the frontend for the website, make a another seperate terminal (while having the backend terminal still running), navigate to the `frontend` folder in the terminal
    - `cd Project/frontend`
11. Type `npm install` to install the frontend dependencies
12. Type `npm start` to start the frontend of the website
13. You should see the homepage of the website at `http://localhost:3000`:
![Homepage](homepage.png)
14. Test if your RapidAPI/JSearch API Key is working by performing a search for a job
15. You should see some job listings:
![Example Search](examplesearch.png)

## Setup (Using your Own Resume)
1. Make sure steps 1-5 are done in the previous section
2. Dowload a local copy of your resume in PDF format and put it in the `backend` folder
3. Name your resume file `ResumeDemo.pdf`. On line 138, thats where the program uses `PDFLoader` from Langchain to load your pdf and store it in the variable called `docs`
4. Make a new collection in the database to store the vector embeds of your resume
    - Make a note of what you named the collection
5. Make a search index for that collection by following the steps under the `Creating an Index` section on the [Langchain docs](https://js.langchain.com/v0.1/docs/integrations/vectorstores/mongodb_atlas/)
    - When making the search index, be sure to change the `numDimensions` to 1536 instead of 1024 for OpenAI embeddings
    - Be sure to select your collection on the left side when making the search index aswell
    - Make a note of what you named the search index
6. Go back to the `server.js` file since your going to have to edit some lines in there
7. On line 122 in the `server.js` file, change `"resume-vectorstore"` to your collection name
8. Uncomment lines 171-180
    - Make sure to change the value for `indexName` to the name you used when making the search index
9. Comment lines 183-335
10. Save your changes and then start the program again by typing `npm start` in the terminal
    - Type something in the terminal when the Chatbot prompts you
    - You will get an error message and the program will crash, ignore it
11. Check the your collection in the database, it should now have the embeddings of your resume in it
12. Recomment lines 171-180
    - This is important because otherwise, you will be loading your resume info again into your collection, so your collection will have duplicated information which will interfere with data retrieval
13. Uncomment lines 183-335
14. Save your changes and run the program normally. The Chatbot should function as intended using your resume info

