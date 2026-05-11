import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
  const config = new DocumentBuilder()
    .setTitle('Decura Cradit')
    .setDescription('The Decura Cradit API description')
    .setVersion('1.0')
    .addBasicAuth()
    .addBearerAuth()
    .build();
    app.enableCors();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
