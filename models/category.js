const { Schema, model } = require('mongoose');

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
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
    },
    questions: [{
        type: Schema.Types.ObjectId,
        ref: 'Question'
    }]
});

Category = model('Category', CategorySchema);

module.exports = {
    Category
};