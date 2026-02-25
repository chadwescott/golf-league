import { EventTypes } from "../enums/event-types.enum";
import { RoundHoles } from "../enums/round-holes.enum";

export interface LeagueEvent {
    id: string;
    seasonId: string;
    date: Date;
    name: string;
    courseId: string;
    roundHoles: RoundHoles;
    eventType: EventTypes;
    skinAmount: number | null;
    scorecardId: string;
}