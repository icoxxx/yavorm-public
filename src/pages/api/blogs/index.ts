import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { Db,} from 'mongodb';
import { RequestHandler } from 'express';
import BlogItem from '../../../Models/BlogSchema'; 
//import { connectToDatabase, getGridFSBucket } from '@/lib/apiMiddleware';
import path from 'path';
import connectDB from '@/lib/connectMongo';
import { createRouter, expressWrapper } from "next-connect";
import cors from 'cors';
import express from 'express';
import { promisify } from 'util';

// commented GridFS file upload as the app wont need it for now, keeping it if there will be large file uploads

function staticMiddleware(root: string) {
  return (req: NextApiRequest, res: NextApiResponse, next: any) => {
    express.static(root)(req as any, res as any, next);
  };
}

const cacheControlMiddleware = (req: NextApiRequest, res: NextApiResponse, next: (err?: any) => void) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
};

const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'blogs');

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
};


const storage = multer.diskStorage({
  destination: uploadPath, 
  filename: (req, file, cb) => {
    const date = new Date().toISOString().replace(/[:.]/g, '-');
    cb(null, `${date}-${file.originalname}`); 
  }
});

const upload = multer({ storage });

const uploadMiddlewareAsync = promisify(upload.single('image'));

// Middleware for MongoDB connection 
const withDatabase = (handler: (req: NextApiRequest, res: NextApiResponse /*, db: Db*/) => Promise<void>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await connectDB();
      //const database = await connectToDatabase();
      await handler(req, res /*, database*/);
    } catch (error) {
      console.error('Error connecting to database:', error);
     return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
};

// Middleware to validate request body for POST requests.
const validateRequestBody = (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
  const { blogTitle, blogText, blogAuthor } = req.body;
  if (!blogTitle || !blogText || !blogAuthor) {
    return res.status(400).json({ success: false, message: 'Description and Name are required fields' });
  }
  next();
};


// Get all items
const getAllItems = async (req: NextApiRequest, res: NextApiResponse /*, db: Db*/) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const items = await BlogItem.find().sort({ date: -1 }).skip(skip).limit(Number(limit));
    const totalItems = await BlogItem.countDocuments();
    const totalPages = Math.ceil(totalItems / Number(limit));

    return res.status(200).json({ items, currentPage: Number(page), totalPages, totalItems, }); 
  } catch (error) {
    console.error('Error fetching items:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Create item with image upload
const createItem = async (req: NextApiRequest, res: NextApiResponse /*, db: Db*/) => {
  try {
    const { blogTitle, blogText, blogAuthor, instaLink, fbLink, category } = req.body;
    
    const image = req.file ? req.file.filename : '';

    const newItem = await BlogItem.create({ blogTitle, blogText, blogAuthor, instaLink, fbLink, image, category });
    return res.status(201).json({
      success: true,
      item: newItem,
      message: 'Item created successfully!'
    });

   /* if (req.file) {
      const bucket = await getGridFSBucket();
      const uploadStream = bucket.openUploadStream(image);
      uploadStream.end(req.file.buffer);

      uploadStream.on('error', (error) => {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Error uploading file' });
      });

      uploadStream.on('finish', () => {
      return res.status(201).json({
          success: true,
          item: newItem,
          message: 'Item created and file uploaded successfully!'
        });
      });
    } else {
     return res.status(201).json({
        success: true,
        item: newItem,
        message: 'Item created successfully without an image!'
      });
    } */

  } catch (error: any) {
    console.error('Error creating item:', error);
    throw new Error('Error creating item!');
  }
};

const blogRouter = createRouter<NextApiRequest, NextApiResponse>();
blogRouter.use(cors(corsOptions));
blogRouter.use('/uploads/blogs', expressWrapper(staticMiddleware(uploadPath)));
blogRouter.use(cacheControlMiddleware);
blogRouter.get(withDatabase(async (req: NextApiRequest, res: NextApiResponse /*, db: Db*/) => {
    console.log('Handler reached for GET request');
   await getAllItems(req, res /* , db */);
  }));
blogRouter.post(withDatabase(async (req: NextApiRequest, res: NextApiResponse /*, db: Db*/) => {
    console.log('Handler reached for POST request');
    try {
      await uploadMiddlewareAsync(req as any, res as any);
      validateRequestBody(req, res, async () => {
       await createItem(req, res /* , db*/ );
      });
    } catch (error:any) {
      console.error('Error uploading/creating file:', error);
      res.status(500).json({ success: false, message: 'Error creating file' });
    }
  }));


  export const config = {
    api: {
      bodyParser: false
    }
  }


  export default blogRouter.handler({
    onError: (err:any, req, res) => {
      console.error(err.stack);
      res.status(err.statusCode || 500).end(err.message);
    },
  });