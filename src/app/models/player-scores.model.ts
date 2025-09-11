import { HoleScore } from "./hole-score.model";
import { Player } from "./player.model";

export interface PlayerScores {
    player: Player,
    holeScores: HoleScore[],
    handicap: number | null,
    inScore: number,
    outScore: number,
    totalScore: number,
    points: number
}