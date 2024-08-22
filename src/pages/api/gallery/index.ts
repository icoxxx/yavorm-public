import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { createRouter, expressWrapper } from 'next-connect';
import cors from 'cors';
import path from 'path';
import express, { RequestHandler } from 'express';
import connectDB from '@/lib/connectMongo';
import GalleryItem from '@/Models/GallerySchema';
import { promisify } from 'util';


// Extending NextApiRequest to include files property
export interface NextApiRequestWithFiles extends NextApiRequest {
    files?: Express.Multer.File[];
}

// Static middleware setup
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

// Directory for uploads
const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'gallery');

// CORS options
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
};

// Multer setup for handling multiple files
const storage = multer.diskStorage({
  destination: uploadPath,
  filename: (req, file, cb) => {
    const date = new Date().toISOString().replace(/[:.]/g, '-');
    cb(null, `${date}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Middleware for multiple file upload

/* const uploadMiddleware: RequestHandler = (req, res, next) => {
  upload.array('images', 10)(req, res, (err: any) => {
    if (err) {
      console.error('Error uploading files:', err);
      return res.status(500).json({ success: false, message: 'Error uploading files' });
    }
    next();
  });
}; */

const uploadMiddlewareAsync = promisify(upload.array('images', 10));

// Middleware to connect to MongoDB
const withDatabase = (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await connectDB();
      await handler(req, res);
    } catch (error) {
      console.error('Error connecting to database:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
};

// Get all gallery items
const getAllItems = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const items = await GalleryItem.find().sort({ date: -1 });

    return res.status(200).json({ items });
  } catch (error) {
    console.error('Error fetching items:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Create a gallery item with multiple images
const createItem = async (req: NextApiRequestWithFiles, res: NextApiResponse) => {
  try {
    const { galleryName, category } = req.body;
    const images = req.files ? req.files.map((file: any) => file.filename) : [];

    const newItem = await GalleryItem.create({ galleryName, images, category });

    return res.status(201).json({
      success: true,
      item: newItem,
      message: 'Gallery item created successfully!',
    });
  } catch (error:any) {
    console.error('Error creating item:', error);
    throw new Error('Update failed');
  }
};

// Set up router
const galleryRouter = createRouter<NextApiRequest, NextApiResponse>();

galleryRouter.use(cors(corsOptions));
galleryRouter.use('/uploads/gallery', expressWrapper(staticMiddleware(uploadPath)));
galleryRouter.use(cacheControlMiddleware);
galleryRouter.get(withDatabase(getAllItems));
galleryRouter.post(withDatabase(async (req: NextApiRequestWithFiles, res: NextApiResponse /*, db: Db*/ ) => {
    console.log('Handler reached for POST request');
    try {
      await uploadMiddlewareAsync(req as any, res as any);
      await createItem(req, res);
    } catch (error: any) {
      console.error('Error handling POST request:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }));

export const config = {
  api: {
    bodyParser: false,
  },
};

export default galleryRouter.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
