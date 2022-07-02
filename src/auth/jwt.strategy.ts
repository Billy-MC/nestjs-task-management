import { IJwtPayload } from './interface/jwt-payload.interface';
import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>
	) {
		super({
			secretOrKey: 'ILOVEIZ*ONE&MIYAWAKI_SAKURA',
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		});
	}
	async validate(payload: IJwtPayload): Promise<User> {
		const { username } = payload;
		const user: User = await this.usersRepository.findOne({
			where: {
				username,
			},
		});
		if (!user) throw new UnauthorizedException();

		return user;
	}
}
