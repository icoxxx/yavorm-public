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
        fs.unlink(path.join(process.cwd(), 'public', 'uploads', 'blogs', oldImage), (err) => {
          if (err) {
            console.error('Error deleting file from disk:', err);
            return res.status(500).json({ success: false, message: 'Error deleting file from disk' });
          }
          console.log('File deleted successfully from disk:', oldImage);
          return res.status(200).json({
            success: true,
            item: updatedItem,
            message: 'Item updated and file uploaded successfully!'
          });
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
 
    } catch (error) {
      console.error('Error updating item:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
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
        fs.unlink(path.join(process.cwd(), 'public', 'uploads', 'blogs', item.image), (err) => {
          if (err) {
            console.error('Error deleting file from disk:', err);
            return res.status(500).json({ success: false, message: 'Error deleting file from disk' });
          }
          console.log('File deleted successfully from disk:', item.image);
          return res.status(200).json({
            success: true,
            message: 'Item and file deleted successfully!'
          });
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
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };

  const blogIdRouter = createRouter<NextApiRequest, NextApiResponse>();
  blogIdRouter.use(cors(corsOptions));
  blogIdRouter.use('/uploads/blogs', expressWrapper(staticMiddleware(uploadPath)));
  blogIdRouter.put(deleteAndPutwithDatabase(async (req: NextApiRequest, res: NextApiResponse /*, db: Db*/) => {

      uploadMiddleware(req as any, res as any, async (err: any) => {
          if (err) {
            console.error('Error editing file:', err);
            res.status(500).json({ success: false, message: 'Error uploading file' });
            return;
          }
          await updateItem(req, res /*, db*/);
         });

  }));
  blogIdRouter.delete(deleteAndPutwithDatabase(async (req: NextApiRequest, res: NextApiResponse /*, db: Db*/ ) => {
    await deleteItem(req, res /*, db */ );
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