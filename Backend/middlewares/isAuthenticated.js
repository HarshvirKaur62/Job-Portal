import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1] || req.headers.token;
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            })
        }
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({
                message:"Invalid token",
                success:false
            })
        };
        req.id = decode.userId;
        req.role = decode.role;
        next();
    } catch (error) {
        console.error("AUTH_ERROR:", error.message);
        return res.status(401).json({
            message: "Authentication failed",
            success: false
        });
    }
}

export const isRecruiter = async (req, res, next) => {
    try {
        if (!req.role || req.role !== 'recruiter') {
            return res.status(403).json({
                message: "Access denied. Recruiter permissions required.",
                success: false
            });
        }
        next();
    } catch (error) {
        console.error("RECRUITER_AUTH_ERROR:", error.message);
        return res.status(500).json({
            message: "Role authorization failed",
            success: false
        });
    }
}

export default isAuthenticated;
