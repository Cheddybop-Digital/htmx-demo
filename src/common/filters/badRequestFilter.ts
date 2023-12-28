import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from "@nestjs/common";

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(_exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response.redirect("/users");
  }
}
