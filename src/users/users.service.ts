import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOperator, ILike, Repository } from "typeorm";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { createRangeMessage } from "./utils";

type FindOptionsType = {
  skip?: number;
  take?: number;
  order?: Record<string, string>;
  where?: Record<string, FindOperator<any>>;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto): Promise<{
    total: number;
    count: number;
    offset: number;
    records: User[];
    sortField: string;
    sortDir: string;
    searchField: string;
    searchTerm: string;
    rangeMessage: string;
    message?: string;
  }> {
    const {
      limit,
      offset,
      sortDir = "",
      sortField = "",
      searchField = "",
      searchTerm = "",
    } = paginationQuery;

    const total = await this.usersRepository.count(
      searchTerm
        ? {
            where: {
              [searchField]: ILike(`${searchTerm}%`),
            },
          }
        : {},
    );

    // pagination
    const findOptions: FindOptionsType = {
      where: null,
      order: null,
    };

    if (offset || limit) {
      findOptions.skip = offset;
      findOptions.take = limit;
    }

    // sorting
    if (!!sortDir && !!sortField) {
      findOptions.order = {
        [sortField]: sortDir,
      };
    }

    // search
    const hasSearchData = !!searchField && !!searchTerm;
    if (hasSearchData) {
      findOptions.where = {
        [searchField]: ILike(`${searchTerm}%`),
      };
    }

    const records = await this.usersRepository.find(findOptions);
    const numberOfRecords = records.length;

    const rangeMessage = createRangeMessage({
      offset,
      limit,
      total,
      hasSearchData,
      numberOfRecords,
    });

    return {
      total,
      count: limit,
      offset,
      records,
      searchField,
      searchTerm,
      sortField,
      sortDir,
      rangeMessage,
    };
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });
    if (!user) {
      throw new NotFoundException(`User {id: ${id}} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.preload({
      id: id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return this.usersRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return this.usersRepository.remove(user);
  }
}
