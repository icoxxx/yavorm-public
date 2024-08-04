import mongoose, { Schema } from 'mongoose';
import { RentalItemType } from '@/types/rentalItem';


const RentalItemSchema: Schema= new Schema({
    itemName: {
        type: String,
    },
    description: {
        type: String,
    },
    modelName: {
        type: String,
    },
    rentalCategory: {
        type: String,
    },
    image: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    category: {
        type: String,
    }
});


const RentalItem = mongoose.models.RentalItem || mongoose.model<RentalItemType>('RentalItem', RentalItemSchema);

export default RentalItem;