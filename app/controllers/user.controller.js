const db = require("../models");
const bcrypt = require("bcryptjs");
const User = db.user;
const Survey_Forms = db.survey_forms;
const Survey_Forms_Response = db.survey_forms_response;
const Role = db.role;

exports.allUser = (req, res) => {
    Role.find({
        name: {$in: 'user'}
    })
        .then(roles => {
            let userId = roles.map(role => role._id)
            User.find({
                roles: userId
            })
                .populate("roles", "-__v")
                .exec((err, drives) => {
                    res.send(drives);
                });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Users."
            });
        });
};

exports.userFind = (req, res) => {
    try {
        Role.find({
            name: {$in: 'user'}
        })
            .then(roles => {
                if (roles) {
                    let userId = roles.map(role => role._id);
                    User.find({roles: userId})
                        .populate("roles", "-__v")
                        .exec((err, drives) => {
                            res.send(drives);
                        });
                } else {
                    res.send({});
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving Users."
                });
            });
    } catch (e) {
        res.status(200).send("Admin Content.");
    }
};

exports.findAll = (req, res) => {
    Role.find({
        name: {$in: 'user'}
    })
        .then(roles => {
            let userId = roles.map(role => role._id)
            User.find({
                username: req.params.username,
                roles: userId
            })
                .populate("roles", "-__v")
                .exec((err, drives) => {
                    res.send(drives);
                });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Users."
            });
        });
};
