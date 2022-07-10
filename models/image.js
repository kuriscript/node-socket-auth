const { Schema, model } = require('mongoose');

const ImageSchema = new Schema({
    images: new Schema({}, { strict: false }),
    creationDate: {
        type: Date,
        default: Date.now
    },
    dataId: {
        type: Schema.Types.ObjectId,
        ref: 'Form',
        required: true
    }
});

module.exports = model('Image', ImageSchema);