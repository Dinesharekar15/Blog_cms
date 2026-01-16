import type { Request, Response } from "express";
interface CustomRequest extends Request {
    user?: any;
}
declare const userProfile: (req: CustomRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const userBolgs: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
declare const getUserMetaData: (req: CustomRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const followUser: (req: CustomRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const unFollowUser: (req: CustomRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const getUserFollowers: (req: CustomRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const getUserFollowings: (req: CustomRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const getUserBlogs: (req: CustomRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export { userProfile, userBolgs, getUserMetaData, followUser, unFollowUser, getUserFollowers, getUserFollowings, getUserBlogs };
//# sourceMappingURL=user.d.ts.map