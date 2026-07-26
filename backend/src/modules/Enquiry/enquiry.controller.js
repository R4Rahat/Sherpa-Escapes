import { createEnquiry, getEnquiries, getEnquiryById, updateEnquiry } from "./enquiry.service.js";
import  apiResponse from "../../../utils/apiResponse.js";
import mongoose from "mongoose";


export const getEnquiryController = async (req, res, next) => {
    try {
        const enquiries = await getEnquiries();
        apiResponse(res, 200, "Enquiries fetched successfully", enquiries);
    } catch (error) {
        next(error);
    }
}

export const getEnquiryByIdController = async (req, res, next) => {
    try {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) return next(new ApiError(400, "Invalid id"));
        const enquiry = await getEnquiryById(req.params.id);
        apiResponse(res, 200, "Enquiry fetched successfully", enquiry);
    } catch (error) {
        next(error);
    }
}

export const createEnquiryController = async (req, res, next) => {
    try {
        const enquiry = await createEnquiry(req.body);
        apiResponse(res, 200, "Enquiry created successfully", enquiry);
    } catch (error) {
        next(error);
    }
}


export const updateEnquiryController = async (req, res, next) => {
    try {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) return next(new ApiError(400, "Invalid id"));
        const enquiry = await updateEnquiry(req.params.id, req.body);
        apiResponse(res, 200, "Enquiry updated successfully", enquiry);
    } catch (error) {
        next(error);
    }
}

export const deleteEnquiryController = async (req, res, next) => {
    try {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) return next(new ApiError(400, "Invalid id"));
        const enquiry = await deleteEnquiry(req.params.id);
        apiResponse(res, 200, "Enquiry deleted successfully", enquiry);
    } catch (error) {
        next(error);
    }
}