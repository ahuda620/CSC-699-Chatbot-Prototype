require('dotenv').config(); //importing dotenv module to use the enviorment variables in the .env file
const port = process.env.PORT;
const app = require('./backend');
const mongoose = require('mongoose');
const readline = require('node:readline');

const { MongoDBAtlasVectorSearch } = require("@langchain/mongodb");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { ChatOpenAI } = require("@langchain/openai");
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents");
const { createRetrievalChain } = require("langchain/chains/retrieval");
const { Document } =  require("langchain/document");
const { createRetrieverTool } = require("langchain/tools/retriever");
const { pull } = require("langchain/hub");
const { createOpenAIToolsAgent, AgentExecutor } = require("langchain/agents");
const { HumanMessage, AIMessage } = require("@langchain/core/messages");

const puppeteer = require("puppeteer");

//pdf-parse
const fs = require('fs').promises;
const pdf = require('pdf-parse');

//langchain pdfjs-dist
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const chatHistory = [];

//Conenct to the mongose databse using the connection URI in the .env file
mongoose.connect(process.env.MONGO_URI)
   .then(()=>{
      app.listen(port, () =>{
         console.log(`Datebase connected and Express running at port ${port}\n`);
         userPrompt();
      })
   })
   .catch((error)=>{
      console.log(error);
   })

//This function is webscrape the muse website for interview questions/answers to store in the vector database
const webscrape = async() => {
   //Getting reference to LLM
   const llm = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo",
      temperature: 0,
   });

   const docs = [];
   const reducedDocs = [];
   
   const browser = await puppeteer.launch();
   const page = await browser.newPage();
   await page.goto('https://www.themuse.com/advice/interview-questions-and-answers');

   // const startIndex = 11;
   // const endIndex = 17;
   const startIndex = 11;
   const endIndex = 201;

   //Loop to scrape information from website at specified indexes of childNodes
   for(let i = startIndex; i<= endIndex; i+= 4){
      const questionAnswerindex = i + 2;
      
      const question = await page.evaluate((i) => {
         return document.getElementsByClassName('articleContainer_contentModule\_\_FkpWB')[0].childNodes[i].childNodes[1].textContent;
      }, i);

      const adviceParagraph = await page.evaluate((questionAnswerindex) => {
         return document.getElementsByClassName('articleContainer_contentModule\_\_FkpWB')[0].childNodes[questionAnswerindex].childNodes[0].textContent;
      }, questionAnswerindex);
      
      const exampleAnswer = await page.evaluate((questionAnswerindex) => {
         const domElement = document.getElementsByClassName('articleContainer_contentModule\_\_FkpWB')[0].childNodes[questionAnswerindex];
         let answer = '';
         for(let j = 4; j < domElement.childNodes.length -2; j++){
            answer += ` ${domElement.childNodes[j].textContent}`;
         }

         return answer;
      }, questionAnswerindex);
      
      const questionObject = {
         "question": question,
         "adviceParagraph": adviceParagraph,
         "exampleAnswer": exampleAnswer
      }

      const doc = new Document({ pageContent:JSON.stringify(questionObject) })
      docs.push(doc);
   }

   //Iterate through docs array and use LLM to summarize the advice paragraph and then store question details in reducedDocs array
   for(let i = 0; i < docs.length; i++){
      const result = await llm.invoke(
         `Here is an interview question: ${docs[i].question} and here is advice on how to answer the question : ${docs[i].adviceParagraph}. Summarize the advice down to its main and critical points and give the answer from the perspective that you are a career coach giving me advice. Make the answer in a paragraph format.`
      );

      // console.log(result.content);
      docs[i].adviceParagraph = result.content;

      const reducedDoc = new Document({ pageContent:JSON.stringify(docs[i]) });
      reducedDocs.push(reducedDoc);
      //console.log(reducedDocs[i]);
   }

   await browser.close();
   
   return reducedDocs;
}

/*This is the main function for the Chatbot that has the API calls to ChatGPT.
  It's in the server file because I wanted to test the chatbot in the terminal first. 
  However, if in the future, the chatbot needs to have a frontend, this function should probably be moved to a different location along with the webscrape function above
*/
const langchain = async (userInput) => {

   /*---Getting reference to vector store collections in mongodb database---*/
   const client = await mongoose.connection.getClient();
   const resumeCollection = client.db("jobdatabase").collection("resume-vectorstore");
   const interviewCollection = client.db("jobdatabase").collection("interviewquestions-vectorstore");

   const jobDescription = `Remote Job, 1+ Year Experience Annual Income: $60K - $65K, Onsite A valid work permit is necessary in the US/Canada About us: Patterned Learning is a platform that aims to help developers code faster and more efficiently. It offers features such as collaborative coding, real-time multiplayer editing, and the ability to build, test, and deploy directly from the browser. The platform also provides tightly integrated code generation, editing, and output capabilities. Description: You will work closely with our senior developers to design, develop, and maintain high-quality websites and web applications.
   This is an excellent opportunity to gain hands-on experience in a collaborative environment and contribute to exciting projects. Responsibilities: • Collaborate with the development team to understand project requirements and design web solutions • Write clean, efficient, and well-structured code using HTML, CSS, and JavaScript • Assist in the development and implementation of responsive and user-friendly web interfaces • 
   Integrate front-end designs with back-end functionality using appropriate technologies • Conduct thorough testing and debugging to ensure seamless functionality • Assist in website maintenance, updates, and enhancements • Stay up-to-date with industry trends and emerging web development technologies • Collaborate with cross-functional teams to deliver projects on time and within scope • Document technical specifications, project details, and development processes Qualifications: • Bachelors degree in Computer Science, Web Development, or a related field • Solid understanding of web development principles and best practices • Proficiency in HTML, CSS, and JavaScript • Familiarity with front-end frameworks such as Bootstrap or Foundation • Basic understanding of back-end development technologies (e.g., PHP, Python, or Ruby) • Knowledge of version control systems (e.g., Git) • Experience with responsive web design and mobile-first development • Strong problem-solving and analytical skills • Excellent communication and teamwork abilities • Self-motivated with a strong desire to learn and grow as a developer 
   Preferred Qualifications: • Previous experience with web development projects (personal or professional) • Knowledge of JavaScript frameworks/libraries (e.g., React, Angular, or Vue.js) • Familiarity with content management systems (e.g., WordPress, Drupal, or Joomla) • Understanding of SEO principles and best practices • Experience with web accessibility standards and guidelines • Knowledge of web security best practices Why Patterned Learning LLC? Patterned Learning can provide intelligent suggestions, automate repetitive tasks, and assist developers in writing code more effectively. This can help reduce coding errors, improve productivity, and accelerate the development process. The pattern recognition is particularly relevant in the context of coding. Neural networks, especially deep learning models, are commonly employed for pattern detection and classification tasks. These models simulate human decision-making and can identify patterns in data, making them well-suited for tasks like code analysis and generation.`
   
   
   /*---Interview Question and Answer Website Document Loading---*/
   //const interviewQuestiondocs = await webscrape();
   
   //Splitting document into smaller chunks
   //const splitter = new RecursiveCharacterTextSplitter();
   //const splitDocs = await splitter.splitDocuments(docs);
   /*---Local Resume PDF file Document Loading---*/
   const loader = new PDFLoader("ResumeDemo.pdf", {splitPages: false,});
   const docs = await loader.load();
   
   //Vectorizing the document and storing it in the mongodb database
   //Splitting document into smaller chunks
   const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,});
   const splitDocs = await splitter.splitDocuments(docs);
   
   //Setting configuration for OpenAIEmbeddings
   const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY, // In Node.js defaults to process.env.OPENAI_API_KEY
      batchSize: 512, // Default value if omitted is 512. Max is 2048
      modelName: "text-embedding-3-large",
      dimensions: 1536,
      stripNewLines: true
   });

   /*---Create vectorstore from new collection in database---*/
   //Creating new vectorStore collection for webscraped interview question documents
   // const intervewQuestionvectorStore = await MongoDBAtlasVectorSearch.fromDocuments(
   //    interviewQuestiondocs,
   //    embeddings,
   //    {
   //       collection: interviewCollection,
   //       indexName: "interviewquestion-index", // The name of the Atlas search index. Defaults to "default"
   //       textKey: "text", // The name of the collection field containing the raw content. Defaults to "text"
   //       embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
   //    }
   // );

   //Create vectorstore from new documents
   // const newvectorStore = await MongoDBAtlasVectorSearch.fromDocuments(
   //    splitDocs,
   //    embeddings,
   //    {
   //       collection: resumeCollection,
   //       indexName: "resumeIndex", // The name of the Atlas search index. Defaults to "default"
   //       textKey: "text", // The name of the collection field containing the raw content. Defaults to "text"
   //       embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
   //    }
   // );

   /*---Create vectorstore from pre-existing collection in database---*/
   const intervewQuestionvectorStore = new MongoDBAtlasVectorSearch(new OpenAIEmbeddings({}),{
      collection: interviewCollection,
      indexName: "interviewquestion-index", // The name of the Atlas search index. Defaults to "default"
      textKey: "text", // The name of the collection field containing the raw content. Defaults to "text"
      embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
   });
   
   //Create vectorstore from pre-existing collection in database
   const resumevectorStore = new MongoDBAtlasVectorSearch(new OpenAIEmbeddings({}),{
      collection: resumeCollection,
      indexName: "resumeIndex", // The name of the Atlas search index. Defaults to "default"
      textKey: "text", // The name of the collection field containing the raw content. Defaults to "text"
      embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
   });

   //Getting reference to LLM ChatGPT in this case
   const llm = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4o",
      temperature: 0,
   });

   //Actor Agent Prompt
   const MEMORY_KEY = "chat_history"; //To pass array that holds records chat messages for history
   const actorAgentprompt = ChatPromptTemplate.fromMessages([
      ["system", `You are a career coach who is giving advice on how to answer job interview questions.
         You are provided interview questions and advice on how to answer them.
         Here is the job description of the job that the user is applying to: ${jobDescription}.
         Here is the question the user is asking you: ${userInput}.

         You may also be provided feedback from a hiring manager(your boss) on advice that you have given to a user in the past along with the correspoding interview question. In this case use the feedback from your boss as if it was your own to improve your answer and don't mention that the feedback was from your boss.
         Your answer should state the interview question, your advice on how to answer it, and an example answer. Please try to keep the advice short and to the point.

         In the case where you are not provided feedback from your boss, provide an example answer to the interview question using the provided context.
         It is crucial to provide an answer with the key elements of the advice as in the example question and answers below using specific information from the user's resume. Tailor the answer to the job that user is applying for if possible. Use the advice to explain why your answer is a good answer. Here are some example questions and generic answers that you will try to mimic using information from the user's resume:

         For personal interview questions that require more specific/personal information from the user, that is normally not found on resumes, to form a good answer, you must state that the question is a personal question that requires the user's personal experience to provide a good answer, then provide an example answer using generic information that is still related to the information in their resume. You must state that you are using generic information for a response for this type of question. You must try to copy the example answers using information from the user's resume. Here are examples of questions and answers that fall into this category below:
         
      `],
      new MessagesPlaceholder(MEMORY_KEY),
      ["human", "{input}"],
      new MessagesPlaceholder("agent_scratchpad"),
    ]);
   
   //Initializing Retrievers to retrieve the relavent documents/embeds from the database 
   const interviewQuestionsretriever = intervewQuestionvectorStore.asRetriever();
   const resumeRetriever = resumevectorStore.asRetriever();

   //Creating Retriever Tools for Agent
   //NAME CANNOT HAVE SPACES
   const interviewQuestionstool = await createRetrieverTool(interviewQuestionsretriever, {
      name: "interview_questions_example_answers",
      description: `Search for information, advice, and examples on how to answer job interview questions. Use specific information from user's resume when giving examples.
                    If you cannot find enough information from the user's resume to form a good answer, state that the user's resume is does not contain enough information to form a good answer.`
   });

   const resumeTool = await createRetrieverTool(resumeRetriever, {
      name: "users_resume",
      description: `Search for information about the user's resume. 
                    You must use this for every question the user asks and reference specific information from it as much as possible related to their question! 
                    Do not make up information that is not from the user's resume.`
   });
   
   const tools = [interviewQuestionstool, resumeTool];
   
   //Actor Agent Setup
   const actorAgent = await createOpenAIToolsAgent({
      llm,
      tools,
      prompt: actorAgentprompt,
    });

   const actorAgentexecutor = new AgentExecutor({
      agent: actorAgent,
      tools,
      verbose: false,
   });

   //Critique Agent Setup
   const critiqueAgentprompt = ChatPromptTemplate.fromMessages([
      ["system", `You are the boss of a career coach and you are grading the advice they give to an applicant on how to answer a job interview question out of 10 points.
         Here is the interview question: ${userInput}
         You are given the career coach's advice along with their example answer to the interview question that the provided to the user. It is your job to grade these responses out of 10.
         You are also provided the applicant's resume and here is the job description of the job that the applicant is applying to: ${jobDescription}.

         If the grade is an 8 or higher, reply with only the message: "TRUE".
         If the grade is an 7 or less, provide feedback on how the advice can be improved along with an example answer. 
         Only focus on major critiques, ignore minor ones.
         
         Do not critique the career coach's answer based on if they used an example from the applicant's personal experience or not. Generic answer's are okay since the resume is not expected to have personal experiences listed on them.
         In general the career coach's advice and example answers have to be tied to the applicant's resume since we want the advice to be personalized even for generic answers.
         
         Format your answer as such:
         Interview question: Put the interview question here
         Advice: Put the career coaches answer here
         Grading feedback: Put your feedback here
      `],
      // new MessagesPlaceholder(MEMORY_KEY),
      ["human", "{input}"],
      new MessagesPlaceholder("agent_scratchpad"),
    ]);

   const critiqueAgent = await createOpenAIToolsAgent({
      llm,
      tools,
      prompt: critiqueAgentprompt,
   });

   const critiqueAgentexecutor = new AgentExecutor({
      agent: critiqueAgent,
      tools,
      verbose: false,
   });

   //Invoke Agents for Initial Responses
   let actorAgentresult = await actorAgentexecutor.invoke({
      input: userInput,
      chat_history: chatHistory,
   });

   let critiqueAgentresult = await critiqueAgentexecutor.invoke({
      input: actorAgentresult.output
   });

   let iterations = 0;
   //While Critique Agent does not say the output of the Actor Agent is good enough, refine the output of the Actor Agent iteratively
   while(critiqueAgentresult.output !== "TRUE"){ 
      //Cap the amount of iterations this loop can do, to avoid overloading the budget for API calls
      if(iterations >= 3){
         break;
      }

      //Invoke Actor Agent AGAIN with the Critique Agent's repsonse to generate a new refined output of the Actor Agent
      actorAgentresult = await actorAgentexecutor.invoke({
         input: critiqueAgentresult.output,
         chat_history: chatHistory,
      });

      //Invoke critique agent AGAIN with the newly refined output of the Actor Agent to determine if the output is good enough
      critiqueAgentresult = await critiqueAgentexecutor.invoke({
         input: actorAgentresult.output,
         chat_history: chatHistory,
      });

      iterations++;
      console.log(`Number of iterations is ${iterations}`);
   }
   
   //Store user question and chatbot answer into chat message history array
   chatHistory.push(new HumanMessage(userInput));
   chatHistory.push(new AIMessage(actorAgentresult.output));

   return actorAgentresult.output; //return improved answer back to user
}

//This function is to test the chatbot through the console
const userPrompt = async () => {
   console.log(`
***** 
Welcome to Easyconnect Chatbot! I'm here to help you ace your interviews with personalized advice based on your resume. 
Just type in your question to get started on your journey to success! If you ever want to end the chat, simply type 'exit'.\n*****\n`)

   const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
   });
   rl.setPrompt('');
   rl.prompt(false);
   rl.on('line', async (userInput) => {
      rl.prompt(false);
      if(userInput.localeCompare("exit") == 0){
         rl.close();
         console.log("\n*****\nThank you for chatting with Easyconnect Chatbot! Have a great day!\n*****\n");
         process.exit(0);
      }
      else{
         rl.pause();
         new HumanMessage(userInput);
         const result = await langchain(userInput);
         new AIMessage(result);
         console.log(`\n*****\n${result}\n*****\n`);
         rl.resume();
      }
   });
};
