const {authJwt} = require("../middlewares");
const controller = require("../controllers/form_response.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // Submit Form Response
    app.post("/api/form/submitResponse", [authJwt.verifyToken], controller.createFormResponse);

    // Extract Single Form's All Responses
    app.get("/api/form/getFormAllResponse/:form_id", controller.getFormAllResponse);

    // Extract Single Response of Form
    app.get("/api/form/getSingleResponse/:form_response_id", controller.getSingleResponse);
};
