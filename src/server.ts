import dotenv from 'dotenv';
import mongoose from 'mongoose';
import App from './app.js';

dotenv.config();

export default class Server {
  private app: App;
  private port: number;

  constructor() {
    this.app = new App();
    this.port = parseInt(process.env.PORT || '3000');
  }

  public async start(): Promise<void> {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/darna');
    console.log('Database connected');

    this.app.getExpressApp().listen(this.port, () => {
      console.log(`Server running on http://localhost:${this.port}`);
    });
  }
}

const server = new Server();
server.start();