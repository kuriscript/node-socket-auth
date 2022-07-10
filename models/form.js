const { Schema, model } = require('mongoose');

const FormSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    path: {
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
    categories: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category',
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isStep: {
        type: Boolean,
        default: false
    }
});

module.exports = model('Form', FormSchema);