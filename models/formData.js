const { Schema, model } = require('mongoose');

const FormDataSchema = new Schema({
    formData: new Schema({}, { strict: false }),
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

FormsData = model('FormsData', FormDataSchema);

module.exports = {
    FormsData
}