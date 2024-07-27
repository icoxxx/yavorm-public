import mongoose, { Schema } from 'mongoose';
import { User } from '@/types/user';




const UserSchema: Schema= new Schema({
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    isAdmin: {
        type: Boolean,
    },
});


const Users = mongoose.models.Users || mongoose.model<User>('Users', UserSchema);

export default Users;