export const getOrderBy = <T>(
  sortBy: string,
  fieldMappings: Record<string, T>,
): Partial<T> => {
  const defaultReturn = {} as Partial<T>;
  if (!sortBy || !(sortBy in fieldMappings)) return defaultReturn;

  const sortField = fieldMappings[sortBy];

  return sortField ? sortField : defaultReturn;
};
