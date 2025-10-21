import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export default class Database {
  private uri: string;

  constructor() {
    this.uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/darna';
  }

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(this.uri);
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log('Database disconnected');
    } catch (error) {
      console.error('Database disconnection failed:', error);
    }
  }
}


