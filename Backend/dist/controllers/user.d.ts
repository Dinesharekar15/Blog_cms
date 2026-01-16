import type { Request, Response } from "express";
interface CustomRequest extends Request {
    user?: any;
}
declare const userProfile: (req: CustomRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const userPost: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
declare const getUserMetaData: (req: CustomRequest, res: Response) => Promise<void>;
export { userProfile, userPost, getUserMetaData };
//# sourceMappingURL=user.d.ts.map