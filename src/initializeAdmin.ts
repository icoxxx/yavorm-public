import Users from "./Models/Users.js";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import connectDB from "./lib/connectMongo.js";
import { connectToDatabase } from "./lib/apiMiddleware.js";
import bcrypt from 'bcryptjs';



dotenv.config();


const email = process.env.ADMIN_USERNAME;
const envPassword: any = process.env.INITIAL_PASSWORD;
const isAdmin = true;


const initializeAdmin = async ()=> {
    try {
        const password = bcrypt.hashSync(envPassword, 10);
        await connectDB();
        await connectToDatabase();
        const existingAdmin = await Users.findOne({isAdmin: true})
        if (existingAdmin){
            console.log('Admin user already exists');
            return;
        }
        await Users.create({
            email, password, isAdmin
        })

    } catch (error: any) {
        console.error('Error initializing admin user:', error);
    }
    finally{
        
        mongoose.connection.close();
    }
}

initializeAdmin().finally(() => process.exit(0));

