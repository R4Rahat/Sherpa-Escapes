import bcrypt from "bcryptjs";
import apiError from "../utils/apiError.js";

const authMiddleware = (req, res, next) => {
    try{
        const authHeader = req.header.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          throw new ApiError(401, "Unauthorized - No token provided");
        }

        const token = authHeader.split(" ")[1];

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedToken;
        next();


    }catch(error){
        if (error.name === "JsonWebTokenError") {
          return next(new ApiError(401, "Unauthorized - Invalid token"));
        }
        if (error.name === "TokenExpiredError") {
          return next(new ApiError(401, "Unauthorized - Token expired"));
        }
        next(error);
    }
}

export default authMiddleware