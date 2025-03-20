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

export function getItemsToDelete<T extends { id?: string }>(
  items: T[],
  existingItems: T[],
): string[] {
  const newItemsIds = new Set(items.map((o) => o.id));
  const itemIdsToDelete = existingItems
    ?.filter((o) => o.id && !newItemsIds.has(o.id))
    .map((o) => o.id!);

  return itemIdsToDelete;
}
