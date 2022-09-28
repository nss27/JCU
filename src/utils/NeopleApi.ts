const key = "Ovr9f6SIy2k51tRJft9rThyaMArHqCsO";
const proxyServer = "https://jcu.duckdns.org:3000";
const characters = [
  {
    characterId: "c603a74ba02374026a535dc53e5b8d40",
    characterName: "로라스",
  },
  {
    characterId: "d69971a6762d94340bb2332e8735238a",
    characterName: "휴톤",
  },
  {
    characterId: "4ff1922f862cae2cc98a6d498e76ef2b",
    characterName: "루이스",
  },
  {
    characterId: "cc357fcea986318e6f6b4fe4501f4a1f",
    characterName: "타라",
  },
  {
    characterId: "102c0a466e4d5e0e53cdce7f93879d51",
    characterName: "트리비아",
  },
  {
    characterId: "fa1340686cb8400dc5a7b0eb291a5a54",
    characterName: "카인",
  },
  {
    characterId: "bdeafa2ce23cc0d6d301200b1ce5bca9",
    characterName: "레나",
  },
  {
    characterId: "1bf54947c9c13cd6448940d6ae95ce83",
    characterName: "드렉슬러",
  },
  {
    characterId: "384ef5d4bbb43c349d2935fd47c03bb8",
    characterName: "도일",
  },
  {
    characterId: "798afd40efb445158c963b6de2588a6e",
    characterName: "토마스",
  },
  {
    characterId: "f414d81d3be548d47d856bfcabd50bce",
    characterName: "나이오비",
  },
  {
    characterId: "ea370f7b3d39ab4982cf53bb50e911ec",
    characterName: "시바",
  },
  {
    characterId: "64e6ec54c35e780c45eb2606ddee8914",
    characterName: "웨슬리",
  },
  {
    characterId: "1d5ac6423cc85695a37185c38bb1b528",
    characterName: "스텔라",
  },
  {
    characterId: "aa7e0636db959e92f01200c5130f19af",
    characterName: "앨리셔",
  },
  {
    characterId: "5f4c4d6d332766ca219af12dfc41f124",
    characterName: "클레어",
  },
  {
    characterId: "cf6008394ebfb5d0de83fa05834018db",
    characterName: "다이무스",
  },
  {
    characterId: "295c13b63e8af6c2d6bac30eb71455cf",
    characterName: "이글",
  },
  {
    characterId: "89e49e3af689b0e02b700e605153c76e",
    characterName: "마를렌",
  },
  {
    characterId: "3bc12f4fed260b22fa588f22b7f5abff",
    characterName: "샬럿",
  },
  {
    characterId: "5908c855eab91d27eb6d996517db1b5b",
    characterName: "윌라드",
  },
  {
    characterId: "df9599b5be8c37266f7ded9cd2becf60",
    characterName: "레이튼",
  },
  {
    characterId: "47a1b002f3c601f37cdca060b94a0141",
    characterName: "미쉘",
  },
  {
    characterId: "163cf60ff617534e051ce4bbc27b91e9",
    characterName: "린",
  },
  {
    characterId: "13f399bcf8e8aaf0d953ef0e4dc7ef6f",
    characterName: "빅터",
  },
  {
    characterId: "f0548e3e7385dd2bc6af26f43ccbc246",
    characterName: "카를로스",
  },
  {
    characterId: "345130ea32fe807df9588e9bb3cf4759",
    characterName: "호타루",
  },
  {
    characterId: "1338a777b6aa275d2856b89390249f42",
    characterName: "트릭시",
  },
  {
    characterId: "a4636e5b1ac646c6f320b53004a34e29",
    characterName: "히카르도",
  },
  {
    characterId: "796e4f12a5190f0e9ca475db61bb41d0",
    characterName: "까미유",
  },
  {
    characterId: "426d56385cd95f08b550b8de937c1cb3",
    characterName: "자네트",
  },
  {
    characterId: "8ee3cb8f81baaf745a91dc871b99ff3f",
    characterName: "피터",
  },
  {
    characterId: "caa0168d0c68ec4dfe64d025df2673f0",
    characterName: "아이작",
  },
  {
    characterId: "7631b259662ceec42aa035e7c331ab32",
    characterName: "레베카",
  },
  {
    characterId: "6d576eca97a6d8255164ff0c2a017d7e",
    characterName: "엘리",
  },
  {
    characterId: "5d571cc74e42072a7d3eb49f4f4efb62",
    characterName: "마틴",
  },
  {
    characterId: "6d7db858c4f20adcf4fc2eee21c2c03f",
    characterName: "브루스",
  },
  {
    characterId: "7d1e6070ba8b5671a5c2373dfa4ffa1c",
    characterName: "미아",
  },
  {
    characterId: "ec9ab10b0217b0fb008780e90f76261d",
    characterName: "드니스",
  },
  {
    characterId: "0c972ec7ba90f52229419f6b44a71c89",
    characterName: "제레온",
  },
  {
    characterId: "d672c92b26a858a9ae15bb6e3c510782",
    characterName: "루시",
  },
  {
    characterId: "6b80b807012796e103193c6d88e5def3",
    characterName: "티엔",
  },
  {
    characterId: "7dde8c1283f6f920c8337a8d124ce959",
    characterName: "하랑",
  },
  {
    characterId: "7685d0e5c2b3a123fd627184c94c5e4d",
    characterName: "제이",
  },
  {
    characterId: "affdeb9a1b0f7185a36db81270ce8c70",
    characterName: "벨져",
  },
  {
    characterId: "d6b4e72d01c4b5551b179e8e623b3365",
    characterName: "리첼",
  },
  {
    characterId: "a121f236ecffb4508dd208608c3fe2a5",
    characterName: "리사",
  },
  {
    characterId: "052b8ab48199f154cbafc20a8ea7ebcf",
    characterName: "릭",
  },
  {
    characterId: "149913567cfcc642a07e46ad41049da6",
    characterName: "제키엘",
  },
  {
    characterId: "5ee187dd8ba81f5bb7141688d8aa1c28",
    characterName: "탄야",
  },
  {
    characterId: "a76ddf68c94d79db9a9d069f95e0267c",
    characterName: "캐럴",
  },
  {
    characterId: "e7846625164d88da4f7fef1bc63a8319",
    characterName: "라이샌더",
  },
  {
    characterId: "cc11bb2d8bde801b5661c406297822d9",
    characterName: "루드빅",
  },
  {
    characterId: "996b051544d11550d4ea409c0e23e624",
    characterName: "멜빈",
  },
  {
    characterId: "413a78539a67736b9c5ee488e3be68e7",
    characterName: "디아나",
  },
  {
    characterId: "0cd5fc051d760e9c1a2f19444ea53917",
    characterName: "클리브",
  },
  {
    characterId: "7145eabf772299aaca3b583f3f305fc1",
    characterName: "헬레나",
  },
  {
    characterId: "bad9955f85d80c68a40673504e67a678",
    characterName: "에바",
  },
  {
    characterId: "c5d2843bedc74035bf487d8c7ece8d23",
    characterName: "론",
  },
  {
    characterId: "3f4cf1ea927feab0f12bfaf991792f97",
    characterName: "레오노르",
  },
  {
    characterId: "1fa48342cf3d54343c1d78fbc212210c",
    characterName: "시드니",
  },
  {
    characterId: "1e2129fcb1eebba2101ee5de6c4b168a",
    characterName: "테이",
  },
  {
    characterId: "9a00609cb8b9bb8ee9d36a72e822b839",
    characterName: "티모시",
  },
  {
    characterId: "d738a9bb4167ff0c4bd36f1bae69f813",
    characterName: "엘프리데",
  },
  {
    characterId: "4408e80fb00f3e4a1e1f27247ca433c9",
    characterName: "티샤",
  },
  {
    characterId: "d430ceb55aa87047d92d4cda57e054ca",
    characterName: "카로슈",
  },
  {
    characterId: "29863fca436fc32196f3b07b1b80d6eb",
    characterName: "라이언",
  },
  {
    characterId: "54110c213b92c716f8908c04c06d28bd",
    characterName: "파수꾼 A",
  },
  {
    characterId: "8ca68ab00e6f2c33220214d720c024ee",
    characterName: "에밀리",
  },
  {
    characterId: "42ba0da0781020231280624071c3574d",
    characterName: "플로리안",
  },
  {
    characterId: "627db8b10d95ba73f0d2765130430454",
    characterName: "케니스",
  },
  {
    characterId: "6a0ad7d947ed7a89d90d48faac92e724",
    characterName: "이사벨",
  },
  {
    characterId: "c59a621aa82958d83535c3dec365db98",
    characterName: "헤나투",
  },
  {
    characterId: "659845488dc117f43d41a64837ae9990",
    characterName: "숙희",
  },
  {
    characterId: "b605a378d8cfe96f133034db0810014c",
    characterName: "그레타",
  },
];
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
   * @returns
   */
  static getCharacterImage(character: string) {
    const characterId = characters.filter(
      (data) => data.characterId === character
    )[0].characterId;
    return `/assets/images/cyphers/character/${characterId}.jpg`;
  }

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
   * 매칭 상세 정보 조회
   * @param data
   * @returns
   */
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

  /**
   * 아이템 상세 정보 조회
   * @param data
   * @returns
   */
  static async cyItemsInfo(data: CyItemsInfoReq) {
    const paramsObj = {
      apikey: key,
      ...data,
    };

    const params = Object.entries(paramsObj).map(([key, val]) => {
      if (key !== "itemId") return `${key}=${val}`;
    });

    const json = await fetch(
      `${proxyServer}/cyphers/cy/battleitems/${data.itemId}?${params.join("&")}`
    ).then((res) => res.json());

    return json;
  }

  /**
   * 포지션 특성 조회
   * @param data
   * @returns
   */
  static async cyPositionInfo(data: CyPositionInfoReq) {
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
      }?${params.join("&")}`
    ).then((res) => res.json());

    return json;
  }

  /**
   * 통합 랭킹 조회
   * @param data
   * @returns
   */
  static async cyTotalRanking(data: CyTotalRankingReq) {
    const paramsObj = {
      apikey: key,
      ...data,
    };

    const params = Object.entries(paramsObj).map(
      ([key, val]) => `${key}=${val}`
    );

    const json = await fetch(
      `${proxyServer}/cyphers/cy/ranking/ratingpoint?${params.join("&")}`
    ).then((res) => res.json());

    return json;
  }

  /**
   * 캐릭터 랭킹 조회
   * @param data
   * @returns
   */
  static async cyCharacterRanking(data: CyCharacterRankingReq) {
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
      }?${params.join("&")}`
    ).then((res) => res.json());

    return json;
  }
}
