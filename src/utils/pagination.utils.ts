export const getSkipValue = (page: number, limit: number) => (page - 1) * limit;

export const getPaginationStatus = (page: number, limit: number, totalCount) => {
  const skip = getSkipValue(page, limit);
  const hasNextPage = skip + limit < totalCount;
  const hasPrevPage = page > 1;

  return { hasNextPage, hasPrevPage };
};
