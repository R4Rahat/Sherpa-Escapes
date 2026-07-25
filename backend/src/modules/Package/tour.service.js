import Tour from "./package.model.js";
import ApiError from "../../utils/apiError.js";

// public
export const getAllActiveTours = async () => {
  return await Tour.find({ isActive: true }).sort({ createdAt: -1 });
};

export const getTourById = async (id) => {
  const tour = await Tour.findOne({ _id: id, isActive: true });
  if (!tour) throw new ApiError(404, "Tour not found");
  return tour;
};

// admin

export const getAllTour = async () => {
  return await Tour.find({}).sort({ createdAt: -1 });
};

export const createTour = async (data) => {
  const tour = await Tour.create(data);
  return tour;
};

export const updateTour = async (id, data) => {
  const tour = await Tour.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!tour) throw new ApiError(404, "Tour not found");
  return tour;
};

export const deleteTour = async (id) => {
  const tour = await Tour.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );
  if (!tour) throw new ApiError(404, "Tour not found");
  return tour;
};
