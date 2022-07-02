import { TransformInterceptor } from './transform.interceptor';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import Helmet from 'helmet';

async function bootstrap() {
	const PORT = process.env.PORT;
	const logger = new Logger();
	const app = await NestFactory.create(AppModule);
	const config = new DocumentBuilder()
		.setTitle('Tasks example')
		.setDescription('The tasks API description')
		.setVersion('1.0')
		.addTag('tasks')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	app.enableCors();
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalInterceptors(new TransformInterceptor());
	app.use(Helmet());
	SwaggerModule.setup('api-doc', app, document);

	await app.listen(PORT);
	logger.log(`Application listening on port ${PORT}`);
}
bootstrap();
