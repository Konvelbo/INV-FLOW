import jwt, { JwtPayload } from "jsonwebtoken";

export const verifyToken = (req: Request): string | null => {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        if (!decoded || !decoded.id) return null;
        return decoded.id as string;
    } catch (err) {
        return null;
    }
};
