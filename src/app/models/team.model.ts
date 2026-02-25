import { ResultType } from "../enums/result.enum";

export interface Team {
    playerIds: string[];
    handicap: number;
    totalScore: number | null;
    result: ResultType | null;
    scorecardId: string;
}