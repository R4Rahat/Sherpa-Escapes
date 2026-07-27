import Testimonial from "./testimonial.model.js";


// public
export const getPublicTestimonials = async () => {
  return Testimonial.find({ isDisplay: true }).sort({ createdAt: -1 });
};

// admin

export const getAllTestimonials = async () => {
  return Testimonial.find({}).sort({ createdAt: -1 });
};

export const getTestimonialById = async () => {
  const testimonial = await Testimonial.findById(req.params.id);
  if(!testimonial) return next(new ApiError(404, "Testimonial not found"));
  return testimonial;
};

export const createTestimonial = async () => {
  const testimonial = await Testimonial.create(req.body);
  return testimonial;
};


export const updateTestimonial = async () => {
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if(!testimonial) return next(new ApiError(404, "Testimonial not found"));
  return testimonial;
};

export const deleteTestimonial = async () => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if(!testimonial) return next(new ApiError(404, "Testimonial not found"));
  return testimonial;
};
