import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { runSeeders, SeederOptions } from "typeorm-extension";
import MainSeeder from "./main.seeder";
import { User } from "./users/entities/user.entity";
import { UsersFactory } from "./users/users.factory";

// https://www.devist.xyz/posts/how-to-seed-a-database-with-type-orm-and-faker-in-2023

const options: DataSourceOptions & SeederOptions = {
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: "postgres",
  password: "pass123",
  database: "postgres",
  entities: [User],
  // additional config options brought by typeorm-extension
  factories: [UsersFactory],
  seeds: [MainSeeder],
};

const dataSource = new DataSource(options);

dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
});
