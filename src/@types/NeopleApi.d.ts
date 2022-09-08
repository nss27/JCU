type WordType = "match" | "full";
type GameTypeId = "rating" | "normal";
type PositionType = "원거리딜러" | "근거리딜러" | "탱커" | "서포터";

interface CyPlayerIdReq {
  nickname: string;
  wordType?: WordType;
  limit?: number;
}

interface CyPlayerInfoReq {
  playerId: string;
}

interface CyPlayerMatchesReq extends CyPlayerInfoReq {
  gameTypeId?: GameTypeId;
  startDate?: string;
  endDate?: string;
  limit?: number;
  next?: string;
}
interface CyPlayerMatchesInfoReq {
  matchId: string;
}
