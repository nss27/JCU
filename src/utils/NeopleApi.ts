const key = "Ovr9f6SIy2k51tRJft9rThyaMArHqCsO";
const proxyServer = "https://jcu.duckdns.org:3000";
const positionImages = {
  원거리딜러: "/assets/images/long-distance-dealer.png",
  근거리딜러: "/assets/images/short-distance-dealer.png",
  탱커: "/assets/images/tanker.png",
  서포터: "/assets/images/supporter.png",
};

export default class NeopleApi {
  static cyCharactersUrl = "https://img-api.neople.co.kr/cy/characters";
  static cyPositionAttributesUrl =
    "https://img-api.neople.co.kr/cy/position-attributes";
  static cyitemsUrl = "https://img-api.neople.co.kr/cy/items";

  /**
   * 플레이어 검색
   * @param data
   * @returns
   */
  static async cyPlayerId(data: CyPlayerIdReq) {
    const paramsObj = {
      apikey: key,
      ...data,
    };

    const params = Object.entries(paramsObj).map(
      ([key, val]) => `${key}=${val}`
    );

    const json = await fetch(
      `${proxyServer}/cyphers/cy/players?${params.join("&")}`
    ).then((res) => res.json());

    return json;
  }

  /**
   * 플레이어 '정보' 조회
   * @param data
   * @returns
   */
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

    return json;
  }

  /**
   * 플레이어 '매칭 기록' 조회
   * @param data
   * @returns
   */
  static async cyPlayerMatches(data: CyPlayerMatchesReq) {
    const paramsObj = {
      apikey: key,
      ...data,
    };

    const params = Object.entries(paramsObj).map(([key, val]) => {
      if (key !== "playerId") return `${key}=${val}`;
    });

    const json = await fetch(
      `${proxyServer}/cyphers/cy/players/${data.playerId}/matches?${params.join(
        "&"
      )}`
    ).then((res) => res.json());

    return json;
  }

  /**
   * 포지션별 이미지 조회
   * @param position
   * @returns
   */
  static getPositionImage(position: PositionType) {
    return positionImages[position];
  }

  static async cyPlayerMatchesInfo(data: CyPlayerMatchesInfoReq) {
    const paramsObj = {
      apikey: key,
      ...data,
    };

    const params = Object.entries(paramsObj).map(([key, val]) => {
      if (key !== "matchId") return `${key}=${val}`;
    });

    const json = await fetch(
      `${proxyServer}/cyphers/cy/matches/${data.matchId}?${params.join("&")}`
    ).then((res) => res.json());

    return json;
  }
}
