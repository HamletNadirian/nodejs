import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

export const startMongoContainer = async (): Promise<void> => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
};

export const stopMongoContainer = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  if (mongoServer) {
    await mongoServer.stop();
  }
};

export const clearDatabase = async (): Promise<void> => {
  if (!mongoose.connection.db) {
    throw new Error('Database connection is not established');
  }
  await mongoose.connection.db.dropDatabase();
};