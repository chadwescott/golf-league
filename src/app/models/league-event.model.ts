import { RoundHoles } from "./round-holes.enum";

export interface LeagueEvent {
    id: string;
    leagueSeasonId: string;
    date: Date;
    name: string;
    courseId: string;
    roundHoles: RoundHoles;

}