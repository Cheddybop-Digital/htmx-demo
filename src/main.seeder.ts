import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { User } from "./users/entities/user.entity";

// https://www.devist.xyz/posts/how-to-seed-a-database-with-type-orm-and-faker-in-2023

export default class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userFactory = factoryManager.get(User);

    await userFactory.saveMany(500);
  }
}
