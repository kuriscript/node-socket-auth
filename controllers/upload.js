
const formidable = require('formidable');
//cloudinary
const cloudinary = require('cloudinary');
const { response } = require('express');
const { successMessage, errorMessage } = require('../helpers/messages');
cloudinary.v2.config(process.env.CLOUDINARY_URL || '');

const saveFile = async (file) => {

    const result = await cloudinary.v2.uploader.upload(file.filepath);

    return result.secure_url;

}

const parseFiles = async (req) => {

    return new Promise(async (resolve, reject) => {

        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {

            if (err) {
                return reject(err);
            }

            const filePath = await saveFile(files.file);
            resolve(filePath);
        });
    });
}

const uploadFile = async (req, res = response) => {

    try {

        const filePath = await parseFiles(req);

        return successMessage(res, 'Archivo subido correctamente', filePath);

    } catch (error) {
        return errorMessage(res);
    }
}

module.exports = {
    uploadFile
}