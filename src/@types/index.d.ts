export {};

declare global {
  interface Window {
    kakao: any;
  }

  type MajorDimension = "ROWS" | "COLUMNS";

  type WordType = "match" | "full";

  interface CyPlayerId {
    grade: number;
    nickname: string;
    playerId: string;
  }

  interface CyGameCount {
    gameTypeId: string;
    loseCount: number;
    stopCount: number;
    winCount: number;
  }

  interface CyPlayerIdReq {
    nickname: string;
    wordType?: WordType;
    limit?: number;
  }

  interface CyPlayerIdRes {
    rows: NeopleCyPlayerId[];
  }

  interface CyPlayerInfoReq {
    playerId: string;
  }

  interface CyPlayerInfoRes extends CyPlayerId {
    clanName: string;
    maxRatingPoint: number;
    ratingPoint: number;
    records: CyGameCount[];
    tierName: string;
  }
}
