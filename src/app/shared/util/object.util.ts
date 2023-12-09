export class ObjectUtils {
  public static objectWithoutNullOrUndefined<T>(obj: T): T {
    return Object.keys(obj)
      .filter(a => obj[a] !== null && obj[a] !== undefined)
      .reduce((c, a) => {
        c[a] = obj[a];
        return c;
      }, {}) as T;
  }
}
