

import twillo from "twilio";

const client = twillo(
    process.env.TWILIO_ACCOUNT_SID || "",
    process.env.TWILIO_AUTH_TOKEN || ""
);

export async function sendSMSCode(phone:string,code:string){
    if(!process.env.TWILIO_PHONE_NUMBER){
        throw new Error("Twilio account SID is not set in .env");
    }
    return client.messages.create({
        body:`Your verification code is: ${code} for Gold Borse Application`,
        from: process.env.TWILIO_PHONE_NUMBER || "",
        to: phone
    });
}