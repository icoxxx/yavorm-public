import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';
import { createRouter } from 'next-connect';
import connectDB from '@/lib/connectMongo';
import { connectToDatabase } from '@/lib/apiMiddleware';
import { Db } from 'mongodb';
import Users from '@/Models/Users';

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

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['POST'],
  };


dotenv.config();


const jwtSecret = process.env.JWT_SECRET;
const resetPasswordSecret = process.env.RESET_PASSWORD_SECRET || 'reset_password_secret';
const resetPasswordExpiration = parseInt(process.env.RESET_PASSWORD_EXPIRATION || '3600', 10);

if (!jwtSecret || !resetPasswordSecret) {
    throw new Error('Environment variable JWT_SECRET must be set');
  }


const resetRouter = createRouter<NextApiRequest, NextApiResponse>();

resetRouter.use(cors(corsOptions));

resetRouter.post(withDatabase(async (req:NextApiRequest, res: NextApiResponse, db: Db) => {
    const { token, newPassword } = req.body;
    try {
      const decoded = jwt.verify(token, resetPasswordSecret) as { username: string, token: string };
      const user = await Users.findOne({email: decoded.username});

      if (!user) {
        return res.status(400).json({ error: 'Invalid token' });
      }

      const newHashedPassword = bcrypt.hashSync(newPassword, 10);
      const updateUser = await Users.findByIdAndUpdate(user._id, {password: newHashedPassword}, { new: true });

      if(!updateUser){
        return res.status(400).json({error: 'Error changing the password from Database!'})
      }
  
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
      console.error('Error verifying token:', err);
      res.status(400).json({ error: 'Invalid or expired token' });
    }
}));

export default resetRouter.handler({
  onError: (err:any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});