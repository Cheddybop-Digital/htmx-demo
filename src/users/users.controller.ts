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
  UseFilters,
} from "@nestjs/common";
import { Response, Request } from "express";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { eta } from "../resources/templateEngine";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";
import { UserValidator } from "./validators/user.validator";

declare module "express-session" {
  interface SessionData {
    fromDeleteRedirect: boolean;
  }
}

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Req() req: Request,
    @Query() paginationQuery: PaginationQueryDto,
    @Res() res: Response,
  ) {
    let data = await this.usersService.findAll(paginationQuery);
    const fromUserDetailsBackButton =
      req.header("HX-Trigger") === "back-to-home-anchor";
    const regularGetUsersRequest =
      req.header("HX-Request") && !req.session.fromDeleteRedirect;
    const requestFromDeleteRedirect = req.session.fromDeleteRedirect;

    if (fromUserDetailsBackButton) {
      // we want to use hx-boost functionality that will replace body HTML
      res.header("HX-Boost", "true");
      return res.status(200).send(eta.render("homePage/index", data));
    } else if (regularGetUsersRequest) {
      // if htmx is making the request (from pagination, sorting, or column search),
      // and it's not a delete redirect, send a partial
      return res
        .status(200)
        .send(eta.render("homePage/partials/tableAndPagination", data));
    } else if (requestFromDeleteRedirect) {
      // set to false otherwise all page refreshes will include the deleted toast
      req.session.fromDeleteRedirect = false;
      // if coming from a DELETE redirect, add a deleted message for a toast message
      data = { ...data, message: "User successfully deleted" };
    }

    // if this is a page load, serve the whole page
    return res.status(200).send(eta.render("homePage/index", data));
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
  @UseFilters(UserValidator)
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    await this.usersService.create(createUserDto);
    return res.status(201).send(
      eta.render("homePage/partials/toast", {
        message: "User successfully created",
      }),
    );
  }

  @Put(":id")
  @UseFilters(UserValidator)
  async update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    const user = await this.usersService.update(id, updateUserDto);
    return res.status(200).send(eta.render("users/userDetailsPage", { user }));
  }

  @Delete(":id")
  async remove(
    @Req() req: Request,
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() res: Response,
  ) {
    res.set("HX-Redirect", "/users");
    await this.usersService.remove(id);
    req.session.fromDeleteRedirect = true;
    return res.status(204).send("");
  }
}
