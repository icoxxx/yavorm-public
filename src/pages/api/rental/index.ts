import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { Db,} from 'mongodb';
import { RequestHandler } from 'express';
import RentalItem from '../../../Models/RentalSchema'; 
// import { connectToDatabase, getGridFSBucket } from '@/lib/apiMiddleware';
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

const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'rental');

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

// Middleware to ensure MongoDB connection is established
const withDatabase = (handler: (req: NextApiRequest, res: NextApiResponse /*, db: Db*/) => Promise<void>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await connectDB();
      // const database = await connectToDatabase();
      await handler(req, res /*, database */);
    } catch (error) {
      console.error('Error connecting to database:', error);
     return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
};

// Middleware to validate request body for POST and PUT requests
const validateRequestBody = (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
  const { description, itemName } = req.body;
  if (!description || !itemName) {
    return res.status(400).json({ success: false, message: 'Description and Name are required fields' });
  }
  next();
};


// Get all items
const getAllItems = async (req: NextApiRequest, res: NextApiResponse /*, db: Db*/ ) => {
  try {

    const items = await RentalItem.find().sort({ date: -1 });

    return res.status(200).json({ items }); 
  } catch (error) {
    console.error('Error fetching items:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Create item with image upload
const createItem = async (req: NextApiRequest, res: NextApiResponse /*, db: Db*/ ) => {
  try {
    const { description, itemName, modelName, rentalCategory, category, } = req.body;
    
    const image = req.file ? req.file.filename : '';

    const newItem = await RentalItem.create({ itemName, description, modelName, rentalCategory, image, category });
    console.log(newItem)
    
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
  } catch (error) {
    console.error('Error creating item:', error);
    throw new Error('Error updating item!');
  }
};

const router = createRouter<NextApiRequest, NextApiResponse>();
router.use(cors(corsOptions));
router.use('/uploads/rental', expressWrapper(staticMiddleware(uploadPath)));
router.use(cacheControlMiddleware);
router.get(withDatabase(async (req: NextApiRequest, res: NextApiResponse /*, db: Db*/ ) => {
    console.log('Handler reached for GET request');
   await getAllItems(req, res /*, db*/);
  }));
router.post(withDatabase(async (req: NextApiRequest, res: NextApiResponse /*, db: Db*/ ) => {
    console.log('Handler reached for POST request');
    try {
      await uploadMiddlewareAsync(req as any, res as any);
      validateRequestBody(req, res, async ()=> {
        await createItem(req, res);
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


  export default router.handler({
    onError: (err:any, req, res) => {
      console.error(err.stack);
      res.status(err.statusCode || 500).end(err.message);
    },
  });