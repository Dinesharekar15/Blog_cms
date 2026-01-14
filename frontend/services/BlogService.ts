import axios from "axios"
import {api} from "../lib/api"


class BlogService{
    async getAll(){
        const res=await api.get(`/blog`)
        return res.data
    }

    async getById(blogId:number){
        const res=await api.get(`/blog/${blogId}`)
        return res.data
    }
    async likeblog(blogId:number){
        const res=await api.post(`/blog/${blogId}/like`)
        return res.data
    }
    async unlike(blogId:number){
        const res= await api.delete(`/blog/${blogId}/like`)
        return res.data
    }
    async getComment(blogId:number){
        const res=await api.get(`/blog/${blogId}/comment`)
        return res.data
    }
    async addcomment (blogId:number,content:string,parentId?:number){
        const res=await api.post(`/blog/${blogId}/comment`,{
            content,
            parentId
        })
        return res.data
    }
}

export const blogService=new BlogService()