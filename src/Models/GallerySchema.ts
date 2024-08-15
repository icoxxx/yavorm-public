import mongoose, { Schema } from 'mongoose';
import { GalleryItemType } from '@/types/galleryItem';


const GalleryItemSchema: Schema= new Schema({
    galleryName: {
        type: String,
    },
    images: {
        type: [String],
    },
    date: {
        type: Date,
        default: Date.now,
    },
    category: {
        type: String,
    }
});


const GalleryItem = mongoose.models.GalleryItem || mongoose.model<GalleryItemType>('GalleryItem', GalleryItemSchema);

export default GalleryItem;