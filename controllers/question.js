
const { successMessage, errorMessage } = require('../helpers/messages');
const Question = require('../models/question');
const Options = require('../models/option');
const Category = require('../models/category');


// CRUD - Questions

const addNewQuestion = async (req, res = response) => {

    const { name } = req.body;

    try {

        // quita los espacios en blanco y ponerlo en minuscula
        let validName = name.replace(/\s/g, '').toLowerCase();

        const nameExist = await Question.findOne({ name: validName });

        if (nameExist) {
            return errorMessage(res, 'La pregunta con ese nombre ya existe');
        }

        const question = new Question(req.body);

        question.user = req.uid;

        question.name = validName;

        await question.save();

        successMessage(res, 'Pregunta agregada correctamente', question);


    } catch (error) {
        return errorMessage(res);
    }
}

const updateQuestion = async (req, res = response) => {

    const questionId = req.params.id;

    try {

        const question = await Question.findById(questionId);

        if (!question) {
            return errorMessage(res, 'Pregunta con ese Id no encontrada');
        }

        //TODO: agregar validaciones de permisos

        const newQuestion = {
            ...req.body
        }

        const questionUpdated = await Question.findByIdAndUpdate(questionId, newQuestion, { new: true });

        successMessage(res, 'Pregunta actualizada correctamente', questionUpdated);

    } catch (error) {
        return errorMessage(res);
    }
}

const deleteQuestion = async (req, res = response) => {

    const questionId = req.params.id;

    try {

        const question = await Question.findById(questionId);

        if (!question) {
            return errorMessage(res, 'Pregunta con ese Id no encontrada');
        }

        //TODO: agregar validaciones de permisos

        await Question.findByIdAndDelete(questionId);

        successMessage(res, 'Pregunta eliminada correctamente');

    } catch (error) {
        return errorMessage(res);
    }
}

const getQuestions = async (req, res = response) => {

    try {

        // populate de category ordernado por order y mostrar los status activo

        const questions = await Question.find({ status: true })
            .sort({ order: 1 })
            .populate({
                path: 'type',
                options: {
                    sort: { order: 1 },
                    match: { status: true }
                }
            })
            .populate({
                path: 'validators',
                options: {
                    match: { status: true }
                }
            })
            .populate({
                path: 'options',
                options: {
                    sort: { order: 1 },
                    match: { status: true }
                }
            })

        successMessage(res, 'Preguntas obtenidas correctamente', questions);
    }
    catch (error) {
        return errorMessage(res);

    }
}

const getQuestionById = async (req, res = response) => {

    const { id } = req.params;

    try {

        const question = await Question.findById(id)
            .populate({
                path: 'type',
                options: {
                    match: { status: true },
                    sort: { order: 1 }
                }
            })
            .populate({
                path: 'validators',
                options: {
                    match: { status: true }
                }
            })
            .populate({
                path: 'options',
                options: {
                    sort: { order: 1 },
                    match: { status: true }
                }
            })

        if (!question) {
            return errorMessage(res, 'Pregunta con ese Id no encontrada');
        }

        successMessage(res, 'Pregunta obtenida correctamente', question);

    } catch (error) {
        return errorMessage(res);
    }
}

// agregar una pregunta a una categoria especifica y opciones a las preguntas

const addQuestionOptionsCategory = async (req, res = response) => {

    const { id } = req.params;

    const { options } = req.body;

    const { name } = req.body;

    try {

        const category = await Category.findById(id);

        if (!category) {
            return res.status(400).json({
                ok: false,
                message: "Category doesn't exist"
            });
        }

        // quita los espacios en blanco y ponerlo en minuscula
        let validName = name.replace(/\s/g, '').toLowerCase();

        const nameExist = await Question.findOne({ name: validName });

        if (nameExist) {
            return errorMessage(res, 'La pregunta con ese nombre ya existe');
        }

        const newQuestion = new Question(req.body);

        newQuestion.user = req.uid;

        newQuestion.name = validName;

        if (options) {

            //crear las opciones y agregar los ids a las preguntas

            const newOptions = options.map(option => {

                const newOption = new Options(option);

                newOption.save();

                return newOption;

            });

            await Promise.all(newOptions);

            newQuestion.options = newOptions.map(option => option.id);


        }
        await newQuestion.save();

        category.questions.push(newQuestion.id);

        await category.save();

        const questionReturn = await Question.findById(newQuestion.id)
            .populate({
                path: 'options',
                options: { sort: { order: 1 } }
            })


        successMessage(res, 'Datos guardados correctamente.', questionReturn);

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            message: error
        });
    }
}


// editar pregunta con las lista de opciones y eliminar las opciones que no esten en la lista

const updateQuestionWithOptions = async (req, res = response) => {

    const questionId = req.params.id;

    const { name } = req.body;

    const { options } = req.body;

    try {

        const questionExist = await Question.findById(questionId);

        if (!questionExist) {
            return errorMessage(res, 'Pregunta con ese Id no encontrada');
        }


        // buscar si el nombre de la pregunta ya existe pero diferente al id de questionExist

        const validName = name.replace(/\s/g, '').toLowerCase();

        const nameExist = await Question.findOne({ name: validName, _id: { $ne: questionId } });

        if (nameExist) {
            return errorMessage(res, 'La pregunta con ese nombre ya existe');
        }

        const newQuestion = {
            ...req.body,
            name: validName
        }


        if (options) {

            const newOptions = await Promise.all(options.map(async (option) => {

                // si el id de la opcion existe, editarla

                if (option._id) {

                    const optionExist = await Options.findById(option._id);

                    if (!optionExist) {
                        return errorMessage(res, 'Opcion con ese Id no encontrada');
                    }

                    const newOption = {
                        ...option
                    }

                    const optionUpdated = await Options.findByIdAndUpdate(option._id, newOption, { new: true });

                    return optionUpdated;

                } else {

                    const newOption = new Options(option);

                    await newOption.save();

                    return newOption;

                }

            }));

            newQuestion.options = newOptions.map(option => option.id);
        }

        const question = await Question.findByIdAndUpdate(questionId, newQuestion, { new: true });

        //TODO: refactorizar code

        // console.log("Nuevas opciones antes de guardar", newQuestion.options);
        // console.log("Nuevas opciones: ", question.options);
        // console.log("Antiguas opciones: ", questionExist.options);

        const optionsToDelete = questionExist.options.filter(option => !question.options.includes(option));
        
        await Options.deleteMany({ _id: { $in: optionsToDelete } });

        const questionReturn = await Question.findById(questionId)
            .populate({
                path: 'options',
                options: { sort: { order: 1 } }
            })

        successMessage(res, 'Pregunta actualizada correctamente', questionReturn);

    } catch (error) {
        console.log(error);
        return errorMessage(res);
    }
}

// eliminar una pregunta con sus opciones y eliminar las opciones del modelo

const deleteQuestionWithOptions = async (req, res = response) => {

    const { id } = req.params;

    const { categoryId } = req.body;

    try {

        const questionExist = await Question.findById(id);

        if (!questionExist) {
            return errorMessage(res, 'Pregunta con ese Id no encontrada');
        }

        // eliminar de la categoria la pregunta

        const categoryExist = await Category.findById(categoryId);

        if (!categoryExist) {
            return errorMessage(res, 'Categoria con ese Id no encontrada');
        }


        // si la pregunta tiene opciones, eliminar las opciones

        if (questionExist.options.length > 0) {

            await Promise.all(questionExist.options.map(async (option) => {

                await Options.deleteMany({ _id: option });

            }));

        }

        const index = categoryExist.questions.indexOf(id);

        if (index > -1) {
            categoryExist.questions.splice(index, 1);
        }

        await categoryExist.save();

        // eliminar la pregunta

        await Question.deleteOne({ _id: id });

        successMessage(res, 'Pregunta eliminada correctamente');

    } catch (error) {
        console.log(error);
        return errorMessage(res);
    }
}


module.exports = {
    addQuestionOptionsCategory,
    updateQuestionWithOptions,
    addNewQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestions,
    getQuestionById,
    deleteQuestionWithOptions
}