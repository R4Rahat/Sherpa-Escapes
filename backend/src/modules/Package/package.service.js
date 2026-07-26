import Package from "./package.model.js";
import ApiError from "../../../utils/apiError.js";

// public
export const getAllActivePackages = async () => {
  return await Package.find({ isActive: true }).sort({ createdAt: -1 });
};

export const getPackageById = async (id) => {
  const packages = await Package.findOne({ _id: id, isActive: true });
  if (!packages) throw new ApiError(404, "Package not found");
  return packages;
};

// admin

export const getAllPackages = async () => {
  return await Package.find({}).sort({ createdAt: -1 });
};

export const createPackage = async (data) => {
  const packages = await Package.create(data);
  return packages;
};

export const updatePackage = async (id, data) => {
  const packages = await Package.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!packages) throw new ApiError(404, "Package not found");
  return packages;
};

export const deletePackage = async (id) => {
  const packages = await Package.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );
  if (!packages) throw new ApiError(404, "Package not found");
  return packages;
};
