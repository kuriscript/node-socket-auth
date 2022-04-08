const { response } = require("express");
const nodemailer = require("nodemailer");

const sendMail = async (req, res = response) => {

    const { to, subject, text, html } = req.body;

    try {

        let transporter = nodemailer.createTransport({
            //office365 smtp "Outlook365"
            // host: "smtp.office365.com",
            // port: 587,
            // secure: false, // true for 465, false for other ports
            service: "Outlook365",
            auth: {
                user: "cecilio_tasna@kullkiwasi.com.ec", // generated ethereal user
                pass: "Onemoretime13-", // generated ethereal password
            },
            tls: {
                ciphers: "SSLv3",
            },
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


