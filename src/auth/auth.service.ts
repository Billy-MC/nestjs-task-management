import { IJwtPayload } from './interface/jwt-payload.interface';
import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		private jwtService: JwtService
	) {}

	async signUp(authCredentialsDto: AuthCredentialDto): Promise<void> {
		const { username, password } = authCredentialsDto;

		//hash
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = this.usersRepository.create({ username, password: hashedPassword });
		try {
			await this.usersRepository.save(user);
		} catch (err) {
			if (err.code === '23505') {
				throw new ConflictException('Username already exists');
			} else {
				throw new InternalServerErrorException();
			}
		}
	}

	async signIn(authCredentialsDto: AuthCredentialDto): Promise<{ accessToken: string }> {
		const { username, password } = authCredentialsDto;
		const user = await this.usersRepository.findOne({ where: { username } });

		const correctPassword = await bcrypt.compare(password, user.password);

		if (user && correctPassword) {
			const payload: IJwtPayload = { username };
			const accessToken: string = this.jwtService.sign(payload);
			return { accessToken };
		}
		throw new UnauthorizedException('Please check your login credentials');
	}
}
