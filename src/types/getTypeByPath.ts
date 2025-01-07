import { Get } from "type-fest"
import { Dict } from "./dict"


export type GetTypeByPath<State extends Dict,Path extends string> = Path extends '' | undefined ? State : Get<State,Path>
