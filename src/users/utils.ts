import { BadRequestException } from "@nestjs/common";
import { eta } from "../resources/templateEngine";
import { Response } from "express";
import { UsersService } from "../users/users.service";
import { CreateUserDto } from "./dto/create-user.dto";

export function createRangeMessage({
  offset,
  limit,
  total,
  hasSearchData,
  numberOfRecords,
}: {
  offset: number;
  limit: number;
  total: number;
  hasSearchData: boolean;
  numberOfRecords: number;
}): string {
  return `${offset + 1} - ${
    hasSearchData ? numberOfRecords : offset + limit
  } of ${total} users`;
}

export function handleExceptionAndRenderTemplate(
  res: Response,
  req: any,
  exception: BadRequestException, // comes from exceptionFactory in main.ts
  path: string,
  method: string,
) {
  if (
    (path === "/users" && method === "POST") ||
    (path === "/users/:id" && method === "PUT")
  ) {
    const reqBody = { ...req.body };
    // this block is for errors in the create user form and edit user form
    const _type = path === "/users" && method === "POST" ? "create" : "edit";
    // @ts-expect-error message is an array
    const errors = exception?.response?.message?.reduce(
      (
        accum: Record<string, string | string[]>,
        errObj: Record<string, string>,
      ) => {
        if (errObj.firstName) {
          accum.firstName = errObj.message.replace("firstName", "First Name");
        } else if (errObj.lastName) {
          accum.lastName = errObj.message.replace("lastName", "Last name");
        } else if (errObj.email) {
          accum.email = [
            ...accum.email,
            errObj.message.replace("email", "Email"),
          ];
        } else if (errObj.phoneNumber) {
          accum.phoneNumber = errObj.message.replace(
            "phoneNumber",
            "Phone number",
          );
        } else if (errObj.avatarUrl) {
          accum.avatarUrl = errObj.message.replace("avatarUrl", "Avatar url");
        }
        return accum;
      },
      { email: [] },
    );

    const templateData = {
      user: {
        id: req.params.id,
        firstName: reqBody.firstName,
        lastName: reqBody.lastName,
        email: reqBody.email,
        phoneNumber: reqBody.phoneNumber,
        avatarUrl: reqBody.avatarUrl,
      },
      type: _type,
      errors,
    };

    if (path === "/users/:id") templateData.user.id = path === "/users/:id";

    res.set("HX-Retarget", "#htmx-user-form");
    res.set("HX-Reswap", "innerHTML");

    return res
      .status(207)
      .send(eta.render("modals/createUserForm", templateData));
  }
}
