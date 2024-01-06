import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from "@nestjs/common";
import { handleExceptionAndRenderTemplate } from "../utils";

@Catch()
export class UserCreationValidator<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    if (exception instanceof BadRequestException) {
      const res = host.switchToHttp().getResponse();
      const req = host.switchToHttp().getRequest();
      const { path } = req.route;
      const { method } = req;
      handleExceptionAndRenderTemplate(res, req, exception, path, method);
    }
  }
}
