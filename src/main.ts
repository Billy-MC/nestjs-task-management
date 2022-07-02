import { TransformInterceptor } from './transform.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import Helmet from 'helmet';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalInterceptors(new TransformInterceptor());
	app.use(Helmet());

	const config = new DocumentBuilder()
		.setTitle('Tasks example')
		.setDescription('The tasks API description')
		.setVersion('1.0')
		.addTag('tasks')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api-doc', app, document);

	await app.listen(3000);
}
bootstrap();
