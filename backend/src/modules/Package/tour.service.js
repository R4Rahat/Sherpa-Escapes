import Package from "./package.model.js";
import ApiError from "../../../utils/apiError.js";

// public
export const getAllActiveTours = async () => {
  return await Package.find({ isActive: true }).sort({ createdAt: -1 });
};

export const getTourById = async (id) => {
  const tour = await Package.findOne({ _id: id, isActive: true });
  if (!tour) throw new ApiError(404, "Tour not found");
  return tour;
};

// admin

export const getAllTour = async () => {
  return await Package.find({}).sort({ createdAt: -1 });
};

export const createTour = async (data) => {
  const tour = await Package.create(data);
  return tour;
};

export const updateTour = async (id, data) => {
  const tour = await Package.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!tour) throw new ApiError(404, "Tour not found");
  return tour;
};

export const deleteTour = async (id) => {
  const tour = await Package.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );
  if (!tour) throw new ApiError(404, "Tour not found");
  return tour;
};
