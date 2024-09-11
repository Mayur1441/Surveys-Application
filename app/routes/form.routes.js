const {authJwt} = require("../middlewares");
const controller = require("../controllers/form.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // this API is for to create form
    app.post("/api/form/create", [authJwt.verifyToken], controller.createForms);

    // this API is for to get all form, this is for Admin only
    app.get("/api/form/getall", [authJwt.verifyToken, authJwt.isAdmin], controller.getAllForms);
};
