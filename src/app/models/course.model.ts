import { Hole } from "./hole.model";

export interface Course {
    name: string,
    holes: Hole[],
}