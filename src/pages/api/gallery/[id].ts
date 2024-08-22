import GalleryItem from '@/Models/GallerySchema';
import multer from 'multer';
import { RequestHandler } from 'express';
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path'
import connectDB from '@/lib/connectMongo';
import { createRouter, expressWrapper } from "next-connect";
import cors from 'cors';
import express from 'express';
import { NextApiRequestWithFiles } from '.';
import { promisify } from 'util';



const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'PUT', 'DELETE'],
};
const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'gallery');

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

// Middleware for multiple file upload
  /*  const uploadMiddleware: RequestHandler = (req, res, next) => {
    upload.array('images', 10)(req, res, (err: any) => {
      if (err) {
        console.error('Error uploading files:', err);
        return res.status(500).json({ success: false, message: 'Error uploading files' });
      }
      next();
    });
  };*/
const uploadMiddlewareAsync = promisify(upload.array('images', 10));


// Middleware to ensure MongoDB connection is established
const deleteAndPutwithDatabase = (handler: (req: NextApiRequest, res: NextApiResponse ) => Promise<void>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await connectDB();
      await handler(req, res );
    } catch (error) {
      console.error('Error connecting to database:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
};

//get item by ID
const getSingleItem = async (req: NextApiRequest, res: NextApiResponse ) => {
  try {
    const {id} = req.query;

    if(!id){
      return res.status(400).json({ success: false, message: 'Item ID is required' });
    }
    const item = await GalleryItem.findById(id);
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
const updateItem = async (req: NextApiRequestWithFiles, res: NextApiResponse ) => {
    try {
      const itemId = req.query.id as string;
      const { galleryName, category} = req.body;
      let images: string[] | undefined;
  
      if (req.files && req.files.length > 0) {
        images = req.files.map((file: any) => file.filename);
      }
  
      const oldItem = await GalleryItem.findById(itemId);
      let oldImages: string[] | undefined;
      if(oldItem){
        oldImages = oldItem.images;
      } 
      const updatedItem = await GalleryItem.findByIdAndUpdate(itemId, { galleryName, images, category }, { new: true });
      console.log(updateItem)
  
      if (!updatedItem) {
          res.status(404).json({ success: false, message: 'Item not found' });
          return;
        }
  
      if (req.files && images && oldImages) {
            await Promise.all(
              oldImages.map(image => 
                new Promise((resolve, reject) => {
                  fs.unlink(path.join(uploadPath, image), err => {
                    if (err) {
                      console.error('Error deleting file from disk:', err);
                      reject(err);
                    } else {
                      console.log('File deleted successfully from disk:', image);
                      resolve(true);
                    }
                  });
                })
              )
        );
        return res.status(200).json({
          success: true,
          item: updatedItem,
          message: 'Item updated and files uploaded successfully!'
        });

      } else {
        res.status(200).json({
          success: true,
          item: updatedItem,
          message: 'Item updated successfully without changing the images!'
        });
      }
    } catch (error) {
        console.error('Error updating item:', error);
        throw new Error('Update failed');
    }
  };
  
  // Delete item by ID
  const deleteItem = async (req: NextApiRequestWithFiles, res: NextApiResponse /*, db: Db*/) => {
    try {
      const itemId = req.query.id as string;
      if (!mongoose.Types.ObjectId.isValid(itemId)) {
          res.status(400).json({ success: false, message: 'Invalid ID format' });
          return;
        }
  
      const item = await GalleryItem.findByIdAndDelete(itemId);
  
      if (!item) {
        res.status(404).json({ success: false, message: 'Item not found' });
        return;
      }
      const images: string[] | undefined = item.images
  
      if (images) {
        await Promise.all(
          images.map(image => 
            new Promise((resolve, reject) => {
              fs.unlink(path.join(uploadPath, image), err => {
                if (err) {
                  console.error('Error deleting file from disk:', err);
                  reject(err);
                } else {
                  console.log('File deleted successfully from disk:', image);
                  resolve(true);
                }
              });
            })
          )
        );

          return res.status(200).json({
            success: true,
            message: 'Item and file deleted successfully!'
          });
      } else {
        return res.status(200).json({
          success: true,
          message: 'Item deleted successfully without founding image file!'
        });
        }
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };

  const galleryIdRouter = createRouter<NextApiRequest, NextApiResponse>();
  galleryIdRouter.use(cors(corsOptions));
  galleryIdRouter.use('/uploads/gallery', expressWrapper(staticMiddleware(uploadPath)));
  galleryIdRouter.use(cacheControlMiddleware);
  galleryIdRouter.put(deleteAndPutwithDatabase(async (req: NextApiRequestWithFiles, res: NextApiResponse) => {

        try {
            // Await the upload middleware
            await uploadMiddlewareAsync(req as any, res as any);

            // Proceed to update the item after files are uploaded
            await updateItem(req, res);
        } catch (err) {
            console.error('Error handling PUT request:', err);
            res.status(500).json({ success: false, message: 'Error uploading file' });
        }

  }));
  galleryIdRouter.delete(deleteAndPutwithDatabase(async (req: NextApiRequestWithFiles, res: NextApiResponse) => {
    await deleteItem(req, res);
  }))

  galleryIdRouter.get(deleteAndPutwithDatabase(async (req: NextApiRequest, res: NextApiResponse) => {
    await getSingleItem(req, res);
  }))

  export const config = {
    api: {
      bodyParser: false
    }
  }


  export default galleryIdRouter.handler({
    onError: (err:any, req, res) => {
      console.error(err.stack);
      res.status(err.statusCode || 500).end(err.message);
    },
  });