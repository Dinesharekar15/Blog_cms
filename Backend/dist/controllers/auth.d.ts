interface SignUpBody {
    name: string;
    email: string;
    password: string;
}
declare const signUp: import("express").RequestHandler<{}, any, SignUpBody, import("qs").ParsedQs, Record<string, any>>;
interface signinbody {
    email: string;
    password: string;
}
declare const signIn: import("express").RequestHandler<{}, any, signinbody, import("qs").ParsedQs, Record<string, any>>;
export { signUp, signIn };
//# sourceMappingURL=auth.d.ts.map