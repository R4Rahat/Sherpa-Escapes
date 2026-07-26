import ApiError from "../../../utils/apiError.js";
import Booking from "./booking.model.js";

// admin

export const getAllBookings = async () => {
    return await Booking.find({}).sort({ createdAt: -1 }).populate("package");
}

export const getBookingById = async (id) => {
    const booking = await Booking.findOne({ _id: id, isActive: true }).populate(
      "package",
    );
    if(!booking) throw new ApiError(404, "Booking not found");
    return booking;
}

export const createBooking = async (data) => {
    const booking = await Booking.create(data);
    return booking;
}

export const updateBooking = async (id, data) => {
    const booking = await Booking.findByIdAndUpdate(id, data,{
        returnDocument: "after",
    }).populate("package")
    if(!booking) throw new ApiError(404, "Booking not found");
    return booking;
}

export const deleteBooking = async (id) => {
    const booking = await Booking.findByIdAndDelete(id);
    if(!booking) throw new ApiError(404, "Booking not found");
    return booking;
}