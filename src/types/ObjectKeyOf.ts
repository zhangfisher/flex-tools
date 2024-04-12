/**
  
interface Animal {
    [key: string]: string;
}

type name = keyof Animal

此时name的类型是string | number,而不是string


type evs = ObjectKeyOf<Animal>




 */

export type ObjectKeyOf<T,I=string> = { [P in keyof T]: P extends I ? P : never }[keyof T];  

  