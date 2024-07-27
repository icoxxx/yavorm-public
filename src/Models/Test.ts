import mongoose, { Schema } from 'mongoose';
import { Test } from '@/types/test';


const TestSchema: Schema= new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    image: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});


const TestItem = mongoose.models.TestItem || mongoose.model<Test>('TestItem', TestSchema);

export default TestItem;