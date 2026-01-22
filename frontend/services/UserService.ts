import { api } from "@/lib/api";


class UserService {

    async getLoggedInUserData(){
        const res=await api.get(`user/me`)
        return res.data.formatted
    }
    
    async getUserMetaData (userId:number){
        const res=await api.get(`/user/${userId}/metadata`)
        return res.data
    }
    async getUserFollowers (userId:number){
        const res=await api.get(`/user/${userId}/followers`)
        return res.data
    }
    async getUserFollowing (userId:number){
        const res=await api.get(`/user/${userId}/following`)
        return res.data
    }
    async getUserBlogs (userId:number){ 

        const res=await api.get(`/user/${userId}/blogs`)
        return res.data
    }

    async followUser(userId:number){
        const res=await api.post(`/user/${userId}/follow`)
        return res.data
    }
    async unfollowUser(userId:number){
        const res=await api.delete(`/user/${userId}/follow`)
        return res.data
    }


}
export const userService=new UserService();