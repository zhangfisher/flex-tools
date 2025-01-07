export type OmitIndexSignature<ObjectType> = {
	[KeyType in keyof ObjectType as {} extends Record<KeyType, unknown>
		? never
		: KeyType]: ObjectType[KeyType];
};

export type PickIndexSignature<ObjectType> = {
	[KeyType in keyof ObjectType as {} extends Record<KeyType, unknown>
		? KeyType
		: never]: ObjectType[KeyType];
};


type WithIndexSignature<T,DefaultType> = T & {    
    [key:string] : DefaultType
}

export type FixedRecord<DefaultType,FixedType extends Record<string,any>> = PickIndexSignature<WithIndexSignature<FixedType,DefaultType>> & OmitIndexSignature<WithIndexSignature<FixedType,DefaultType>>



// type VoerkaI18nMessages = FixedRecord<string | string[], {    
//     $config: Record<string,Record<string,any>>;
//     $remote: boolean;
// }>

// const messages: VoerkaI18nMessages = {
//     $config: {
//         add: {
//             a:""
//         }
//     },
//     $remote: true, 
//     b:  "1",
//     a:  ['1', '2'],
//     c:  1
// }



