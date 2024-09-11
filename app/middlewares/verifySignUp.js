const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

// this Middleware will check User's inserted Username and Email is exist or not
checkDuplicateUsernameOrEmail = (req, res, next) => {
  if (req.body.username === '') {
    res.status(400).send({ message: "Failed! Username is blank!" });
    return;
  } else if (req.body.email === '') {
    res.status(400).send({ message: "Failed! email is blank!" });
    return;
  } else if (req.body.password === '') {
    res.status(400).send({ message: "Failed! password is blank!" });
    return;
  }
  // Username
  User.find({
    username: req.body.username
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    console.log('user', user);
    if (user.length) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }
    // Email
    User.findOne({
      email: req.body.email
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (user) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }
      next();
    });
  });
};

// this Middleware will check Roles are available or not
checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    console.log('req.body.roles[i]', req.body.roles);
    for (let i = 0; i < req.body.roles.length; i++) {
      console.log('ROLES.includes', ROLES.includes);
      console.log('req.body.roles[i]', req.body.roles[i]);
      if (!ROLES.includes(req.body.roles)) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
        return;
      }
    }
  }
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignUp;
