// filename: <root>/packages/async/foreach.ts
type Callback<T> = (item: Awaited<T>, index: number, array: readonly T[]) => Promise<void> | void;
type Options = {
  serial?: boolean;
};

export default async function foreach<T>(array: T[], callback: Callback<T>, options?: Options) {
  const serial = options?.serial ?? false;

  if (serial) {
    for (let index = 0; index < array.length; index++) {
      const element = await array[index];
      await callback(element, index, array);
    }
    return;
  }
  await Promise.all(array.map(async (v, id, arr) => {
    callback(await v, id, arr);
  }));
}
