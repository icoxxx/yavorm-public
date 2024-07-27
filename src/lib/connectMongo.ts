import mongoose from 'mongoose';

const mongoURI = "mongodb://127.0.0.1:27017/database";

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    global.mongoose.promise = mongoose.connect(mongoURI).then((mongoose) => {
      return mongoose;
    });
  }

  global.mongoose.conn = await global.mongoose.promise;
  return global.mongoose.conn;
};

export default connectDB;


