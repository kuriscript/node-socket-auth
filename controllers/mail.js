const { response } = require("express");
const nodemailer = require("nodemailer");

const sendMail = async (req, res = response) => {

    const { to, subject, text, html } = req.body;

    try {

        let transporter = nodemailer.createTransport({
            service: process.env.MAIL_SERVICE,
            auth: {
                user: process.env.MAIL_USER, // generated ethereal user
                pass: process.env.MAIL_PASS, // generated ethereal password
            }
        });

        // send mail with defined transport object
        await transporter.sendMail({
            // from: 'emisor@emisorserver.com', // sender address
            to: to,
            subject: subject,
                // text: text,
            html: html
        });


        return res.status(200).json({
            ok: true,
            message: "Email sent"
        });

    } catch (error) {

        return res.status(500).json({
            ok: false,
            message: 'Error sending email',
            error
        });

    }

}

module.exports = {
    sendMail
}


