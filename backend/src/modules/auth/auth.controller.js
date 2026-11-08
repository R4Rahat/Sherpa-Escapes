import { validationResult } from "express-validator";
import ApiError from "../../../utils/apiError.js";
import {login} from './auth.service.js';
import apiResponse from "../../../utils/apiResponse.js";



export const loginController = async (req, res, next) => {
    try{
       const errors =  validationResult(req);
       if (!errors.isEmpty()) {
         throw new ApiError(400, errors.array()[0].msg);
       }

       const {email, password} = req.body;
       
       const result = await login(email, password);

       const {token, admin} = result;

       res.cookie("token", token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "strict",
         maxAge: 7 * 24 * 60 * 60 * 1000
       });

       apiResponse(res, 200, "Login successful", { admin, token });
    }catch(error){
        // return errorMiddleware(error, req, res, next);
        next(error);
    }
}

export const logoutController = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    apiResponse(res, 200, "Logout successful");
  } catch (error) {
    next(error);
  }
};

export const getMeController = async (req, res, next) => {
  try {
    apiResponse(res, 200, "Admin profile fetched", req.user);
  } catch (error) {
    next(error);
  }
};


