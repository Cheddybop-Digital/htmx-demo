import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import session from "express-session";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // transforms POST body to a DTO class
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useStaticAssets(join(__dirname, "..", "public"));

  const sessionStore = new session.MemoryStore();
  app.use(
    session({
      cookie: { maxAge: 60000 },
      store: sessionStore,
      saveUninitialized: true,
      resave: true,
      secret: process.env.SECRET,
    }),
  );

  await app.listen(3005);
}

bootstrap();
