declare module 'mongoose-gridfs' {
    import { Connection } from 'mongoose';
    import { GridFSBucket, ObjectId } from 'mongodb';
  
    export interface MongoGridFSOptions {
      _id?: string | number | object;
      filename: string;
      metadata?: object;
      contentType?: string;
      disableMD5?: boolean;
      aliases?: string[];
      chunkSizeBytes?: number;
      start?: number;
      end?: number;
      revision?: number;
    }
  
    export interface GridFSModelOptions {
      connection?: Connection;
      modelName?: string;
      bucketName?: string;
      chunkSizeBytes?: number;
    }
  
    export type WriteCallback = (err: Error | null, file: any) => void;
    export type ReadCallback = (err: Error | null, buffer: Buffer) => void;
    export type DeleteCallback = (err: Error | null) => void;
    export type FindCallback = (err: Error | null, result: any) => void;
  
    export class MongooseGridFS {
      constructor(options: GridFSModelOptions);
      createWriteStream(options: MongoGridFSOptions): GridFSBucket;
      createReadStream(options: MongoGridFSOptions): GridFSBucket;
      writeFile(
        file: MongoGridFSOptions,
        readStream: NodeJS.ReadableStream,
        writeCb: WriteCallback
      ): void;
      readFile(file: MongoGridFSOptions, readCb: ReadCallback): void;
      deleteFile(fileId: string | number | ObjectId, deleteCb: DeleteCallback): void;
      findOne(file: MongoGridFSOptions, findCb: FindCallback): void;
      findById(fileId: string | number | ObjectId, findCb: FindCallback): void;
    }
  
    export function createBucket(options?: GridFSModelOptions): GridFSBucket;
  }
  