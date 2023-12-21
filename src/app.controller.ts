import { Controller, Get, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { AppService } from "./app.service";
import { PaginationQueryDto } from "./common/dto/pagination-query.dto";
import { eta } from "./resources/templateEngine";
import { UsersService } from "./users/users.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async homePage(
    @Query() paginationQuery: PaginationQueryDto,
    @Res() res: Response,
  ) {
    const data = await this.usersService.findAll(paginationQuery);
    return res.status(200).send(eta.render("homePage/index", data));
  }
}
