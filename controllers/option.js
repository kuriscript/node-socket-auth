const { response } = require('express');
const { successMessage, errorMessage } = require('../helpers/messages');
const Options = require('../models/option')

// CRUD - Options

const addNewOption = async (req, res = response) => {

    const { description } = req.body;

    try {

        const descriptionExist = await Options.findOne({ description });

        if (descriptionExist) {
            return errorMessage(res, 'El opcion con esa descripción ya existe');
        }

        const option = Options(req.body);

        await option.save();

        successMessage(res, 'Opcion agregada correctamente', option);

    } catch (error) {
        return errorMessage(res);
    }

}

const updateOption = async (req, res = response) => {

    const { id } = req.params;

    try {

        const option = await Options.findById(id);

        if (!option) {
            return errorMessage(res, 'La opción no existe');
        }

        const newOption = {
            ...req.body
        }

        const optionUpdated = await Options.findByIdAndUpdate(id, newOption, { new: true });

        successMessage(res, 'Opcion actualizada correctamente', optionUpdated);

    } catch (error) {
        return errorMessage(res);
    }
}

const deleteOption = async (req, res = response) => {

    const { id } = req.params;

    try {

        const option = await Options.findById(id);

        if (!option) {
            return errorMessage(res, 'La opción no existe');
        }

        await Options.findByIdAndDelete(id);

        successMessage(res, 'Opcion eliminada correctamente');

    } catch (error) {
        return errorMessage(res);
    }
}

const getOptions = async (req, res = response) => {

    try {

        const options = await Options.find().sort({ order: 1 });

        successMessage(res, 'Opciones obtenidas correctamente', options);

    } catch (error) {
        return errorMessage(res);
    }
}

const getActiveOptions = async (req, res = response) => {

    try {

        const options = await Options.find({ active: true }).sort({ order: 1 });

        successMessage(res, 'Opciones obtenidas correctamente', options);

    } catch (error) {
        return errorMessage(res);
    }
}

module.exports = {
    addNewOption,
    updateOption,
    deleteOption,
    getOptions,
    getActiveOptions
}