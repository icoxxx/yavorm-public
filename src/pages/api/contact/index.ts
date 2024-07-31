import type { NextApiRequest, NextApiResponse } from 'next';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import {google} from 'googleapis';
import cors from 'cors';
import { createRouter} from 'next-connect';

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['POST'],
  };

const OAuth2 = google.auth.OAuth2;
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
const gmailAcc = process.env.EMAIL_USER;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
const refreshToken = process.env.REFRESH_TOKEN;
const captchaSecret = process.env.RECAPTCHA_SECRET;

if (!jwtSecret || !gmailAcc) {
    throw new Error('Environment variables ADMIN_USERNAME, ADMIN_PASSWORD, and JWT_SECRET must be set');
  };

  const oauth2Client = new OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken
  });
  

  async function getAccessToken() {
    try {
        const { token } = await oauth2Client.getAccessToken();
        return token;
    } catch (error: any) {
        console.error('Error getting access token:', error);
        throw error;
    }
  }
  

async function createTransporter() {
    const accessToken = await getAccessToken();
    //console.log(accessToken)
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: gmailAcc,
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        accessToken: accessToken,
      },
    } as nodemailer.TransportOptions);
  };

const sendMailRouter = createRouter<NextApiRequest, NextApiResponse>();

sendMailRouter.use(cors(corsOptions));

sendMailRouter.post(async (req: NextApiRequest, res: NextApiResponse)=> {
    const {userName, email, message, captcha} = req.body;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${captchaSecret}&response=${captcha}`;
    const recaptchaResponse = await fetch(verifyUrl, { method: 'POST' });
    const recaptchaResult = await recaptchaResponse.json();

    if(
        !userName 
        || 
        !email 
        || 
        !message
       )
    {
        return res.status(500).json({ error: 'All input fields are required!' });
    }
    if (
        !recaptchaResponse.ok 
        || 
        !recaptchaResult.success 
        || 
        recaptchaResult.score <= 0.4        
    ){
        return res.status(500).json({ error: 'Anti-spam protection!' });
    }
    const mailOptions = {
        to: gmailAcc,
        from: gmailAcc,
        replyTo: email, 
        subject: `Съобщение от ${userName}, изпратено от www.yavorm.com`,
        text: `${message}`,
      };
    
    try {
        const transporter = await createTransporter();
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'Message sent! Thank You!' });
    } catch (error:any) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Error sending email!' });
    }
})

export default sendMailRouter.handler({
    onError: (err:any, req, res) => {
      console.error(err.stack);
    },
  });