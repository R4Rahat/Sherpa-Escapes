
import apiResponse from "../../../utils/apiResponse.js";
import { getAllActiveTours, getAllTour, getTourById } from "./tour.service.js";


// public

export const getAllActiveToursController = async (req, res, next) => {
    try {
        const tours = await getAllActiveTours();
        apiResponse(res, 200, "Tour fetch successfully", tours);
    } catch (error) {
        next(error);
    }
}


export const getTourByIdController = async (req, res, next) => {
    const id = req.params.id;
    try {
       const tour = await getTourById(id);
       apiResponse(res, 200, "Tour fetch successfully", tour); 
    } catch (error) {
        next(error);
    }
}

// admin

export const getAllTourController = async (req, res, next) => {
    try {
        const tours = await getAllTour();
        apiResponse(res, 200, "Tour fetch successfully", tours);
    } catch (error) {
        next(error);
    }
}

export const createTourController = async (req, res, next) => {
    console.log(req.body);
    try {
        const tour = await createTour(req.body);
        apiResponse(res, 200, "Tour created successfully", tour);
    } catch (error) {
        next(error);
    }
}

export const updateTourController = async (req, res, next) => {
    try {
        const tour = await updateTour(req.params.id, req.body);
        apiResponse(res, 200, "Tour updated successfully", tour);
    } catch (error) {
        next(error);
    }
}

export const deleteTourController = async (req, res, next) => {
    try {
        const tour = await deleteTour(req.params.id);
        apiResponse(res, 200, "Tour deleted successfully", tour);
    } catch (error) {
        next(error);
    }
}