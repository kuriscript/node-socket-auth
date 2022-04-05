const { successMessage, errorMessage } = require("../helpers/messages");
const { Validator } = require("../models/validator");

// CRUD - Validators

const addNewValidator = async (req, res = response) => {

    const { name } = req.body;

    try {

        const nameExist = await Validator.findOne({ name });

        if (nameExist) {
            return errorMessage(res, 'El validador con ese nombre ya existe');
        }

        const validator = new Validator(req.body);

        await validator.save();

        successMessage(res, 'Validador agregado correctamente', validator);

    } catch (error) {
        return errorMessage(res);
    }
}

const updateValidator = async (req, res = response) => {

    const validatorId = req.params.id;

    try {

        const validator = await Validator.findById(validatorId);

        if (!validator) {
            return errorMessage(res, 'Validador con ese Id no encontrada');
        }

        //TODO: agregar validaciones de permisos

        const newValidator = {
            ...req.body
        }

        const questionUpdated = await Validator.findByIdAndUpdate(validatorId, newValidator, { new: true });

        successMessage(res, 'Validador actualizado correctamente', questionUpdated);

    } catch (error) {
        return errorMessage(res);
    }
}

const deleteValidator = async (req, res = response) => {

    const validatorId = req.params.id;

    try {

        const validator = await Validator.findById(validatorId);

        if (!validator) {
            return errorMessage(res, 'Validador con ese Id no encontrada');
        }

        //TODO: agregar validaciones

        await Validator.findByIdAndDelete(validatorId);

        successMessage(res, 'Validador eliminado correctamente');

    } catch (error) {
        return errorMessage(res);
    }
}

const getValidators = async (req, res = response) => {

    try {

        const validators = await Validator.find();

        successMessage(res, 'Validadores obtenidos correctamente', validators);

    } catch (error) {

        return errorMessage(res);
    }
}

module.exports = {
    addNewValidator,
    updateValidator,
    deleteValidator,
    getValidators
}
