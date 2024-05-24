const db = require('./mock_database');
const request = require('supertest');
const app = require('../backend');
const User =  require('../models/userModel');
const Company =  require('../models/companyModel');

beforeAll(async () => {
    await db.connect();
})

afterAll(async () => {
    await db.disconnect();
})

//Login Unit Tests
describe("Login Unit Tests", () => {
    //Personal Account Login Unit Tests
    describe("POST /user/login", () => {
        describe("Test Login route with CORRECT user account login", () => {
            test("should respond with a 200 status code", (done) => {
                request(app)
                    .post("/user/login")
                    .send({
                        email: "spongebob@test.com",
                        password: "qwerty1234",
                        accountType: "personal"
                    })
                    .expect(200, done)
            })
        })
        describe("Test Login route with INCORRECT user account login", () => {
            test("should respond with a 400 status code", (done) => {
                request(app)
                    .post("/company/login")
                    .send({
                        email: "wrongemail@test.com",
                        password: "qwerty1234",
                        accountType: "personal"
                    })
                    .expect(400,done);
            })
        })
    })

    //Company Account Login Tests
    describe("POST /company/login", () => {
        describe("Test Login route with CORRECT company account login", () => {
            test("should respond with a 200 status code", (done) => {
                request(app)
                    .post("/company/login")
                    .send({
                        companyEmail: "krustykrab@test.com",
                        companyPassword: "qwerty1234",
                        accountType: "company"
                    })
                    .expect(200,done)
            })
        })
        describe("Test Login route with INCORRECT company account login", () => {
            test("should respond with a 400 status code", (done) => {
                request(app)
                    .post("/company/login")
                    .send({
                        companyEmail: "wrongemail@test.com",
                        companyPassword: "qwerty1234",
                        accountType: "company"
                    })
                    .expect(400,done);
            })
        })
    })
})

//Registration Unit Tests
describe("Registration Unit Tests", () => {
    //Personal Account Signup Tests
    describe("POST /user/signup", () => {
        describe("Test Personal Account Signup Route", () => {
            test('should respond with a 200 status code', (done) => {
                request(app).post("/user/signup")
                    .send({
                        firstName: "Unit",
                        lastName: "Test",
                        email: "unittest@test.com",
                        password: "qwerty1234",
                        accountType: "personal"
                    })
                    .expect(200,done)
            })
        })
        describe("Test Personal Account Signup Route with Existing Email", () => {
            test('should respond with a 400 status code', (done) => {
                request(app).post("/user/signup")
                    .send({
                        firstName: "Unit",
                        lastName: "Test",
                        email: "spongebob@test.com",
                        password: "qwerty1234",
                        accountType: "personal"
                    })
                    .expect(400,done)
            })
        })
    })

    //Company Account Signup Tests
    describe("POST /company/signup", () => {
        describe("Test Company Account Signup Route", () => {
            test('should respond with a 200 status code', (done) => {
                request(app).post("/company/signup")
                    .send({
                        companyName: "Unit Test Company",
                        companyEmail: "unittestcompany@test.com",
                        companyPassword: "qwerty1234",
                        companyWebsite: "unittestcompany.com",
                        accountType: "company"
                    })
                    .expect(200,done)
            })
        })
        describe("Test Company Account Signup Route with Existing Email", () => {
            test('should respond with a 400 status code', (done) => {
                request(app).post("/user/signup")
                    .send({
                        companyName: "Unit Test Company",
                        companyEmail: "krustykrab@test.com",
                        companyPassword: "qwerty1234",
                        companyWebsite: "unittestcompany.com",
                        accountType: "company"
                    })
                    .expect(400,done)
            })
        })

    })
})



