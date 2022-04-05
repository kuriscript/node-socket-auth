const { Schema, model } = require('mongoose');

const QuestionTypeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    order: {
        type: Number,
        default: 0
    }
});

QuestionType = model('QuestionType', QuestionTypeSchema);

module.exports = { QuestionType };