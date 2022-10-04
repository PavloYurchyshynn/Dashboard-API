import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Не правильно вказаний email' })
	email: string;

	@IsString({ message: 'Не вказаний пароль' })
	password: string;
}
