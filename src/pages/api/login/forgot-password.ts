import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import {google} from 'googleapis';
import cors from 'cors';
import { createRouter} from 'next-connect';
import Users from '@/Models/Users';
import connectDB from '@/lib/connectMongo';
import { connectToDatabase } from '@/lib/apiMiddleware';
import { Db } from 'mongodb';

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
const resetPasswordSecret = process.env.RESET_PASSWORD_SECRET || 'reset_password_secret';
const resetPasswordExpiration = parseInt(process.env.RESET_PASSWORD_EXPIRATION || '3600', 10);

if (!jwtSecret || !gmailAcc) {
    throw new Error('Environment variables ADMIN_USERNAME, ADMIN_PASSWORD, and JWT_SECRET must be set');
  }

  const withDatabase = (handler: (req: NextApiRequest, res: NextApiResponse, db: Db) => Promise<void>) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        await connectDB();
        const database = await connectToDatabase();
        await handler(req, res, database);
      } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
    };
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
    const { token } = await oauth2Client.getAccessToken();
    return token;
  }

  async function createTransporter() {
    const accessToken = await getAccessToken();
    console.log(accessToken)
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
  }

  const forgotRouter = createRouter<NextApiRequest, NextApiResponse>();

  forgotRouter.use(cors(corsOptions));


  forgotRouter.post(withDatabase(async (req: NextApiRequest, res: NextApiResponse, db: Db) => {
    const { email } = req.body;
    const existingUser = await Users.findOne({email: email});
    if (!existingUser) {
      return res.status(400).json({ error: 'Invalid email!' });
    }
  
    const token = crypto.randomBytes(20).toString('hex');
    const resetToken = jwt.sign({ username: email, token }, resetPasswordSecret, { expiresIn: `${resetPasswordExpiration}s` });
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
  
    const mailOptions = {
      to: email,
      from: gmailAcc,
      subject: 'Password Reset Request',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             ${resetUrl}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };
  
    try {
      const transporter = await createTransporter();
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Password reset email sent!' });
    } catch (err) {
      console.error('Error sending email:', err);
      res.status(500).json({ error: 'Error sending email!' });
    }
  }));

  export default forgotRouter.handler({
    onError: (err:any, req, res) => {
      console.error(err.stack);
      res.status(err.statusCode || 500).end(err.message);
    },
  });