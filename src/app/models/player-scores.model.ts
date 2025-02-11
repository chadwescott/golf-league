import { HoleScore } from "./hole-score.model";
import { Player } from "./player.model";

export interface PlayerScores {
    player: Player,
    holeScores: HoleScore[],
    totalScore: number
}