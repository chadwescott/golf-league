import { Course } from './course.model';
import { Hole } from './hole.model';
import { PlayerScores } from './player-scores.model';

export interface Scorecard {
    course: Course,
    date: Date;
    holes: Hole[];
    id: string,
    scores: PlayerScores[]
}