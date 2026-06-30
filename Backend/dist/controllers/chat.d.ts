import type { Request, Response } from "express";
interface CustomRequest extends Request {
    user?: any;
}
export declare const getConversations: (req: CustomRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getOrCreateConversation: (req: CustomRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getMessages: (req: CustomRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const markAsRead: (req: CustomRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=chat.d.ts.map