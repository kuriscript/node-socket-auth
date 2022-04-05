const { response } = require("express");

const errorMessage = (res = response, message = "Comuniquese con el administrador") => {
    return res.status(400).json({
        ok: false,
        message
    });
};

const successMessage = (res = response, message = "Todo esta bien!!!", data = {}) => {
    return res.json({
        ok: true,
        message,
        data,
    });
};

module.exports = {
    errorMessage,
    successMessage,
};