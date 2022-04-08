
/*
    path: /api/mail
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { sendMail } = require("../controllers/mail");
const { fieldValidators } = require("../middlewares/fields-validator");
const { validateJWT } = require("../middlewares/jwt-validator");

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use(validateJWT);

router.post("/send", [
    check("to", "El to es obligatorio").not().isEmpty(),
    check("subject", "El asunto es obligatorio").not().isEmpty(),
    check("text", "El texto es obligatorio").not().isEmpty(),
    check("html", "El html es obligatorio").not().isEmpty(),
    fieldValidators
], sendMail);

module.exports = router;