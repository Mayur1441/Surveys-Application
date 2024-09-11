const {authJwt} = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // this API get all user docs, this is for Admin only
    app.get("/api/user/all", [authJwt.verifyToken, authJwt.isAdmin], controller.allUser);

    // this API is to get single user details on base of username
    app.get("/api/singleuser/:username", [authJwt.verifyToken], controller.userFind);
};
