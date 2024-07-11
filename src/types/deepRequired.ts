import { Dict } from "./dict";

export type DeepRequired<T extends Dict> = {
    [P in keyof T]-?: T[P] extends Dict ? DeepRequired<T[P]> : Required<T[P]>;
}