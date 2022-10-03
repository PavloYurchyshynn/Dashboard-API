import { ILogger } from './logger/logger.interface';
import { ExeptionFilter } from './errors/exeption.filter';
import { UserController } from './users/users.controller';
import express, { Express } from 'express';
import { Server } from 'http';
import { injectable, inject } from 'inversify';
import { TYPES } from './types';
import 'reflect-metadata';
import { json } from 'body-parser';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: ExeptionFilter,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(json());
	}

	useRouter(): void {
		this.app.use('/users', this.userController.router);
	}

	useExeptionFilters(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRouter();
		this.useExeptionFilters();
		this.server = this.app.listen(this.port);
		this.logger.log(`сервер запушений на http://localhost:${this.port}`);
	}
}
