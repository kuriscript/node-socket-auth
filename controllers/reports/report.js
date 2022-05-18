const { successMessage } = require("../../helpers/messages");
const { FormsData } = require("../../models/formData");


const getReportData = (req, res) => {

    const { id } = req.params;

    FormsData.find({ formId: id })
        .then(data => {
            console.log(data);
            successMessage(res, "Éxito", data);
        })
        .catch(err => {
            res.status(400).json({
                error: err
            });
        });
};


module.exports = {
    getReportData
};