import type { Request, Response } from "express";
interface CustomRequest extends Request {
    user?: {
        id: number;
        name?: string;
        email?: string;
    };
    file?: Express.Multer.File | undefined;
}
declare const creatBlog: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
declare const allBlogs: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
declare const getOneBlog: (req: CustomRequest, res: Response) => Promise<void>;
declare const likeBlog: (req: CustomRequest, res: Response) => Promise<void>;
declare const unlikeBlog: (req: CustomRequest, res: Response) => Promise<void>;
declare const addComment: (req: CustomRequest, res: Response) => Promise<void>;
declare const allComment: (req: CustomRequest, res: Response) => Promise<void>;
export { creatBlog, allBlogs, likeBlog, addComment, unlikeBlog, allComment, getOneBlog, };
//# sourceMappingURL=blog.d.ts.map