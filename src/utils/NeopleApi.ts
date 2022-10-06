import characters from "@/jsons/characters.json";
import errorInfos from "@/jsons/errorInfos.json";

const key = "Ovr9f6SIy2k51tRJft9rThyaMArHqCsO";
const proxyServer = "https://jcu.duckdns.org:3000";
const positions = [
  {
    positionEng: "long-distance-dealer",
    positionKor: "원거리딜러",
  },
  {
    positionEng: "short-distance-dealer",
    positionKor: "근거리딜러",
  },
  {
    positionEng: "tanker",
    positionKor: "탱커",
  },
  {
    positionEng: "supporter",
    positionKor: "서포터",
  },
];
const errorHandler = async (res: Response) => {
  if (!res.ok) {
    const json = await res.json();
    const errorInfo = errorInfos.filter(
      (data) => data.code === json.error.code
    )[0];

    throw Error(errorInfo.statusText);
  }
  return res;
};

export default class NeopleApi {
  static cyCharactersUrl = "https://img-api.neople.co.kr/cy/characters";
  static cyPositionAttributesUrl =
    "https://img-api.neople.co.kr/cy/position-attributes";
  static cyitemsUrl = "https://img-api.neople.co.kr/cy/items";

  /**
   * 포지션별 이미지 조회
   * @param position 
   * @returns 
   */
  static getPositionImage(position: PositionType) {
    const positionEng = positions.filter(
      (data) => data.positionKor === position
    )[0].positionEng;
    return `/assets/images/cyphers/position/${positionEng}.png`;
  }

  /**
   * 캐릭터별 이미지 조회
   * @param character 
   * @param nameType 
   * @returns 
   */
  static getCharacterImage(character: string, nameType?: boolean) {
    const characterId = characters.filter((data) => {
      if (nameType) {
        return data.characterName === character;
      } else {
        return data.characterId === character;
      }
    })[0].characterId;
    return `/assets/images/cyphers/character/${characterId}.jpg`;
  }

  /**
   * 플레이어 검색
   * @param data 
   * @param opt 
   * @returns 
   */
  static async cyPlayerId(data: CyPlayerIdReq, opt?: RequestInit) {
    const paramsObj = {
      apikey: key,
      ...data,
    };

    const params = Object.entries(paramsObj).map(
      ([key, val]) => `${key}=${val}`
    );

    const json = await fetch(
      `${proxyServer}/cyphers/cy/players?${params.join("&")}`,
      opt
    )
      .then(errorHandler)
      .then((res) => res.json());

    return json;
  }

  /**
   * 플레이어 '정보' 조회
   * @param data 
   * @param opt 
   * @returns 
   */
  static async cyPlayerInfo(data: CyPlayerInfoReq, opt?: RequestInit) {
    const paramsObj = {
      apikey: key,
    };

    const params = Object.entries(paramsObj).map(
      ([key, val]) => `${key}=${val}`
    );

    const json = await fetch(
      `${proxyServer}/cyphers/cy/players/${data.playerId}?${params.join("&")}`,
      opt
    )
      .then(errorHandler)
      .then((res) => res.json());

    return json;
  }

  /**
   * 플레이어 '매칭 기록' 조회
   * @param data 
   * @param opt 
   * @returns 
   */
  static async cyPlayerMatches(data: CyPlayerMatchesReq, opt?: RequestInit) {
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
      )}`,
      opt
    )
      .then(errorHandler)
      .then((res) => res.json());

    return json;
  }

  /**
   * 매칭 상세 정보 조회
   * @param data 
   * @param opt 
   * @returns 
   */
  static async cyPlayerMatchesInfo(
    data: CyPlayerMatchesInfoReq,
    opt?: RequestInit
  ) {
    const paramsObj = {
      apikey: key,
      ...data,
    };

    const params = Object.entries(paramsObj).map(([key, val]) => {
      if (key !== "matchId") return `${key}=${val}`;
    });

    const json = await fetch(
      `${proxyServer}/cyphers/cy/matches/${data.matchId}?${params.join("&")}`,
      opt
    )
      .then(errorHandler)
      .then((res) => res.json());

    return json;
  }

  /**
   * 아이템 상세 정보 조회
   * @param data 
   * @param opt 
   * @returns 
   */
  static async cyItemsInfo(data: CyItemsInfoReq, opt?: RequestInit) {
    const paramsObj = {
      apikey: key,
      ...data,
    };

    const params = Object.entries(paramsObj).map(([key, val]) => {
      if (key !== "itemId") return `${key}=${val}`;
    });

    const json = await fetch(
      `${proxyServer}/cyphers/cy/battleitems/${data.itemId}?${params.join(
        "&"
      )}`,
      opt
    )
      .then(errorHandler)
      .then((res) => res.json());

    return json;
  }

  /**
   * 포지션 특성 조회
   * @param data 
   * @param opt 
   * @returns 
   */
  static async cyPositionInfo(data: CyPositionInfoReq, opt?: RequestInit) {
    const paramsObj = {
      apikey: key,
      ...data,
    };

    const params = Object.entries(paramsObj).map(([key, val]) => {
      if (key !== "itemId") return `${key}=${val}`;
    });

    const json = await fetch(
      `${proxyServer}/cyphers/cy/position-attributes/${
        data.attributeId
      }?${params.join("&")}`,
      opt
    )
      .then(errorHandler)
      .then((res) => res.json());

    return json;
  }

  /**
   * 통합 랭킹 조회
   * @param data 
   * @param opt 
   * @returns 
   */
  static async cyTotalRanking(data: CyTotalRankingReq, opt?: RequestInit) {
    const paramsObj = {
      apikey: key,
      ...data,
    };

    const params = Object.entries(paramsObj).map(
      ([key, val]) => `${key}=${val}`
    );

    const json = await fetch(
      `${proxyServer}/cyphers/cy/ranking/ratingpoint?${params.join("&")}`,
      opt
    )
      .then(errorHandler)
      .then((res) => res.json());

    return json;
  }

  /**
   * 캐릭터 랭킹 조회
   * @param data 
   * @param opt 
   * @returns 
   */
  static async cyCharacterRanking(
    data: CyCharacterRankingReq,
    opt?: RequestInit
  ) {
    const paramsObj = {
      apikey: key,
      ...data,
    };

    const params = Object.entries(paramsObj).map(([key, val]) => {
      if (key !== "characterId" && key !== "rankingType")
        return `${key}=${val}`;
    });

    const json = await fetch(
      `${proxyServer}/cyphers/cy/ranking/characters/${data.characterId}/${
        data.rankingType
      }?${params.join("&")}`,
      opt
    )
      .then(errorHandler)
      .then((res) => res.json());

    return json;
  }

  /**
   * 투신전 랭킹 조회
   * @param data 
   * @param opt 
   * @returns 
   */
  static async cyTsjRanking(data: CyTsjRankingReq, opt?: RequestInit) {
    const paramsObj = {
      apikey: key,
      ...data,
    };

    const params = Object.entries(paramsObj).map(([key, val]) => {
      if (key !== "tsjType") return `${key}=${val}`;
    });

    const json = await fetch(
      `${proxyServer}/cyphers/cy/ranking/tsj/${data.tsjType}?${params.join(
        "&"
      )}`,
      opt
    )
      .then(errorHandler)
      .then((res) => res.json());

    return json;
  }
}
