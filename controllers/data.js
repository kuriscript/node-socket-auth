const { isValidObjectId } = require('mongoose');
const { response } = require("express");

const { errorMessage, successMessage } = require("../helpers/messages");
const Result = require("../models/data");
const ImageModel = require("../models/image");

const saveData = async (req, res = response) => {

    try {

        const data = new Result(req.body);

        await data.save();

        successMessage(res, 'Solicitud guardada correctamente', data);

    } catch (error) {
        return errorMessage(res, 400);
    }

}

const getData = async (_, res = response) => {
    try {
        const data = await Result.find({});

        successMessage(res, 'Solicitudes obtenidas correctamente', data);

    } catch (error) {
        return errorMessage(res);
    }
}

const saveImagesPath = async (req, res = response) => {

    const { dataId } = req.body;

    try {

        if (!dataId) {
            return errorMessage(res, 'La Solicitud es inválido');
        }

        if (!isValidObjectId(dataId)) {
            return errorMessage(res, 'La Solicitud es inválido');
        }

        const dataExist = await Result.findById(dataId);

        if (!dataExist) {
            return errorMessage(res, 'La Solicitud no existe');
        }

        const imagesExist = await ImageModel.find({ dataId: dataExist._id });

        if (imagesExist.length > 0) {
            return errorMessage(res, 'La Solicitud ya tiene imagenes');
        }

        const data = new ImageModel(req.body);

        await data.save();

        res.json({
            ok: true,
            message: "Imagen guardada correctamente",
            data
        });

    }
    catch (error) {
        return errorMessage(res);
    }
}

module.exports = {
    saveData,
    getData,
    saveImagesPath
};
