import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { CommandFactory } from 'nest-commander';

async function bootstrap() {
  // We either provide the server or Nest CLI based on the presence of "--cli" in the initial command.
  const isCLI = process.argv.slice(2).includes('--cli');
  if (isCLI) {
    // Initializing nest commander: for seeding and any other custom CLI functions
    process.argv = process.argv.filter((arg) => arg !== '--cli');
    await CommandFactory.run(AppModule);
  } else {
    // Initializing the REST API
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    // Set the global prefix for all routes
    app.setGlobalPrefix('api/v1');

    // Initializing swagger
    const config = new DocumentBuilder()
      .setTitle('SharedHome')
      .setDescription('The SharedHome API description')
      .addBearerAuth(
        {
          description: `Please enter token. You can get the token from the login API.`,
          name: 'Authorization',
          bearerFormat: 'Bearer', // I`ve tested not to use this field, but the result was the same
          scheme: 'Bearer',
          type: 'http', // I`ve attempted type: 'apiKey' too
          in: 'Header',
        },
        'access-token', // This name here is important for matching up with @ApiBearerAuth() in your controller!
      )
      .setVersion('0.1')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);


  // Initializing nest commander
  // await CommandFactory.run(AppModule);


    await app.listen(process.env.PORT ?? 3000);
  }
}
bootstrap();
