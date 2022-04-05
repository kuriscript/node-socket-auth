
const { errorMessage, successMessage } = require("../helpers/messages");
const { QuestionType } = require("../models/questionType");

// CRUD - Question Types
const addNewQuestionType = async (req, res = response) => {

    const { name } = req.body;

    try {

        const nameExist = await QuestionType.findOne({ name });

        if (nameExist) {
            return errorMessage(res, 'El tipo de pregunta con ese nombre ya existe');
        }

        const questionType = new QuestionType(req.body);

        await questionType.save();

        successMessage(res, 'Tipo de pregunta agregado correctamente', questionType);

    } catch (error) {
        return errorMessage(res);
    }
}

const updateQuestionType = async (req, res = response) => {

    const { id } = req.params;

    try {

        const questionType = await QuestionType.findById(id);

        if (!questionType) {
            return errorMessage(res, 'El tipo de pregunta no existe');
        }

        const newQuestionType = {
            ...req.body
        }

        const questionTypeUpdated = await QuestionType.findByIdAndUpdate(id, newQuestionType, { new: true });

        successMessage(res, 'Tipo de pregunta actualizado correctamente', questionTypeUpdated);

    } catch (error) {
        return errorMessage(res);
    }
}

const deleteQuestionType = async (req, res = response) => {

    const { id } = req.params;

    try {

        const questionType = await QuestionType.findById(id);

        if (!questionType) {
            return errorMessage(res, 'El tipo de pregunta no existe');
        }

        await QuestionType.findByIdAndDelete(id);

        successMessage(res, 'Tipo de pregunta eliminado correctamente');

    } catch (error) {
        return errorMessage(res);
    }
}

const getQuestionTypes = async (req, res = response) => {

    try {

        const questionTypes = await QuestionType.find().sort({ order: 1 });

        successMessage(res, 'Tipos de preguntas obtenidos correctamente', questionTypes);

    } catch (error) {
        return errorMessage(res);
    }
}

module.exports = {
    addNewQuestionType,
    updateQuestionType,
    deleteQuestionType,
    getQuestionTypes
}