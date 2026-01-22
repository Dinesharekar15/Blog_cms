"use client"
import { api } from "@/lib/api";
import { userService } from "@/services/UserService";
import { createContext,useState,useEffect, ReactNode, useId, useContext } from "react";

interface User{
    id:number,
    name:string,
    email:string,
    bio?:string,
    profileImg?:string,
    followersCount:number,
    followingCount:number,
    blogCount:number
}

interface UserContextType{
    user:User | null
    loading:boolean,
    isAuthenticated:boolean,
    refreshUser:()=>Promise<void>,
    followUser:(userId:number)=>Promise<void>,
    unfollowUser:(userId:number)=>Promise<void>
}

const UserContext=createContext<UserContextType|null>(null)

export const UserProvider=({children}:{children:ReactNode})=>{
    const [user,setUser]=useState<User|null>(null) 
    const [loading,setLoading]=useState(true)

    const refreshUser=async()=>{
        try {
            setLoading(true)
            const user=await userService.getLoggedInUserData()
            setUser(user)
        } catch (error) {
            console.error("Failed to load user:", error);
            setUser(null)
        }finally{
            setLoading(false)
        }
    }
    const followUser =async(userId:number)=>{
        await userService.followUser(userId)
        refreshUser()
    }
    const unfollowUser=async(userId:number)=>{
        await userService.unfollowUser(userId)
        refreshUser()
    }
    useEffect(()=>{   
        refreshUser();
    },[])
    return(
       <UserContext.Provider 
       value={{
        user,
        loading,
        refreshUser,
        isAuthenticated:Boolean(user),
        followUser ,
        unfollowUser
        }}>
        {children}
       </UserContext.Provider>
       
    )
}

export const useUser = () => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used inside UserProvider");
    return ctx;
};