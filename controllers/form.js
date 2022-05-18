const { response } = require("express");
const { errorMessage, successMessage } = require("../helpers/messages");
const { Validator } = require("../models/validator");
const { Form } = require("../models/form");
const { QuestionType } = require("../models/questionType");

// CRUD - Form

const addNewForm = async (req, res = response) => {

    const { name } = req.body;
    const { path } = req.body;

    try {

        const nameExist = await Form.findOne({ name });

        if (nameExist) {
            return errorMessage(res, 'El formulario con ese nombre ya existe');
        }

        const validName = path.replace(/\s/g, '').toLowerCase();

        const pathExist = await Form.findOne({ path: validName });

        if (pathExist) {
            return errorMessage(res, 'El formulario con ese path ya existe');
        }

        const form = new Form(req.body);

        form.user = req.uid;
        form.path = validName;

        await form.save();

        successMessage(res, 'Formulario agregado correctamente', form);

    } catch (error) {
        console.log(error);

        return errorMessage(res);
    }

}

const updateForm = async (req, res = response) => {

    const formId = req.params.id;

    const { path } = req.body;

    try {

        const form = await Form.findById(formId);

        if (!form) {
            return errorMessage(res, 'Formulario con ese Id no encontrado');
        }

        const validName = path.replace(/\s/g, '').toLowerCase();

        const pathExist = await Form.findOne({ path: validName, _id: { $ne: formId } });

        if (pathExist) {
            return errorMessage(res, 'El formulario con ese path ya existe');
        }

        //TODO: agregar validaciones de permisos

        const newForm = {
            ...req.body,
            path: validName
        }

        const formUpdated = await Form.findByIdAndUpdate(formId, newForm, { new: true });

        successMessage(res, 'Formulario actualizado correctamente', formUpdated);

    } catch (error) {
        return errorMessage(res);
    }
}

const deleteForm = async (req, res = response) => {

    const formId = req.params.id;

    try {

        const form = await Form.findById(formId);

        if (!form) {
            return errorMessage(res, 'Formulario con ese Id no encontrado');
        }

        //TODO: agregar validaciones de permisos

        await Form.findByIdAndDelete(formId);

        successMessage(res, 'Formulario eliminado correctamente');

    } catch (error) {
        return errorMessage(res);
    }
}

const getForms = async (req, res = response) => {

    try {

        const forms = await Form.find({ status: true }).sort({ order: 1 });

        successMessage(res, 'Formularios obtenidos correctamente', forms);

    } catch (error) {
        return errorMessage(res);
    }
}

// obtener el detalle de un formulario

const getFormById = async (req, res = response) => {

    const { id } = req.params;

    try {

        const form = await Form.findById(id);

        if (!form) {
            return errorMessage(res, 'Formulario con ese Id no encontrado editar');
        }

        successMessage(res, 'Formulario obtenido correctamente', form);

    } catch (error) {
        return errorMessage(res);
    }
}

const getFinalForm = async (req, res = response) => {

    const { id } = req.params;

    try {

        const form = await Form.findById(id)
            .populate({
                path: 'categories',
                options: {
                    match: { status: true },
                    sort: { order: 1 }
                },
                populate: {
                    path: 'questions',
                    options: {
                        match: { status: true },
                        sort: { order: 1 }
                    },
                    populate:
                        [{
                            path: 'type',
                            model: 'QuestionType',
                            options: {
                                match: { status: true },
                                sort: { order: 1 }
                            }
                        },
                        {
                            path: 'validators',
                            model: 'Validator',
                            options: {
                                match: { status: true }
                            }
                        },
                        {
                            path: 'options',
                            model: 'Options',
                            options: {
                                match: { status: true },
                                sort: { order: 1 }
                            }
                        }]
                }
            })

        if (!form) {
            return errorMessage(res, 'Formulario con ese Id no encontrado');
        }

        successMessage(res, 'Formulario obtenido correctamente', form);

    } catch (error) {
        return errorMessage(res);
    }
}

const getFinalFormByPath = async (req, res = response) => {

    const { path } = req.params;

    try {
        const form = await Form.findOne({ path })
            .populate({
                path: 'categories',
                options: {
                    match: { status: true },
                    sort: { order: 1 }
                },
                populate: {
                    path: 'questions',
                    options: {
                        match: { status: true },
                        sort: { order: 1 }
                    },
                    populate:
                        [{
                            path: 'type',
                            model: 'QuestionType',
                            options: {
                                match: { status: true },
                                sort: { order: 1 }
                            }
                        },
                        {
                            path: 'validators',
                            model: 'Validator',
                            options: {
                                match: { status: true }
                            }
                        },
                        {
                            path: 'options',
                            model: 'Options',
                            options: {
                                match: { status: true },
                                sort: { order: 1 }
                            }
                        }]
                }
            })

        console.log(form)

        if (!form) {
            return errorMessage(res, 'Formulario con ese Path no encontrado');
        }

        successMessage(res, 'Formulario obtenido correctamente', form);

    } catch (error) {
        return errorMessage(res);
    }
}

const getFirstValues = async (req, res = response) => {

    try {

        const questionTypes = await QuestionType.find({ status: true }).sort({ order: 1 });

        const validators = await Validator.find({ status: true }).sort({ order: 1 });

        res.json({
            ok: true,
            data: {
                questionTypes,
                validators
            }
        });

    } catch (error) {
        console.log(error);
        return errorMessage(res);
    }
}

module.exports = {
    addNewForm,
    updateForm,
    deleteForm,
    getForms,
    getFinalForm,
    getFirstValues,
    getFormById,
    getFinalFormByPath
};
