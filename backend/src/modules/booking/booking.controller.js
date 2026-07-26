import apiResponse from "../../../utils/apiResponse.js";
import { createBooking, deleteBooking, getAllBookings, getBookingById, updateBooking } from "./booking.service.js";




export const getAllBookingsController = async (req, res, next) => {
    try {
        const bookings = await getAllBookings();
        apiResponse(res, 200, "Bookings fetch successfully", bookings);
    } catch (error) {
        next(error);
    }
}

export const getBookingByIdController = async (req, res, next) => {
    try {
        const id = req.params.id;
        const booking = (await getBookingById(id));
        apiResponse(res, 200, "Booking fetch successfully", booking);
    } catch (error) {
        next(error);
    }
}

export const createBookingController = async (req, res, next) => {
    try {
        const booking = await createBooking(req.body);
        apiResponse(res, 200, "Booking created successfully", booking);
    } catch (error) {
        next(error);
    }
}

export const updateBookingController = async (req, res, next) => {
    try {
        const booking = await updateBooking(req.params.id, req.body);
        apiResponse(res, 200, "Booking updated successfully", booking);
    } catch (error) {
        next(error);
    }
}

export const deleteBookingController = async (req, res, next) => {
    try {
        const booking = await deleteBooking(req.params.id);
        apiResponse(res, 200, "Booking deleted successfully", booking);
    } catch (error) {
        next(error);
    }
}