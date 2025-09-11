import { Hole } from './hole.model';
import { PlayerScores } from './player-scores.model';
import { RoundHoles } from './round-holes.enum';

export interface Scorecard {
    courseId: number,
    date: Date;
    roundHoles: RoundHoles;
    holes: Hole[];
    id: string,
    scores: PlayerScores[]
}