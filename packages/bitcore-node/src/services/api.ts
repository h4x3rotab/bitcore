import * as http from 'http';
import app from '../routes';
import logger from '../logger';
import config from '../config';
import { LoggifyClass } from '../decorators/Loggify';
import { Storage, StorageService } from './storage';
import { Socket, SocketService } from './socket';
import { ConfigService, Config } from './config';

@LoggifyClass
export class ApiService {
  port: number;
  host: string;
  timeout: number;
  configService: ConfigService;
  storageService: StorageService;
  socketService: SocketService;
  httpServer: http.Server;
  app: typeof app;
  stopped = true;

  constructor({
    port = 3000,
    host = '127.0.0.1',
    timeout = 600000,
    configService = Config,
    storageService = Storage,
    socketService = Socket
  } = {}) {
    this.port = Number(process.env.BITCORE_NODE_HTTP_PORT) || port;
    this.host = process.env.BITCORE_NODE_HTTP_HOST || host;
    this.timeout = timeout;
    this.configService = configService;
    this.storageService = storageService;
    this.socketService = socketService;
    this.app = app;
    this.httpServer = new http.Server(app);
  }

  async start() {
    if (this.configService.isDisabled('api')) {
      logger.info(`Disabled API Service`);
      return;
    }
    if (!this.storageService.connected) {
      await this.storageService.start({});
    }
    if (this.stopped) {
      this.stopped = false;
      this.httpServer.timeout = this.timeout;
      this.httpServer.listen(this.port, this.host, () => {
        logger.info(`Starting API Service on port ${this.port}`);
        this.socketService.start({ server: this.httpServer });
      });
    }
    return this.httpServer;
  }

  stop() {
    this.stopped = true;
    return new Promise(resolve => {
      this.httpServer.close(() => {
        logger.info("Stopped API Service")
        resolve();
      });
      this.httpServer.emit('close');
    });
  }
}

// TOOO: choose a place in the config for the API timeout and include it here
export const Api = new ApiService({
  port: config.port
});
