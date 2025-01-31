import { HoleScore } from "./hole-score.model";
import { Player } from "./player.model";

export interface Scorecard {
    player: Player,
    holeScores: HoleScore[]
}