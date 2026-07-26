
import apiResponse from "../../../utils/apiResponse.js";
import { createPackage, deletePackage, getAllActivePackages, getAllPackages, getPackageById, updatePackage } from "./package.service.js";



// public

export const getAllActivePackagesController = async (req, res, next) => {
  try {
    const packages = await getAllActivePackages();
    apiResponse(res, 200, "Tour fetch successfully", packages);
  } catch (error) {
    next(error);
  }
};


export const getPackageByIdController = async (req, res, next) => {
  const id = req.params.id;
  try {
    const packages = await getPackageById(id);
    apiResponse(res, 200, "Package fetch successfully", packages);
  } catch (error) {
    next(error);
  }
};

// admin

export const getAllPackageController = async (req, res, next) => {
  try {
    const packages = await getAllPackages();
    apiResponse(res, 200, "Tour fetch successfully", packages);
  } catch (error) {
    next(error);
  }
};

export const createPackageController = async (req, res, next) => {
  console.log(req.body);
  try {
    const packages = await createPackage(req.body);
    apiResponse(res, 200, "Package created successfully", packages);
  } catch (error) {
    next(error);
  }
};

export const updatePackageController = async (req, res, next) => {
  try {
    const packages = await updatePackage(req.params.id, req.body);
    apiResponse(res, 200, "Package updated successfully", packages);
  } catch (error) {
    next(error);
  }
};

export const deletePackageController = async (req, res, next) => {
  try {
    const packages = await deletePackage(req.params.id);
    apiResponse(res, 200, "Package deleted successfully", packages);
  } catch (error) {
    next(error);
  }
};