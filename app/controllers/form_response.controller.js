const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");

const Survey_Forms = db.survey_forms;
const Survey_Forms_Response = db.survey_forms_response;

// Submit Single Form's Response & Update Form Response, Old response will be store in history.
exports.createFormResponse = (req, res) => {
    try {
        // Find Form
        Survey_Forms
            .findById(req.body.form_id)
            .exec((err, form) => {
                // console.log('form', form);
                if (err && !form) {
                    console.log(err.stack);
                    return res.status(200).send({err: err.stack, 'msg': "form not found"});
                } else {
                    // var id = mongoose.Types.ObjectId(form.shared_to);
                    form.shared_to = form.shared_to.toString();
                    form._id = form._id.toString();
                    // console.log('form2222', form.shared_to.toString());
                    // Check form is open for all or not ?
                    if (form && form.shared_to !== "") {
                        // Check form is shared with user of not
                        if (form.shared_to.includes(req.userId) === -1) {
                            return res.status(401).send({'msg': "Not authorised user to submit response"});
                        }
                    }
                    // Form is Open for All OR user is Able to submit response
                    // Find Existing Response of Form for User
                    // Do user has submitted previous response ?
                    Survey_Forms_Response
                        .find({
                            form_id: req.body.form_id,
                            created_by: req.userId
                        })
                        .exec((err, Existing_Form_Response) => {
                            if (err) {
                                console.log(err.stack);
                                return res.status(500).send({err: err.stack});
                            } else {
                                if (Existing_Form_Response.length) {
                                    Existing_Form_Response = Existing_Form_Response[0];
                                    // User has submitted response for this form
                                    // Updating that record with history
                                    let history = {};
                                    let datetime1 = Date.now().toString();
                                    history[datetime1] = JSON.stringify(Existing_Form_Response.answers);
                                    Existing_Form_Response.history = JSON.stringify(history);
                                    Existing_Form_Response.answers = req.body.answers;
                                    Survey_Forms_Response.findByIdAndUpdate(Existing_Form_Response._id.toString(), Existing_Form_Response, (err, response) => {
                                        if (err) {
                                            console.log('Existing_Form_Response err.stack', err.stack);
                                            return res.status(500).send({err: err.stack});
                                        } else {
                                            // console.log('Existing_Form_Response.history', Existing_Form_Response);
                                            return res.status(200).send(Existing_Form_Response);
                                        }
                                    });
                                } else {
                                    // User is submitting New response for this form
                                    const form = new Survey_Forms_Response({
                                        answers: req.body.answers,
                                        history: "",
                                        created_by: req.userId,
                                        form_id: req.body.form_id
                                    });
                                    form.save((err, response) => {
                                        if (err) {
                                            console.log(err.stack)
                                            return res.status(500).send({err: err.stack});
                                        } else {
                                            return res.status(200).send(response);
                                        }
                                    });
                                }
                            }
                        });
                }
            });
    } catch (e) {
        console.log(e.stack);
        return res.status(200).send({err: e.stack});
    }
};

// Extract Single Form's All Responses
exports.getFormAllResponse = (req, res) => {
    try {
        Survey_Forms_Response
            .find({
                form_id: req.params.form_id
            })
            .exec((err, form) => {
                if (err) {
                    console.log(err.stack)
                    return res.status(500).send({err: err.stack});
                } else {
                    return res.status(200).send(form);
                }
            });
    } catch (e) {
        console.log(e.stack);
        return res.status(500).send({err: e.stack});
    }
};

// Extract Single Response of Form
exports.getSingleResponse = (req, res) => {
    try {
        Survey_Forms_Response
            .findById(req.params.form_response_id)
            .exec((err, form) => {
                if (err) {
                    console.log(err.stack)
                    return res.status(500).send({err: err.stack});
                } else {
                    return res.status(200).send(form);
                }
            });
    } catch (e) {
        console.log(e.stack);
        return res.status(500).send({err: e.stack});
    }
};
