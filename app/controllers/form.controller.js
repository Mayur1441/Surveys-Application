// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
const db = require("../models");
const Survey_Forms = db.survey_forms;

async function createQuestionObj(obj) {
    // console.log('createQuestionObj');
    let result = [];
    /*let obj = {
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
    };*/
    await Object.entries(obj).forEach(([key, value]) => {
    // console.log(`key = ${key}, value= ${value}`);
        let temp = {};
        if (key.includes('questions_')) {
            const counter = key.replace('questions_', '');
            // console.log(obj['Type_' + counter])
            temp['question' + counter] = value;
            temp['Type' + counter] = obj['Type_' + counter];
            temp['option' + counter] = obj['option-' + counter];
            result.push(temp);
        }
    });
    // console.log('createQuestionObj result', result);
    return JSON.stringify(result);
}

// Create Form
exports.createForms = async (req, res) => {
    try {
        let data = req.body;
        const form = new Survey_Forms({
            title: data.title,
            created_by: data.created_by,
            shared_to: data.shared_to,
            questions: await createQuestionObj(data.questions),
        });
        form.save((err, form) => {
            if (err) {
                return res.status(500).send({err: err});
            } else {
                return res.status(200).send({done: form});
            }
        });
    } catch (e) {
        console.log(e)
        return res.status(500).send({error: e.stack});
    }
};

// Get All Forms of Single User
exports.getAllForms = (req, res) => {
    try {
        Survey_Forms.find({"created_by": "66dfe639935a4bed2363bc72"})
            .populate("created_by", "shared_to")
            .exec((err, form) => {
                if (err) {
                    console.log(err.stack);
                    return res.status(500).send({err: err.stack});
                } else {
                    return res.status(200).send(form);
                }
            });
    } catch (e) {
        console.log(e.stack);
        return res.status(500).send({error: e.stack});
    }
};
