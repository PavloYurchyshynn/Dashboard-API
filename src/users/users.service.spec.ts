import 'reflect-metadata';
import { IUserService } from './user.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { IConfigService } from './../config/config.service.interface';
import { Container } from 'inversify';
import { UserService } from './user.service';
import { TYPES } from '../types';
import { User } from './user.entity';
import { UserModel } from '@prisma/client';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	usersService = container.get<IUserService>(TYPES.UserService);
});

let createUser: UserModel | null;

describe('User Service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);
		createUser = await usersService.createUser({
			email: 'pasha123@gmail.com',
			name: 'Pasha',
			password: '1',
		});
		expect(createUser?.id).toEqual(1);
		expect(createUser?.password).not.toEqual('1');
	});

	it('validateUser - success', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createUser);
		const validateUser = await usersService.validateUser({
			email: 'pasha123@gmail.com',
			password: '1',
		});
		expect(validateUser).toBeTruthy();
	});

	it('validateUser - wrong password', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createUser);
		const validateUser = await usersService.validateUser({
			email: 'pasha123@gmail.com',
			password: '2',
		});
		expect(validateUser).toBeFalsy();
	});

	it('validateUser - wrong user', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(null);
		const validateUser = await usersService.validateUser({
			email: 'oleh@gmail.com',
			password: '2',
		});
		expect(validateUser).toBeFalsy();
	});
});
