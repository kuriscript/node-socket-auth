
const { successMessage, errorMessage } = require('../helpers/messages');
const Category = require('../models/category');
const Form = require('../models/form');
const Options = require('../models/option');
const Question = require('../models/question');
const QuestionType = require('../models/questionType');
const Validator = require('../models/validator');

// agregar una categoria un formulario especifico

const addCategoryForm = async (req, res = response) => {

    const { id } = req.params;

    try {

        const form = await Form.findById(id);

        if (!form) {
            return res.status(400).json({
                ok: false,
                message: "Form doesn't exist"
            });
        }

        // verificar si en ese formulario ya existe una categoria con el mismo nombre

        const newCategory = new Category(req.body);

        newCategory.user = req.uid;

        await newCategory.save();

        form.categories.push(newCategory.id);

        await form.save();

        successMessage(res, 'Datos guardados correctamente.', newCategory);

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            message: error
        });
    }
}

//obtener las categorias de un formulario especifico

const getCategoriesForm = async (req, res = response) => {

    const { id } = req.params;

    try {

        const form = await Form.findById(id);

        if (!form) {
            return res.status(400).json({
                ok: false,
                message: "Form doesn't exist"
            });
        }

        const categories = await Category.find({ _id: { $in: form.categories } });

        successMessage(res, 'Datos obtenidos correctamente.', categories);

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            message: error
        });
    }
}


// Eliminar una categoria de un formulario especifico

const deleteCategoryForm = async (req, res = response) => {

    const { id } = req.params;

    try {

        const form = await Form.findById(id);

        if (!form) {
            return res.status(400).json({
                ok: false,
                message: "Form doesn't exist"
            });

        }

        const category = await Category.findById(req.body.category);

        if (!category) {
            return res.status(400).json({
                ok: false,
                message: "Category doesn't exist"
            });
        }

        const index = form.categories.indexOf(category.id);

        if (index < 0) {
            return res.status(400).json({
                ok: false,
                message: "Category doesn't exist in this form"

            });

        }

        form.categories.splice(index, 1);

        await form.save();

        await category.remove();

        successMessage(res, 'Datos eliminados correctamente.', form);

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            message: error
        });
    }
}

// CRUD - Categories
const addNewCategory = async (req, res = response) => {

    try {

        const category = new Category(req.body);

        await category.save();

        successMessage(res, 'Categoría agregada correctamente', category);

    } catch (error) {
        return errorMessage(res);
    }
}

const updateCategory = async (req, res = response) => {

    const { id } = req.params;

    try {

        const category = await Category.findById(id);

        if (!category) {
            return errorMessage(res, 'La categoría no existe');
        }

        const newCategory = {
            ...req.body
        }

        const categoryUpdated = await Category.findByIdAndUpdate(id, newCategory, { new: true });

        successMessage(res, 'Categoría actualizada correctamente', categoryUpdated);

    } catch (error) {
        return errorMessage(res);
    }
}

//obtener el detalle de una categoria

const getCategoryById = async (req, res = response) => {

    const { id } = req.params;

    try {

        const category = await Category.findById(id);

        if (!category) {
            return errorMessage(res, 'La categoría no existe');
        }

        successMessage(res, 'Categoría obtenida correctamente', category);

    } catch (error) {
        return errorMessage(res);
    }
}

const deleteCategory = async (req, res = response) => {

    const { id } = req.params;

    try {

        const category = await Category.findById(id);

        if (!category) {
            return errorMessage(res, 'La categoría no existe');
        }

        await Category.findByIdAndDelete(id);

        successMessage(res, 'Categoría eliminada correctamente');

    } catch (error) {
        return errorMessage(res);
    }
}

const getCategories = async (req, res = response) => {

    try {

        const categories = await Category.find().sort({ order: 1 })
            .populate({
                path: 'questions',
                populate: {
                    path: 'options',
                    options: { sort: { order: 1 } }
                }
            });

        successMessage(res, 'Categorías obtenidas correctamente', categories);

    } catch (error) {
        return errorMessage(res);
    }
}

// obtener las preguntas de una categoria especifica

const getQuestionsCategoryById = async (req, res = response) => {

    const { id } = req.params;

    try {

        const category = await Category.findById(id).sort({ order: 1 })
            .populate({
                path: 'questions',
                populate: {
                    path: 'options',
                    options: { sort: { order: 1 } }
                }
            });

        if (!category) {
            return res.status(400).json({
                ok: false,
                message: "Category doesn't exist"
            });
        }

        //SOLUCIÓN DESESPERADA ALGÚN DIA LO HAGO MEJOR

        const questionTypes = await QuestionType.find({ status: true }).sort({ order: 1 });

        const validators = await Validator.find({ status: true }).sort({ order: 1 });

        successMessage(res, 'Categoría obtenida correctamente', { category, questionTypes, validators });

    } catch (error) {
        return errorMessage(res);
    }
}

// eliminar una categoria de un formulario especifico con todas sus preguntas y opciones y eliminar de los modelos 

const deleteCategoryFormAndQuestions = async (req, res = response) => {

    const { id } = req.params;

    const { formId } = req.body;

    try {

        const form = await Form.findById(formId);

        if (!form) {
            return res.status(400).json({
                ok: false,
                message: "Form doesn't exist"
            });
        }

        const category = await Category.findById(id);

        if (!category) {
            return res.status(400).json({
                ok: false,
                message: "Category doesn't exist"
            });
        }

        if (category.questions.length > 0) {

            Promise.all(category.questions.map(async (question) => {

                const questionToDelete = await Question.findById(question);

                if (questionToDelete.options.length > 0) {

                    Promise.all(questionToDelete.options.map(async (option) => {

                        const optionToDelete = await Options.findById(option);

                        await optionToDelete.remove();

                    }));

                }

                await questionToDelete.remove();

            }));
        }

        const index = form.categories.indexOf(category.id);

        if (index > -1) {
            form.categories.splice(index, 1);
        }

        await category.remove();

        await form.save();

        successMessage(res, 'Datos eliminados correctamente.');

    } catch (error) {
        console.log(error);
        return errorMessage(res);
    }
}


module.exports = {
    addCategoryForm,
    deleteCategoryForm,
    getCategoriesForm,
    addNewCategory,
    updateCategory,
    deleteCategory,
    getCategories,
    getQuestionsCategoryById,
    getCategoryById,
    deleteCategoryFormAndQuestions
}