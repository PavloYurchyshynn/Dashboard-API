import { UserController } from './users/users.controller';
import express, { Express } from 'express';
import { Server } from 'http'
import { LoggerService } from './logger/logger.service';

export class App {
    app: Express
    server: Server
    port: number
    logger: LoggerService
    userController: UserController

    constructor(
        logger: LoggerService,
        userController: UserController
    ) {
        this.app = express()
        this.port = 8000
        this.logger = logger
        this.userController = userController
    }

    useRouter() {
        this.app.use('/users', this.userController.router)
    }

    public async init() {
        this.useRouter()
        this.server = this.app.listen(this.port)
        this.logger.log(`сервер запушений на http://localhost:${this.port}`);
    }
}