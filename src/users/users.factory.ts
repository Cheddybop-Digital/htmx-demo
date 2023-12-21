import { Faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";
import { User } from "./entities/user.entity";

// https://www.devist.xyz/posts/how-to-seed-a-database-with-type-orm-and-faker-in-2023

export const UsersFactory = setSeederFactory(User, (faker: Faker) => {
  const user = new User();
  user.firstName = faker.person.firstName();
  user.lastName = faker.person.lastName();
  user.email = faker.internet.email({
    firstName: user.firstName,
    lastName: user.lastName,
  });
  user.phoneNumber = faker.phone.number();
  user.avatarUrl = faker.internet.avatar();
  return user;
});
