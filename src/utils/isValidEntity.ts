export function isValidEntity<T>(obj: any, keys: (keyof T)[]): obj is T {
  if (!obj) {
    return false;
  }
  return keys.every((key) => key in obj);
}
