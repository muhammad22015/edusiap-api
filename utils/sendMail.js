const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
});

const sendVerificationMail = async (email, url, username) => {
    const mailOptions = {
        from: `"EduSiap" <${process.env.MAIL_FROM_ADDRESS}>`,
        to: `${email}`,
        subject: "Verify your Email",
        html: `
                <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 30px; border-radius: 10px; background-color: #f9f9f9;">
                    <h1 style="text-align: center; color: #4CAF50;">EduSiap Email Verification</h1>
                    <p style="font-size: 16px;">Hi <strong>${username}</strong>,</p>
                    <p style="font-size: 16px;">Thank you for registering. Please verify your email address by clicking the button below:</p>
                    <div style="text-align: center; margin: 30px 0;">
                    <a href="${url}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">Verify Email</a>
                    </div>
                    <p style="font-size: 14px; color: #888;">This link will expire in 1 hour.</p>
                    <p style="font-size: 14px; color: #888;">If you did not sign up, please ignore this email.</p>
                    <hr style="margin-top: 30px;">
                    <p style="font-size: 12px; text-align: center; color: #aaa;">&copy; ${new Date().getFullYear()} EduSiap. All rights reserved.</p>
                </div>
                `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch(err) {
        console.error(err);
    }
}

module.exports = { sendVerificationMail };