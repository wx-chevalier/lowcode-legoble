export function isValidArray(maybeArray: any) {
  return Array.isArray(maybeArray) && maybeArray.length > 0;
}
