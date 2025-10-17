import { HoleScore } from "./hole-score.model";

export interface PlayerScores {
    playerId: string,
    holeScores: HoleScore[],
    handicap: number | null,
    inScore: number,
    outScore: number,
    totalScore: number,
    points: number
}