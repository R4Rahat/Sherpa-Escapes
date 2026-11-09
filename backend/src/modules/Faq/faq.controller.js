import {
  createFaq,
  deleteFaq,
  getAllFaqs,
  getFaqById,
  getPublicFaqs,
  updateFaq,
} from "./faq.service.js";
import apiResponse from "../../../utils/apiResponse.js";
import ApiError from "../../../utils/apiError.js";
import mongoose from "mongoose";

export const getPublicFaqController = async (req, res, next) => {
  try {
    const faqs = await getPublicFaqs();
    apiResponse(res, 200, "Faq fetch successfully", faqs);
  } catch (error) {
    next(error);
  }
};

export const getAllFaqsController = async (req, res, next) => {
  try {
    const faqs = await getAllFaqs();
    apiResponse(res, 200, "Faq fetch successfully", faqs);
  } catch (error) {
    next(error);
  }
};

export const getFaqByIdController = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return next(new ApiError(400, "Invalid id"));
    const faq = await getFaqById(req.params.id);
    apiResponse(res, 200, "Faq fetch successfully", faq);
  } catch (error) {
    next(error);
  }
};

export const createFaqController = async (req, res, next) => {
  try {
    const faq = await createFaq(req.body);
    apiResponse(res, 200, "Faq created successfully", faq);
  } catch (error) {
    next(error);
  }
};

export const updateFaqController = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return next(new ApiError(400, "Invalid id"));
    const faq = await updateFaq(req.params.id, req.body);
    apiResponse(res, 200, "Faq updated successfully", faq);
  } catch (error) {
    next(error);
  }
};

export const deleteFaqController = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return next(new ApiError(400, "Invalid id"));
    const faq = await deleteFaq(req.params.id);
    apiResponse(res, 200, "Faq deleted successfully", faq);
  } catch (error) {
    next(error);
  }
};
