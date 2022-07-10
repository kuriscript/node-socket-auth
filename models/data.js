const { Schema, model } = require('mongoose');

const DataSchema = new Schema({
    data: new Schema({}, { strict: false }),
    creationDate: {
        type: Date,
        default: Date.now
    },
    formId: {
        type: Schema.Types.ObjectId,
        ref: 'Form',
        required: true
    }
});

module.exports = model('Result', DataSchema);