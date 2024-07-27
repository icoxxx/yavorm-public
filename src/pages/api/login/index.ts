import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { createRouter } from 'next-connect';
import Users from '@/Models/Users';
import dotenv from 'dotenv';
import connectDB from '@/lib/connectMongo';
import { connectToDatabase } from '@/lib/apiMiddleware';
import { Db } from 'mongodb';

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['POST'],
  };

dotenv.config()

const jwtSecret = process.env.JWT_SECRET;
const captchaSecret = process.env.RECAPTCHA_SECRET;

if (!jwtSecret || !captchaSecret) {
    throw new Error('Environment variable JWT_SECRET must be set');
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


  const loginRouter = createRouter<NextApiRequest, NextApiResponse>();

  loginRouter.use(cors(corsOptions));

  loginRouter.post(withDatabase(async (req: NextApiRequest, res: NextApiResponse, db: Db) => {

    try {
        const { username, password, captcha } = req.body;


        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${captchaSecret}&response=${captcha}`;
        const recaptchaResponse = await fetch(verifyUrl, { method: 'POST' });
        const recaptchaResult = await recaptchaResponse.json();

        if(!recaptchaResponse.ok || !recaptchaResult.success || recaptchaResult.score <= 0.4){
          console.log(recaptchaResult)
          return res.status(400).json({error: 'Google ReCAPTCHA error! Please try again later.'})
        }

        if (!username || !password) {
            console.log('Username or password missing');
            return res.status(400).json({ error: 'Username and password are required' });
          }
        const existingUser = await Users.findOne({email: username})

        console.log(`Received username: ${username}, password: ${password}`);
        if(!existingUser){
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        if(existingUser){


          if(username !== existingUser.email || !await bcrypt.compare(password, existingUser.password)){
            return res.status(400).json({error: 'Invalid credentials'})
          }

          else {
            const token = jwt.sign({ username: existingUser.email }, jwtSecret, { expiresIn: '1h' });
            console.log('Token generated');
            return res.status(200).json({ token: token, isAdmin: existingUser.isAdmin});  
          }
        }
    } catch (error) {
        console.error('Error processing request', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
  }))


  export default loginRouter.handler({
    onError: (err:any, req, res) => {
      console.error(err.stack);
      res.status(err.statusCode || 500).end(err.message);
    },
  });
