export type WithPagination<T> = {
  page: number;
  limit: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  items: T[];
};
