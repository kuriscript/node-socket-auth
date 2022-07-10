
const formidable = require('formidable');
//cloudinary
const { response } = require('express');

const ImageModel = require('../models/image');

const cloudinary = require('cloudinary');

const { successMessage, errorMessage } = require('../helpers/messages');
cloudinary.v2.config(process.env.CLOUDINARY_URL || '');

const saveFile = async (file) => {

    const result = await cloudinary.v2.uploader.upload(file.filepath);

    return {
        secure_url: result.secure_url,
        public_id: result.public_id
    }

}

const deleteFile = async (public_id) => {

    const result = await cloudinary.v2.uploader.destroy(public_id);

    console.log(result);

    return result;

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

        return res.json({
            ok: true,
            path: filePath
        });

    } catch (error) {
        return errorMessage(res);
    }
}

const destroyFile = async (req, res = response) => {

    console.log(req.body);

    try {

        const { public_id } = req.body;

        const { result } = await deleteFile(public_id);

        return res.json({
            result
        });

    } catch (error) {
        return errorMessage(res);
    }
}

module.exports = {
    uploadFile,
    destroyFile
}