import App from './app.js'
import Database from './config/database.js';

export default class Server {
  private app: App;
  private database: Database;
  private port: number;

  constructor() {
    this.app = new App();
    this.database = new Database();
    this.port = parseInt(process.env.PORT || '3000');
  }

  public async start(): Promise<void> {
    try {
      await this.database.connect();
      
      this.app.getExpressApp().listen(this.port, () => {
        console.log(`Server running on port http://localhost:${this.port}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  public async stop(): Promise<void> {
    try {
      await this.database.disconnect();
      console.log('Server stopped');
    } catch (error) {
      console.error('Error stopping server:', error);
    }
  }
}

const server = new Server();
server.start();
