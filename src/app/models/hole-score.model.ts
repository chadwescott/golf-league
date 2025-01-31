import { Hole } from "./hole.model";

export interface HoleScore {
    hole: Hole,
    score: number | null
    fairwayHit: boolean | null
}