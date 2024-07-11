import { Dict } from "./Dict";

export type DeepPartial<T extends Dict> = {
    [P in keyof T]?: T[P] extends Dict ? DeepPartial<T[P]> : T[P];
}