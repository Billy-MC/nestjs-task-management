import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		TasksModule,
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			username: 'ming',
			password: 'ming',
			database: 'nestjs',
			autoLoadEntities: true,
			synchronize: true,
		}),
		AuthModule,
		ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
