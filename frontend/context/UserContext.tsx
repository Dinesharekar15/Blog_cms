import { createContext,useState,useEffect, ReactNode } from "react";



const UserContext=createContext<null>(null)

export const UserProvider=async({childern}:{childern:ReactNode})=>{
    const loaduser="dinesh"
    return(
        <div>dinehs</div>
        // <UserContext.Provider value={ {loaduser}}>
        //     {childern}
        // </UserContext.Provider>
    )
}