import RentalItem from '../../../Models/RentalSchema';
import multer from 'multer';
import { RequestHandler } from 'express';
import { MongoClient, Db, GridFSBucket } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path'
import { connectToDatabase, getGridFSBucket } from '@/lib/apiMiddleware';
import connectDB from '@/lib/connectMongo';
import { createRouter, expressWrapper } from "next-connect";
import cors from 'cors';
import express from 'express';

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['PUT', 'DELETE'],
};
const uploadPath = path.join(process.cwd(), 'public', 'uploads');

function staticMiddleware(root: string) {
  return (req: NextApiRequest, res: NextApiResponse, next: any) => {
    express.static(root)(req as any, res as any, next);
  };
}

const storage = multer.diskStorage({
    destination: uploadPath,
    filename: (req, file, cb) => {
      const date = new Date().toISOString().replace(/[:.]/g, '-');
      cb(null, `${date}-${file.originalname}`); 
    }
  });
  
  const upload = multer({ storage });

  const uploadMiddleware: RequestHandler = (req: any, res, next) => {
    upload.single('image')(req, res, (err: any) => {
      if (err) {
        console.error('Error uploading file:', err);
        return res.status(500).json({ success: false, message: 'Error uploading file' });
      }
      next(); // Call next to proceed to the next middleware or route handler
    });
  };


// Middleware to ensure MongoDB connection is established
const deleteAndPutwithDatabase = (handler: (req: NextApiRequest, res: NextApiResponse, db: Db) => Promise<void>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await connectDB();
      const database = await connectToDatabase();
      await handler(req, res, database);
    } catch (error) {
      console.error('Error connecting to database:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
};

// Update item by ID
const updateItem = async (req: NextApiRequest, res: NextApiResponse, db: Db) => {
    try {
      const itemId = req.query.id as string;
      const { description, itemName, category } = req.body;
      let image: string | undefined;
  
      if (req.file) {
        image = req.file.filename;
      }
  
      const oldItem = await RentalItem.findById(itemId);
      let oldImage: any;
      if(oldItem){
        oldImage = oldItem.image;
      } 
      const updatedItem = await RentalItem.findByIdAndUpdate(itemId, { description, itemName, image, category }, { new: true });
      console.log(updateItem)
  
      if (!updatedItem) {
          res.status(404).json({ success: false, message: 'Item not found' });
          return;
        }
  
      if (req.file && image) {
        const bucket = await getGridFSBucket();
  
        // Delete the old image from GridFS
        if (oldImage) {
          const files = await bucket.find({ filename: oldImage }).toArray();
          if (files.length > 0) {
            const fileId = files[0]._id;
            await bucket.delete(fileId);
            console.log('Old file deleted successfully from GridFS:', oldImage);
          } else {
            console.error('Old file not found in GridFS:', oldImage);
          }
        }
  
        // delete the old img from fs
        fs.unlink(path.join(process.cwd(), 'public', 'uploads', oldImage), (err) => {
          if (err) {
            console.error('Error deleting file from disk:', err);
            return res.status(500).json({ success: false, message: 'Error deleting file from disk' });
          }
          console.log('File deleted successfully from disk:', oldImage);
        });
  
        //upload the new img to GridFS
  
        const uploadStream = bucket.openUploadStream(image);
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
        });
      }
    } catch (error) {
      console.error('Error updating item:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  
  // Delete item by ID
  const deleteItem = async (req: NextApiRequest, res: NextApiResponse, db: Db) => {
    try {
      const itemId = req.query.id as string;
      if (!mongoose.Types.ObjectId.isValid(itemId)) {
          res.status(400).json({ success: false, message: 'Invalid ID format' });
          return;
        }
  
      const item = await RentalItem.findByIdAndDelete(itemId);
  
      if (!item) {
        res.status(404).json({ success: false, message: 'Item not found' });
        return;
      }
  
      if (item.image) {
        const bucket = await getGridFSBucket();
        const files = await bucket.find({ filename: item.image }).toArray();
  
        if (files.length > 0) {
          const fileId = files[0]._id;
          await bucket.delete(fileId);
          
          fs.unlink(path.join(process.cwd(), 'public', 'uploads', item.image), (err) => {
            if (err) {
              console.error('Error deleting file from disk:', err);
              return res.status(500).json({ success: false, message: 'Error deleting file from disk' });
            }
            console.log('File deleted successfully from disk:', item.image);
            res.status(200).json({
              success: true,
              message: 'Item and file deleted successfully!'
            });
          });
        } else {
          res.status(404).json({ success: false, message: 'File not found in GridFS' });
          return;
        }
      } else {
          res.status(404).json({ success: false, message: 'Item does not have an image' });
        }
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };

  const testIdRouter = createRouter<NextApiRequest, NextApiResponse>();
  testIdRouter.use(cors(corsOptions));
  testIdRouter.use('/uploads', expressWrapper(staticMiddleware(uploadPath)));
  testIdRouter.put(deleteAndPutwithDatabase(async (req: NextApiRequest, res: NextApiResponse, db: Db) => {

      uploadMiddleware(req as any, res as any, async (err: any) => {
          if (err) {
            console.error('Error editing file:', err);
            res.status(500).json({ success: false, message: 'Error uploading file' });
            return;
          }
          await updateItem(req, res, db);
         });

  }));
  testIdRouter.delete(deleteAndPutwithDatabase(async (req: NextApiRequest, res: NextApiResponse, db: Db) => {
    await deleteItem(req, res, db);
  }))

  export const config = {
    api: {
      bodyParser: false
    }
  }


  export default testIdRouter.handler({
    onError: (err:any, req, res) => {
      console.error(err.stack);
      res.status(err.statusCode || 500).end(err.message);
    },
  });