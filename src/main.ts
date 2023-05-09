import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { convertBoolStrToBoolean } from './common/helpers';
import { validationPipe } from './common/pipes';
import { AppConfigService } from './config/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const configService = app.get<AppConfigService>(AppConfigService);

  const HOST = configService.get<string>('NEST_HOST');
  const PORT = configService.get<string>('NEST_PORT');
  const GLOBAL_PREFIX = configService.get<string>('GLOBAL_PREFIX');

  app.setGlobalPrefix(GLOBAL_PREFIX);

  const ENABLE_SWAGGER = configService.get<string>('ENABLE_SWAGGER');
  if (convertBoolStrToBoolean(ENABLE_SWAGGER)) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(configService.get('npm_package_name'))
      .setVersion(configService.get('npm_package_version'))
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    const SWAGGER_DOCS_PATH = configService.get<string>('SWAGGER_DOCS_PATH');
    SwaggerModule.setup(SWAGGER_DOCS_PATH, app, document);
  }

  app.useGlobalPipes(validationPipe).enableCors();

  await app.listen(PORT, HOST, () => {
    console.log(`Server listens on http://${HOST}:${PORT}`);
  });
}

bootstrap();
