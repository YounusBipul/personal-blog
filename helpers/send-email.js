module.exports = {
    sendmail: function (email,otp) {
        var nodemailer = require('nodemailer');
        var {from_email, from_password, from_service}= require('../config/email');

        var transporter = nodemailer.createTransport({
            service: from_service,
            auth: {
                user: from_email,
                pass: from_password
            }
        });

        var mailOptions = {
            from: from_email,
            to: email,
            subject: 'OTP for chaning Password',
            text: `Your OTP is ${otp}.\n
            Use thi OTP to reset your password`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return false;
            } else {
                console.log('Email sent: ' + info.response);
                return true;
            }
        });
    }
}