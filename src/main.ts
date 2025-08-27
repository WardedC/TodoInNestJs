import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Solucionar CORS
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Mi API con Nest')
    .setDescription('Documentación de la API estilo Swagger')
    .setVersion('1.0')
    .addBearerAuth() // 👈 si usas JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
