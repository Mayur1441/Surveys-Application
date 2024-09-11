const app = require("../server");
const Post = require("../models/Post");
const mongoose = require("mongoose");
const supertest = require("supertest");

beforeEach((done) => {
    mongoose.connect(process.env.MONGODB_URL,
        {useNewUrlParser: true, useUnifiedTopology: true},
        () => done());
});

afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
        mongoose.connection.close(() => done())
    });
});

test("GET /api/form/getall", async () => {
    await supertest(app).get("/api/form/getall")
        .expect(200)
        .then((response) => {
            // Check type and length
            expect(Array.isArray(response.body)).toBeTruthy();
            if (response.length > 0) {
                // Check data
                expect(response.body[0]._id).toBe(response._id);
                expect(response.body[0].title).toBe(response.title);
            }
        });
});

test("POST /api/form/create", async () => {
    const data = {
        "title": "Form Title Text 1",
        "created_by": "66dfe639935a4bed2363bc72",
        "shared_to": ["66dfe6af935a4bed2363bc7b", "66dfe639935a4bed2363bc72"],
        "questions": {
            "Title": "Form Title Text",
            "Description": "",
            "questions_1": "Name",
            "Type_1": "MCQ",
            "option-1": [
                "Mayur",
                "Hetal",
                "Dhiyu"
            ],
            "questions_2": "Hobbie",
            "Type_2": "Checkbox",
            "option-2": [
                "Reading",
                "Watching",
                "Horse Riding"
            ],
            "questions_3": "Village",
            "Type_3": "Paragraph",
            "option-3": "",
            "questions_4": "Study",
            "Type_4": "Radio",
            "option-4": [
                "10th",
                "12th",
                "Graduation",
                "Post Graduation"
            ],
            "questions_5": "DOB",
            "Type_5": "DATE",
            "option-5": ""
        }
    };

    await supertest(app).post("/api/form/create")
        .send(data)
        .expect(200)
        .then(async (response) => {
            // Check the response
            expect(response.body._id).toBeTruthy();
            expect(response.body.title).toBe(data.title);
            expect(response.body.content).toBe(data.content);

            // Check data in the database
            const post = await Post.findOne({_id: response.body._id});
            expect(post).toBeTruthy();
            expect(post.title).toBe(data.title);
            expect(post.content).toBe(data.content);
        });
});

test("POST /api/auth/signup", async () => {
    const data = {
        "username": "mayur1",
        "firstname": "mayur1",
        "mobile": "9874563211",
        "email": "mayur1@gmail.com",
        "password": "123456789",
        "roles": "user"
    };

    await supertest(app).post("/api/auth/signup")
        .send(data)
        .expect(200)
        .then(async (response) => {
            // Check the response
            expect(response.body._id).toBeTruthy();
            expect(response.body.username).toBe(data.username);
            expect(response.body.firstname).toBe(data.firstname);
        });
});

test("POST /api/auth/signin", async () => {
    const data = {
        "email": "mayur1@gmail.com",
        "password": "123456789"
    };

    await supertest(app).post("/api/auth/signin")
        .send(data)
        .expect(200)
        .then(async (response) => {
            // Check the response
            expect(response.body._id).toBeTruthy();
            expect(response.body.accessToken).toBe(data.accessToken);
            expect(response.body.username).toBe(data.username);
            expect(response.body.firstname).toBe(data.firstname);
        });
});

test("GET /api/form/getFormAllResponse/", async () => {

    await supertest(app).get("/api/posts/" + "66e187e638040bb2ce8ba723")
        .expect(200)
        .then((response) => {
            expect(response.body._id).toBe(post.id);
            expect(response.body.title).toBe(post.title);
        });
});
