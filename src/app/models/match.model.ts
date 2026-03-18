import { MatchTypes } from "../enums/match-types.enum";
import { RoundHoles } from "../enums/round-holes.enum";

export interface Match {
    id: string;
    seasonId: string;
    date: Date;
    name: string;
    courseId: string;
    roundHoles: RoundHoles;
    matchType: MatchTypes;
    skinAmount: number | null;
    scorecardId: string;
}