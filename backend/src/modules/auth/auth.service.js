import jwt from "jsonwebtoken"
import Admin from "../../../models/admin.model.js"
import ApiError from "../../../utils/apiError.js";


const generateToken = (admin) => {
    return jwt.sign(
      {
        id: admin._id,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );
}


export const login = async (email, password) => {
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if(!admin) throw new ApiError(404, "Invalid email or password");

    const isMatch = admin.comparePassword(password);
    if(!isMatch) throw new ApiError(404, "Invalid email or password");

    const token = generateToken(admin);
    return {token, admin:{id:admin._id, email:admin.email}};
}


