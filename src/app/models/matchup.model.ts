import { Player } from "./player.model";

export interface Matchup {
    team1: Player[],
    team2: Player[]
    scorecardId: string;
}