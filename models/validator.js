const { Schema, model } = require('mongoose');

const ValidatorSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
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
    }
});

Validator = model('Validator', ValidatorSchema);

module.exports = {
    Validator
};