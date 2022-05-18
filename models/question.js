const { Schema, model } = require('mongoose');

const QuestionSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    placeholder: {
        type: String
    },
    value: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    },
    type: {
        type: Schema.Types.ObjectId,
        ref: 'QuestionType',
        required: true
    },
    validators: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Validator',
        }
    ],
    options: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Options',
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    order: {
        type: Number,
        default: 0
    },
    inReport: {
        type: Boolean,
        default: false
    }
});

Question = model('Question', QuestionSchema);

module.exports = {
    Question
};