const { response } = require('express');
const { errorMessage, successMessage } = require('../helpers/messages');
const { Category } = require('../models/category');
const { Question } = require('../models/question');
const { Options } = require('../models/option');

const { dbConnection } = require('../database/config');

const session = dbConnection.startSession();

session.startTransaction();


const addQuestionsInCategory = async (req, res = response) => {

    await session.withTransaction(async () => {

        // agregar preguntas a una categoria, pero no tengo el id de las preguntas

        const { categoryId } = req.params;

        const { questions } = req.body;


        try {

            const category = await Category.findById(categoryId);

            if (!category) {
                return res.status(400).json({
                    ok: false,
                    message: errorMessage.categoryNotFound
                });
            }

            const questionsIds = await questions.map(
                question => {

                    // agregar opciones a las preguntas
                    const newQuestion = new Question(question);

                    const optionsIds = question.options.map(
                        option => {
                            const newOption = new Options(option);
                            newOption.save();
                            return newOption.id;
                        }
                    );

                    question.options = optionsIds;

                    newQuestion.save();

                    return newQuestion.id;
                }
            );

            category.questions = questionsIds;

            await category.save();

            successMessage(res, 'Preguntas agregadas a la categoria', category);

        } catch (error) {
            return errorMessage(res, error);
        }

    }
    );
    session.commitTransaction();
}

module.exports = {
    addQuestionsInCategory
}