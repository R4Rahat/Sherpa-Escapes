import Tour from "./tour.model.js";
import ApiError from "../../utils/apiError.js";


// public
export const getAllActiveTour = () => {
    return await Tour.find({isActive: true}).sort({createdAt: -1})
}

export const getTourById = (id) => {
    const tour = await Tour.findOne({_id:id, isActive:true});
    if(!tour) throw new ApiError(404, "Tour not found")
}

export const getAllTour = () => {
    return await Tour.find({}).sort({createdAt: -1})
}

export const createTour = () => {
    return await Tour.create
}