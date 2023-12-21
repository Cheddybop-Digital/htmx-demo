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
