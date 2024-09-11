const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;
const Role = db.role;

// this Middleware will verify Token and set userID on based on token
verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({message: "No token provided!"});
    }
    jwt.verify(token,
        process.env.SECRET,
        (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: "Unauthorized!",
                    token: token
                });
            }
            req.userId = decoded.id;
            next();
        });
};

// this Middleware will check User's Role is Admin or Not on based on token
isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        Role.find(
            {
                _id: {$in: user.roles}
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({message: err});
                    return;
                }
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "admin") {
                        next();
                        return;
                    }
                }
                res.status(403).send({message: "Require Admin Role!"});
            }
        );
    });
};

// this Middleware will check Use's Role is User or Not on based on token
isUser = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        Role.find(
            {
                _id: {$in: user.roles}
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({message: err});
                    return;
                }
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "user") {
                        next();
                        return;
                    }
                }
                res.status(403).send({message: "Require user Role!, login with user account"});
            }
        );
    });
};

const authJwt = {
    verifyToken,
    isAdmin,
    isUser
};

module.exports = authJwt;
