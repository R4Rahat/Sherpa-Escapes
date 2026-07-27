import {
  createTestimonial,
  deleteTestimonial,
  getAllTestimonials,
  getPublicTestimonials,
  getTestimonialById,
  updateTestimonial,
} from "./testimonial.service.js";
import apiResponse from "../../../utils/apiResponse.js";
import mongoose from "mongoose";

// public
export const getPublicTestimonialsController = async (req, res, next) => {
  try {
    const testimonials = await getPublicTestimonials();
    apiResponse(res, 200, "Testimonials fetched successfully", testimonials);
  } catch (error) {
    next(error);
  }
};

// private
export const getAllTestimonialsController = async (req, res, next) => {
  try {
    const testimonials = await getAllTestimonials();
    apiResponse(res, 200, "Testimonials fetched successfully", testimonials);
  } catch (error) {
    next(error);
  }
};

export const getTestimonialByIdController = async (req, res, next) => {
  try {
    const testimonials = await getTestimonialById(req.params.id);
    apiResponse(res, 200, "Testimonials fetched successfully", testimonials);
  } catch (error) {
    next(error);
  }
};

export const createTestimonialController = async (req, res, next) => {
  try {
    const testimonials = await createTestimonial(req.body);
    apiResponse(res, 200, "Testimonials created successfully", testimonials);
  } catch (error) {
    next(error);
  }
};

export const updateTestimonialController = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return next(new ApiError(400, "Invalid id"));
    const testimonial = await updateTestimonial(req.params.id, req.body);
    apiResponse(res, 200, "Testimonial updated successfully", testimonial);
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonialController = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return next(new ApiError(400, "Invalid id"));
    const testimonial = await deleteTestimonial(req.params.id);
    apiResponse(res, 200, "Testimonial deleted successfully", testimonial);
  } catch (error) {
    next(error);
  }
};
