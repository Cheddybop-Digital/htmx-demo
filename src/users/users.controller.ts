import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Res,
  Req,
  Put,
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
    const { create = false } = paginationQuery;

    if (req.header("HX-Request") && !create) {
      // if htmx is making the request, send a partial
      const data = await this.usersService.findAll(paginationQuery);
      return res.status(200).send(
        eta.render("homePage/partials/tableAndPagination", {
          ...data,
          flash: res.locals.flash,
        }),
      );
    }

    if (create) {
      res.locals.flash = {
        type: "success",
        message: "User successfully created",
      };
    }

    // if this is a page load, serve the whole page
    const data = await this.usersService.findAll(paginationQuery);
    return res.status(200).send(
      eta.render("homePage/index", {
        ...data,
        flash: res.locals.flash,
      }),
    );
  }

  @Get(":id")
  async findOne(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() res: Response,
  ) {
    const user = await this.usersService.findOne(id);
    return res.status(200).send(eta.render("users/userDetailsPage", { user }));
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    await this.usersService.create(createUserDto);
    return res.redirect("/users?create=true");
  }

  @Put(":id")
  async update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    const user = await this.usersService.update(id, updateUserDto);
    return res.status(200).send(eta.render("users/userDetails", { user }));
  }

  @Delete(":id")
  async remove(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() res: Response,
  ) {
    res.set("HX-Redirect", "/users");
    await this.usersService.remove(id);
    return res.status(204).send("");
  }
}
