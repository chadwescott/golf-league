import { Hole } from "./hole.model";

export interface Course {
    id: string,
    name: string,
    holes: Hole[],
}