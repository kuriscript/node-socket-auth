const { response } = require("express");
const nodemailer = require("nodemailer");

const sendMail = async (req, res = response) => {

    const { to, subject, text, html } = req.body;

    try {

        console.log(process.env.MAIL_SERVICE);
        console.log(process.env.MAIL_USER);
        console.log(process.env.MAIL_PASS);

        let transporter = nodemailer.createTransport({
            //office365 smtp "Outlook365"
            // host: "smtp.office365.com",
            // port: 587,
            // secure: false, // true for 465, false for other ports
            service: process.env.MAIL_SERVICE,
            auth: {
                user: process.env.MAIL_USER, // generated ethereal user
                pass: process.env.MAIL_PASS, // generated ethereal password
            }
        });

        // send mail with defined transport object
        await transporter.sendMail({
            from: '', // sender address
            to: to,
            subject: subject,
            text: text,
            html: html
        });


        return res.status(200).json({
            ok: true,
            message: "Email sent"
        });

    } catch (error) {

        return res.status(500).json({
            message: 'Error sending email',
            error
        });

    }

}

module.exports = {
    sendMail
}


