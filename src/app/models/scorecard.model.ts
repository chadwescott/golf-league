import { RoundHoles } from '../enums/round-holes.enum';
import { Hole } from './hole.model';

export interface Scorecard {
    courseId: string,
    date: Date;
    roundHoles: RoundHoles;
    holes: Hole[];
    id: string;
}