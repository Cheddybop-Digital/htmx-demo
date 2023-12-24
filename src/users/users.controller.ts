import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Res,
  Req,
} from "@nestjs/common";
import { Response, Request } from "express";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { eta } from "../resources/templateEngine";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Req() req: Request,
    @Query() paginationQuery: PaginationQueryDto,
    @Res() res: Response,
  ) {
    if (req.header("HX-Request")) {
      // if htmx is making the request, send a partial
      const data = await this.usersService.findAll(paginationQuery);
      return res
        .status(200)
        .send(eta.render("homePage/partials/tableAndPagination", data));
    }

    // if this is a page load, serve the whole page
    const data = await this.usersService.findAll(paginationQuery);
    return res.status(200).send(eta.render("homePage/index", data));
  }

  @Get(":id")
  async findOne(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() res: Response,
  ) {
    const user = await this.usersService.findOne(id);
    return res.status(200).send(eta.render("users/userDetails", { user }));
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const user = await this.usersService.create(createUserDto);
    return res
      .status(200)
      .send(eta.render("homePage/partials/userRow", { user }));
  }

  @Patch(":id")
  update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.usersService.remove(id);
  }
}
