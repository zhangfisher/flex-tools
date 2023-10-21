

export type Optional<T, K extends keyof T = never> = Partial<T> & Required<Pick<T, K>>;



// export interface SiteOptions{
//     id:string                           // 站点ID   
//     icon:string                         // 站点图标
//     logo:string                         // 站点logo
//     title:string                        //
//     path:string                         // 站点路径        
// }


// type mysite = Optional<SiteOptions,'id' | 'path'>


// let site:mysite = {
//     id:"1",
//     path:"ddd"
// }


// type mysite2 = Optional<SiteOptions>


// let site2:mysite2 = {
//     id:"1"
// }

