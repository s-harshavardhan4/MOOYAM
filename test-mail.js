const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function main() {
    try {
        console.log("Testing SMTP connection with:", process.env.EMAIL_USER);
        await transporter.verify();
        console.log("SUCCESS: Connection verified");
        
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "Test Email from NextJS App",
            text: "This is a test email to verify SMTP configuration."
        });
        console.log("SUCCESS: Mail sent to self");
        process.exit(0);
    } catch (e) {
        console.error("FAILURE:", e);
        process.exit(1);
    }
}

main();
