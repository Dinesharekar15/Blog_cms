interface BlogContent {
    title: string;
    description: string;
    imageUrl: string | null;
    videoUrl: string | null;
    userId: number;
}
declare const creatPost: import("express").RequestHandler<{}, any, BlogContent, import("qs").ParsedQs, Record<string, any>>;
declare const allposts: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export { allposts, creatPost };
//# sourceMappingURL=post.d.ts.map