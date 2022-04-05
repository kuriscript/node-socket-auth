const { Schema, model } = require('mongoose');

const FormDataSchema = new Schema({
    formData: new Schema({}, { strict: false }),
    creationDate: {
        type: Date,
        default: Date.now
    },
});

FormDataSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

FormsData = model('FormsData', FormDataSchema);

module.exports = {
    FormsData
}