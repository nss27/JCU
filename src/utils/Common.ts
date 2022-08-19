export default class Common {
  static isNull<T>(data: T): boolean {
    let result: boolean = data === undefined || data === null;

    if (!result) {
      switch (typeof data) {
        case "string":
          result = data === "";
          break;

        case "object":
          result = data === {};
          break;

        default:
          break;
      }
    }

    return result;
  }
}
