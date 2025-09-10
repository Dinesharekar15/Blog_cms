import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
const authmiddelware = asyncHandler(async (req, res, next) => {
    const token = req.cookies.auth_token;
    if (!token) {
        res.status(401).json({ message: 'No token, authorization denied' });
        return;
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        // console.log(req.user)
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
        return;
    }
});
export { authmiddelware };
//# sourceMappingURL=authmiddelware.js.map