export class ArraysUtil {
  public static uniqueArray(array: any[]): void {
    return array.reduce((elem1, elem2) => {
      if (elem1.indexOf(elem2) < 0) {
        elem1.push(elem2);
      }

      return elem1;
    }, []);
  }
}
