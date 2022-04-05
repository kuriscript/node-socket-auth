const { Schema, model } = require('mongoose');

const OptionSchema = new Schema({
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
    }
});

Options = model('Options', OptionSchema);

module.exports = {
    Options
};