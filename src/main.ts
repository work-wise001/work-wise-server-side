import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

//   // swagger set up
//   const config = new DocumentBuilder()
//   .setTitle('Work Wise API Server')
//   .setDescription('The Work Wise API description')
//   .setVersion('1.0')
//   .addTag('api')
//   .addServer('https://work-wise-server-side.onrender.com/') // Online server
//   .addServer('http://localhost:3000') // Local server
//   .build();
// const document = SwaggerModule.createDocument(app, config);
//   // Save the JSON file to disk
//   writeFileSync('./swagger.json', JSON.stringify(document, null, 2));

    // Read the swagger.json file
    const swaggerDocument = JSON.parse(readFileSync(join(__dirname, '..', 'swagger.json'), 'utf8'));

    // Serve swagger.json using swagger-ui-express
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(document));

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // Use cookie-parser middleware
  app.use(cookieParser());

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
