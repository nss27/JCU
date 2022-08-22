export default class Common {
  static isNull<T>(data: T): boolean {
    let result: boolean = data === undefined || data === null;

    if (!result) {
      switch (typeof data) {
        case "string":
          result = data === "";
          break;

        case "object":
          if (Array.isArray(data)) {
            result = data.length === 0;
          } else {
            result = data === {};
          }
          break;

        default:
          break;
      }
    }

    return result;
  }
}
