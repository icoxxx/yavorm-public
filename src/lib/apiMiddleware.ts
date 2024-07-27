import { MongoClient, Db, GridFSBucket } from 'mongodb';



export const connectToDatabase = async (): Promise<Db> => {
    let client: MongoClient | null = null;
    const mongoURI = 'mongodb://127.0.0.1:27017/database';
    const dbName = 'database';
    let db: Db | null = null;
    if(db){
      return db
    }
  try {
    if (!db) {
      client = await MongoClient.connect(mongoURI);
      db = client.db(dbName);
    }
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

export const getGridFSBucket = async (): Promise<GridFSBucket> => {
    try {
      const database = await connectToDatabase();
      return new GridFSBucket(database, {
        bucketName: 'fileUploads',
      });
    } catch (error) {
      console.error('Failed to get GridFSBucket:', error);
      throw error;
    }
  };