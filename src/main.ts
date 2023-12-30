import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import flash from "express-flash";
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
      secret: "secret",
    }),
  );
  app.use(flash());

  // Custom flash middleware
  app.use(function (req, res, next) {
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
  });

  await app.listen(3005);
}

bootstrap();
