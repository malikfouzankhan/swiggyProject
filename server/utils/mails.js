// nodemailer
/*
Used to send mails through node itself.
*/
import mailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
async function sendMail(to, name, emailLink)
{
    try
    {
        let transport = mailer.createTransport({
            service : "gmail",
            auth : {
                user : process.env.EMAIL,
                pass : process.env.PASS
            }
        });

        const info = await transport.sendMail({
            from: process.env.EMAIL,
            to,
            subject: `Hey there ${name}!\nWelcome aboard`,
            text: `Please use this link to verify your Email ID.\n${emailLink}`
        });
        console.log("Message sent:", info.messageId);
    }
    catch(error)
    {
        console.log(error.message);
    }
}

export default sendMail;