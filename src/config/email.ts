


import nodemailer from 'nodemailer';



export async function htmlContent(token:string,path:string,subject:string,subjectText:string,buttonText:string){
    return `
    <div style="background:#8cb3d9;width:500px;height:auto;border-radius:20px;padding:20px;color:#d5ff80">
    <h1 style="text-align:center;padding-bottom:30px">${subject}</h1>

    <div style="text-align:center;justify-content:center;backGround:#b3cbe6;padding-top:10px;border-radius:10px">
    <p style="color:#fff;">${subjectText}</p>

    <div style="padding:50px;">
    <a href="${process.env.PRODUCT_URL}${process.env.PORT}${path}?token=${token}" style="padding:15px 30px;background:green;color:#fff;text-decoration:none;border-radius:5px;">${buttonText}</a>
    </div>
    </div>
    </div>
    `
}

// const verifyEmailButtonText = "Click on the button below to verify your email";
// const resetPasswordButtonText = "Click on the button below to reset your password";

// const verifyEmailPath = "/auth/verify-email";
// const resetPasswordPath = "/auth/reset-password";

// const verifyEmailSubject = "Verify your email";
// const resetPasswordSubject = "Reset your password";


export async function sendEmailFunction(to:string,token:string,path:string,subject:string,subjectText:string,buttonText:string){

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const html = await htmlContent(token,path,subject,subjectText,buttonText);
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error(`Error sending email: ${error}`);
    }
}


