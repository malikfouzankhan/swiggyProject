import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const SID = process.env.TWILIO_ACC_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const phone = "+13158722394";

const sender = twilio(SID, authToken);
async function sendSMS(to, name, phoneLink)
{
    try {
        let message = await sender.messages.create({
            from: phone,
            to,
            body: `Hey ${name}!\nUse this link to verify your mobile number.\n${phoneLink}`
        });
        console.log("Message sent", message.sid);
    } catch (error) {
        console.log(error);
    }
}

export default sendSMS;