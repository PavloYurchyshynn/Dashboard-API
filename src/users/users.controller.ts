import { ILogger } from './../logger/logger.interface';
import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IUsersController } from './users.controller.interface';

@injectable()
export class UserController extends BaseController implements IUsersController {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		super(loggerService);
		this.bindRoutes([
			{ path: '/register', method: 'post', func: this.register },
			{ path: '/login', method: 'post', func: this.login },
		]);
	}

	public login(req: Request, res: Response, next: NextFunction): void {
		next(new HTTPError(401, 'помилка авторизації', 'login'));
	}

	public register(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'register');
	}
}
