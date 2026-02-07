import nodemailer from "nodemailer";

export const sendEmail = async (to, code) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // The method is sendMail (lowercase 'm'), and it must be inside the function
    const info = await transporter.sendMail({
        from: `"Support" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: "Password Reset Code",
        html: `
            <div style="font-family: sans-serif; border: 1px solid #eee; padding: 20px;">
                <h2>Your verification code is: <span style="color: #4A90E2;">${code}</span></h2>
                <p>This code will expire in 5 minutes.</p>
                <hr />
                <small>If you didn't request this, please ignore this email.</small>
            </div>
        `,
    });

    return info;
};