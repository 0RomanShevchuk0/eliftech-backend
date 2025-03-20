export function splitById<T extends { id?: string }>(items: T[]) {
  return items.reduce<{ newItems: T[]; existingItems: T[] }>(
    (acc, item) => {
      if (item.id) {
        acc.existingItems.push(item);
      } else {
        acc.newItems.push(item);
      }
      return acc;
    },
    { newItems: [], existingItems: [] },
  );
}
