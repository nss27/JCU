import Common from "./Common";

const key = "Ovr9f6SIy2k51tRJft9rThyaMArHqCsO";
const proxyServer = "http://35.238.44.9:3000";

export default class NeopleApi {
  static async cyPlayerId(data: CyPlayerIdReq) {
    const paramsObj = {
      apikey: key,
      ...data,
    };

    if (Common.isNull(paramsObj.wordType)) {
      paramsObj.wordType = "match";
    }

    if (Common.isNull(paramsObj.limit)) {
      paramsObj.limit = 10;
    } else if (typeof paramsObj.limit === "number") {
      if (paramsObj.limit <= 0) {
        paramsObj.limit = 1;
      } else if (paramsObj.limit > 200) {
        paramsObj.limit = 200;
      }
    }

    const params = Object.entries(paramsObj).map(
      ([key, val]) => `${key}=${val}`
    );

    const json = await fetch(
      `${proxyServer}/cyphers/cy/players?${params.join("&")}`
    ).then((res) => res.json());

    return json as CyPlayerIdRes;
  }

  static async cyPlayerInfo(data: CyPlayerInfoReq) {
    const paramsObj = {
      apikey: key,
    };

    const params = Object.entries(paramsObj).map(
      ([key, val]) => `${key}=${val}`
    );

    const json = await fetch(
      `${proxyServer}/cyphers/cy/players/${data.playerId}?${params.join("&")}`
    ).then((res) => res.json());

    return json as CyPlayerInfoRes;
  }
}
