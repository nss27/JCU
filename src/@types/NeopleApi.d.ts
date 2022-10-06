type WordType = "match" | "full";
type GameTypeId = "rating" | "normal";
type PositionType = "원거리딜러" | "근거리딜러" | "탱커" | "서포터";
type RankingType = "winCount" | "winRate" | "killCount" | "assistCount" | "exp";
type TsjType = "melee" | "ranged";

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

interface CyItemsInfoReq {
  itemId: string;
}

interface CyPositionInfoReq {
  attributeId: string;
}

interface CyTotalRankingReq {
  playerId?: string;
  offset?: number;
  limit?: number;
}

interface CyCharacterRankingReq {
  characterId: string;
  rankingType: RankingType;
  playerId?: string;
  offset?: number;
  limit?: number;
}

interface CyTsjRankingReq {
  tsjType: TsjType;
  playerId?: string;
  offset?: number;
  limit?: number;
}
