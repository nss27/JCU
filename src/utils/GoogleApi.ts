type MajorDimension = "ROWS" | "COLUMNS";

export default class GoogleApi {
  static spreadsheetId = "1fPWASjJ-DSsDFv-ctdQecYb3PFk716L7E6BYCZt6r1Q";
  static key = "AIzaSyD9oysquqycaA0YLekjnbLwF26-YKJ807o";

  static async getSingleSheetData(
    range: string,
    majorDimension?: MajorDimension
  ) {
    if (range) {
      majorDimension = majorDimension ? majorDimension : "ROWS";

      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${range}?majorDimension=${majorDimension}&key=${this.key}`
      );

      const json = await res.json();

      if (majorDimension == "ROWS") {
        const dataList = [];

        for (let i = 0; i < json.values.length; i++) {
          if (i > 0) {
            const data = {};

            json.values[i].forEach((val: string, idx: number) => {
              const key = json.values[0][idx].split("/")[1];
              Object.assign(data, { [key]: val });
            });

            dataList.push(data);
          }
        }

        return dataList;
      }

      return json;
    } else {
      return null;
    }
  }

  static async getMultiSheetData(
    ranges: string[],
    majorDimension?: MajorDimension
  ) {
    if (ranges.length > 0) {
      majorDimension = majorDimension ? majorDimension : "ROWS";

      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${
          this.spreadsheetId
        }/values:batchGet?ranges=${ranges.join(
          "&ranges="
        )}&majorDimension=${majorDimension}&key=${this.key}`
      );

      const json = await res.json();

      if (majorDimension == "ROWS") {
        const dataList = [];

        for (let i = 0; i < json.values.length; i++) {
          if (i > 0) {
            const data = {};

            json.values[i].forEach((val: string, idx: number) => {
              const key = json.values[0][idx].split("/")[1];
              Object.assign(data, { [key]: val });
            });

            dataList.push(data);
          }
        }

        return dataList;
      }

      return json;
    } else {
      return null;
    }
  }
}
