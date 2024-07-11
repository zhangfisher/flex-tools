import { Dict } from "./Dict";

export type DeepRequired<T extends Dict> = {
    [P in keyof T]-?: T[P] extends Dict ? DeepRequired<T[P]> : T[P];
}