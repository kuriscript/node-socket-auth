const { isValidObjectId } = require('mongoose');

const { errorMessage } = require("../../helpers/messages");

const Result = require("../../models/data");
const Form = require('../../models/form');

const getReportData = async (req, res) => {

    const { id } = req.params;

    try {

        if (!isValidObjectId(id)) {
            return errorMessage(res, "El id no es valido");
        }

        const form = await Form.findById(id);

        if (!form) {
            return errorMessage(res, "El formulario no existe");
        }

        var result = await Result.find({ formId: id });

        return res.json({
            ok: true,
            data: result,
            path: form.path
        })

    } catch (error) {
        return errorMessage(res);
    }
};


const getResultById = async (req, res) => {

    const { id } = req.params;

    try {

        if (!isValidObjectId(id)) {
            return errorMessage(res, "El id no es valido");
        }

        const { data } = await Result.findById(id);

        if (!data) {
            return errorMessage(res, "El resultado no existe");
        }

        return res.json({
            ok: true,
            data
        })

    } catch (error) {
        return errorMessage(res);
    }
}


module.exports = {
    getReportData,
    getResultById
};