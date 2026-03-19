import { ScoreType } from "../enums/score-type.enum";

export interface HoleScore {
    holeNumber: number,
    strokes: number,
    fairwayHit: boolean | null,
    score: number | null,
    scoreType: ScoreType | null,
    grossSkin: boolean | null,
    netSkin: boolean | null
}