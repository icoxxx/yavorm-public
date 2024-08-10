import mongoose, { Schema } from 'mongoose';
import { BlogItemType } from '@/types/blogItem';

const BlogItemSchema: Schema = new Schema({
    blogTitle: {
        type: String,
    },
    blogText: {
        type: String,
    },
    blogAuthor: {
        type: String,
    },
    instaLink: {
        type: String,
    },
    fbLink:{
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

const BlogItem = mongoose.models.BlogItem || mongoose.model<BlogItemType>('BlogItem', BlogItemSchema);

export default BlogItem;