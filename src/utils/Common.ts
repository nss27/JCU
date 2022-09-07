export default class Common {
  /**
   * 데이터 null 체크
   * @param data
   * @returns
   */
  static isNull(data: any) {
    let result: boolean = data === undefined || data === null;

    if (!result && typeof data === "string") {
      result = data === "";
    } else if (!result && typeof data === "object") {
      if (Array.isArray(data)) {
        result = data.length === 0;
      } else if (this.isNode(data) || this.isElement(data)) {
        result = false;
      } else {
        result = Object.keys(data).length === 0;
      }
    }

    return result;
  }

  /**
   * 데이터 전처리
   * @param data
   * @returns
   */
  static preprocessing(data: any) {
    if (typeof data === "object" && !Array.isArray(data)) {
      Object.entries(data).forEach(([key, val]) => {
        if (this.isNull(val)) delete data[key];
      });
    }

    return data;
  }

  /**
   * DOM 노드인 경우 true를 반환합니다
   * @param o
   * @returns
   */
  static isNode(o: any) {
    return typeof Node === "object"
      ? o instanceof Node
      : o &&
          typeof o === "object" &&
          typeof o.nodeType === "number" &&
          typeof o.nodeName === "string";
  }

  /**
   * DOM 요소인 경우 true를 반환합니다
   * @param o
   * @returns
   */
  static isElement(o: any) {
    return typeof HTMLElement === "object"
      ? o instanceof HTMLElement //DOM2
      : o &&
          typeof o === "object" &&
          o !== null &&
          o.nodeType === 1 &&
          typeof o.nodeName === "string";
  }
}
