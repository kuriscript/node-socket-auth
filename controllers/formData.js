const { response } = require("express");
const { errorMessage, successMessage } = require("../helpers/messages");
const { FormsData } = require("../models/formData");

const saveFormData = async (req, res = response) => {

    try {

        const data = new FormsData(req.body);

        await data.save();

        successMessage(res, 'Solicitud guardada correctamente', data);

    } catch (error) {
        console.log(error);
        return errorMessage(res, 400);
    }

};

const getFormData = async (_, res = response) => {
    try {
        const data = await FormsData.find({});

        successMessage(res, 'Solicitudes obtenidas correctamente', data);

    } catch (error) {
        return errorMessage(res);
    }
};

module.exports = {
    saveFormData,
    getFormData,
};
