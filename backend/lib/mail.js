import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: `"Mooyam Creams" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Password Reset OTP Code",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #D4A398; text-align: center;">Mooyam Creams</h2>
                <p>Hello,</p>
                <p>You requested a password reset. Use the OTP code below to proceed:</p>
                <div style="background: #fdf2f0; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
                    <h1 style="letter-spacing: 5px; color: #2C2C2C; margin: 0;">${otp}</h1>
                    <p style="color: #666; font-size: 14px; margin-top: 10px;">Valid for 5 minutes</p>
                </div>
                <p>If you didn't request this, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #999; text-align: center;">&copy; 2024 Mooyam Creams. All rights reserved.</p>
            </div>
        `,
    };

    return transporter.sendMail(mailOptions);
};
