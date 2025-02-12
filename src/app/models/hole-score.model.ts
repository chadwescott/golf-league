import { Hole } from "./hole.model";
import { ScoreType } from "./score-type.enum";

export interface HoleScore {
    hole: Hole,
    fairwayHit: boolean | null,
    score: number | null,
    scoreType: ScoreType | null
}