import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";

const authMiddleware = (req, res, next) => {
  try {
    // With cookie-parser enabled in Express, read directly from req.cookies
    const token = req.cookies?.token;

    if (!token) {
      throw new ApiError(401, "Unauthorized - No token provided");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedToken;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Unauthorized - Invalid token"));
    }
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Unauthorized - Token expired"));
    }
    next(error);
  }
};

export default authMiddleware;
