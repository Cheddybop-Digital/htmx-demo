import { IsOptional, IsPositive } from "class-validator";

export type SortDirType = "asc" | "desc" | "";

export type FieldsType = "firstName" | "lastName" | "email" | "phoneNumber";

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  // this number is hardcoded in the pagination buttons in the tableAndPagination partial
  limit: number = 20;

  @IsOptional()
  offset: number = 0;

  @IsOptional()
  sortDir: SortDirType;

  @IsOptional()
  sortField: FieldsType;

  @IsOptional()
  searchField: FieldsType;

  @IsOptional()
  searchTerm: string;

  @IsOptional()
  create: boolean;
}
