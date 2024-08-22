import BlogItem from '../../../Models/BlogSchema';
import multer from 'multer';
import { RequestHandler } from 'express';
import { MongoClient, Db, GridFSBucket } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path'
//import { connectToDatabase, getGridFSBucket } from '@/lib/apiMiddleware';
import connectDB from '@/lib/connectMongo';
import { createRouter, expressWrapper } from "next-connect";
import cors from 'cors';
import express from 'express';
import { promisify } from 'util';

// commented GridFS file upload as the app wont need it for now, keeping it if there will be large file uploads

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'PUT', 'DELETE'],
};
const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'blogs');

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
const deleteAndPutwithDatabase = (handler: (req: NextApiRequest, res: NextApiResponse /*, db: Db*/ ) => Promise<void>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await connectDB();
      // const database = await connectToDatabase();
      await handler(req, res /*, database*/ );
    } catch (error) {
      console.error('Error connecting to database:', error);
     return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
};

const getSingleItem = async (req: NextApiRequest, res: NextApiResponse /*, db: Db*/) => {
  try {
    const {id} = req.query;

    if(!id){
      return res.status(400).json({ success: false, message: 'Item ID is required' });
    }
    const item = await BlogItem.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    return res.status(200).json({ success: true, item }); 
  } catch (error) {
    console.error('Error fetching items:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


// Update item by ID
const updateItem = async (req: NextApiRequest, res: NextApiResponse /*, db: Db*/ ) => {
    try {
      const itemId = req.query.id as string;
      const { blogTitle, blogText, blogAuthor, instaLink, fbLink, category } = req.body;
      let image: string | undefined;
  
      if (req.file) {
        image = req.file.filename;
      }
  
      const oldItem = await BlogItem.findById(itemId);
      let oldImage: any;
      if(oldItem){
        oldImage = oldItem.image;
      } 
      const updatedItem = await BlogItem.findByIdAndUpdate(itemId, { blogTitle, blogText, blogAuthor, instaLink, fbLink, image, category }, { new: true });
      console.log(updateItem)
  
      if (!updatedItem) {
         res.status(404).json({ success: false, message: 'Item not found' });
          return;
        }
  
      if (req.file && image) {
        // const bucket = await getGridFSBucket();
  
        // Delete the old image from GridFS
        /* if (oldImage) {
          const files = await bucket.find({ filename: oldImage }).toArray();
          if (files.length > 0) {
            const fileId = files[0]._id;
            await bucket.delete(fileId);
            console.log('Old file deleted successfully from GridFS:', oldImage);
          } else {
            console.error('Old file not found in GridFS:', oldImage);
          }
        } */
  
        // delete the old img from fs
        const unlinkAsync = promisify(fs.unlink);
        try {
          await unlinkAsync(path.join(process.cwd(), 'public', 'uploads', 'blogs', oldImage));
          console.log('File deleted successfully from disk:', oldImage);
        } catch (error:any) {
          console.error('Error deleting file from disk:', error);
          throw new Error('File deleting failed');
        }
        return res.status(200).json({
          success: true,
          item: updatedItem,
          message: 'Item updated and file uploaded successfully!'
        });
        //upload the new img to GridFS
  
       /* const uploadStream = bucket.openUploadStream(image);
        uploadStream.end(req.file.buffer);
  
        uploadStream.on('error', (error) => {
          console.error('Error uploading file:', error);
          res.status(500).json({ success: false, message: 'Error uploading file' });
        });
  
        uploadStream.on('finish', () => {
          res.status(200).json({
            success: true,
            item: updatedItem,
            message: 'Item updated and file uploaded successfully!'
          });
        });
      } else {
        res.status(200).json({
          success: true,
          item: updatedItem,
          message: 'Item updated successfully without changing the image!'
        }); */
      } else {
        return res.status(200).json({
          success: true,
          item: updatedItem,
          message: 'Item updated successfully without changing the image!'
        }); 
      }
 
    } catch (error:any) {
      console.error('Error updating item:', error);
      throw new Error('Error updating item!');
    }
  };
  
  // Delete item by ID
  const deleteItem = async (req: NextApiRequest, res: NextApiResponse /*, db: Db*/) => {
    try {
      const itemId = req.query.id as string;
      if (!mongoose.Types.ObjectId.isValid(itemId)) {
          res.status(400).json({ success: false, message: 'Invalid ID format' });
          return;
        }
  
      const item = await BlogItem.findByIdAndDelete(itemId);
  
      if (!item) {
        res.status(404).json({ success: false, message: 'Item not found' });
        return;
      }
  
      if (item.image) {
        const unlinkAsync = promisify(fs.unlink);
        try {
          await unlinkAsync(path.join(process.cwd(), 'public', 'uploads', 'blogs', item.image));
          console.log('File deleted successfully from disk:', item.image);
        } catch (error:any) {
          console.error('Error deleting file from disk:', error);
          throw new Error('File deleting failed');
        }

        return res.status(200).json({
          success: true,
          message: 'Item and file deleted successfully!'
        });
        //const bucket = await getGridFSBucket();
        //const files = await bucket.find({ filename: item.image }).toArray();

        /* if (files.length > 0) {
          const fileId = files[0]._id;
          await bucket.delete(fileId);
        
        } else {
          res.status(404).json({ success: false, message: 'File not found in GridFS' });
          return;
        } */
      } else {
          return res.status(201).json({ success: true, message: 'Item deleted, but file/image not found!' });
        }
    } catch (error:any) {
      console.error('Error deleting item:', error);
      throw new Error('File deleting failed');
    }
  };

  const blogIdRouter = createRouter<NextApiRequest, NextApiResponse>();
  blogIdRouter.use(cors(corsOptions));
  blogIdRouter.use('/uploads/blogs', expressWrapper(staticMiddleware(uploadPath)));
  blogIdRouter.use(cacheControlMiddleware);
  blogIdRouter.put(deleteAndPutwithDatabase(async (req: NextApiRequest, res: NextApiResponse /*, db: Db*/) => {
    try {
      await uploadMiddlewareAsync(req as any, res as any);
      await updateItem (req, res);
    } catch (error:any) {
      console.error('Error updating file:', error);
      return res.status(500).json({ success: false, message: 'Error updating file' });
    }
  }));
  blogIdRouter.delete(deleteAndPutwithDatabase(async (req: NextApiRequest, res: NextApiResponse /*, db: Db*/ ) => {
    try {
      await deleteItem(req, res /*, db */ );
    } catch (error:any) {
      console.error('Error while deleting file:', error);
      return res.status(500).json({ success: false, message: 'Error deleting file' });
    }
  }))
  blogIdRouter.get(deleteAndPutwithDatabase(async (req: NextApiRequest, res: NextApiResponse /*, db: Db*/ ) => {
    await getSingleItem(req, res /*, db*/);
  }))

  export const config = {
    api: {
      bodyParser: false
    }
  }


  export default blogIdRouter.handler({
    onError: (err:any, req, res) => {
      console.error(err.stack);
      res.status(err.statusCode || 500).end(err.message);
    },
  });