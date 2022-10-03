import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Не правильно вказаний email' })
	email: string;

	@IsString({ message: 'Не вказаний пароль' })
	password: string;

	@IsString({ message: 'Не вказано імя' })
	name: string;
}
