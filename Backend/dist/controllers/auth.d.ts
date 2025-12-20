import e from "express";
interface SignUpBody {
    name: string;
    email: string;
    password: string;
}
declare const signUp: e.RequestHandler<{}, any, SignUpBody, import("qs").ParsedQs, Record<string, any>>;
interface signinbody {
    email: string;
    password: string;
}
declare const signIn: e.RequestHandler<{}, any, signinbody, import("qs").ParsedQs, Record<string, any>>;
export { signUp, signIn };
//# sourceMappingURL=auth.d.ts.map