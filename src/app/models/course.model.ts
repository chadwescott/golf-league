import { Hole } from "./hole.model";

export interface Course {
    id: number,
    name: string,
    holes: Hole[],
}