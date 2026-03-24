import { HoleScore } from "./hole-score.model";

export interface PlayerScores {
    id: string,
    playerId: string,
    playerIds: string[],
    holeScores: HoleScore[],
    handicap: number | null,
    grossInScore: number | null,
    grossOutScore: number | null,
    netInScore: number | null,
    netOutScore: number | null,
    totalScore: number | null,
    grossPoints: number | null
    netPoints: number | null
}