import { ILogger } from './logger/logger.interface';
import { ExeptionFilter } from './errors/exeption.filter';
import { UserController } from './users/users.controller';
import express, { Express } from 'express';
import { Server } from 'http'

export class App {
    app: Express
    server: Server
    port: number
    logger: ILogger
    userController: UserController
    exeptionFilter: ExeptionFilter

    constructor(
        logger: ILogger,
        userController: UserController,
        exeptionFilter: ExeptionFilter
    ) {
        this.app = express()
        this.port = 8000
        this.logger = logger
        this.userController = userController
        this.exeptionFilter = exeptionFilter
    }

    useRouter() {
        this.app.use('/users', this.userController.router)
    }

    useExeptionFilters() {
        this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter))
    }

    public async init() {
        this.useRouter()
        this.useExeptionFilters()
        this.server = this.app.listen(this.port)
        this.logger.log(`сервер запушений на http://localhost:${this.port}`);
    }
}