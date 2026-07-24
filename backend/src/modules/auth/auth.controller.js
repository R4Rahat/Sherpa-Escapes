import { validationResult } from "express-validator";
import ApiError from "../../../utils/apiError.js";
import {login} from './auth.service.js';
import apiResponse from "../../../utils/apiResponse.js";



export const loginController = async (req, res, next) => {
    try{
       const error =  validationResult(req);
       if (!error.isEmpty()) {
         throw new ApiError(400, errors.array()[0].msg);
       }

       const {email, password} = req.body;
       
       const result = await login(email, password);

       apiResponse(res, 200, "Login successful", result);
    }catch(error){
        // return errorMiddleware(error, req, res, next);
        next(error);
    }
}

