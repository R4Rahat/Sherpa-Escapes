import Enquiry from "./enquiry.model.js";
import ApiError from "../../../utils/apiError.js";


export const getEnquiries = async () => {
    return await Enquiry.find({}).sort({ createdAt: -1 });
}

export const getEnquiryById = async () => {
    const enquiry = await Enquiry.findOne({ _id: id });
    if(!enquiry) throw new ApiError(404, "Enquiry not found");
    return enquiry;
}

export const createEnquiry = async (data) => {
    const enquiry = await Enquiry.create(data);
    return enquiry;
}

export const updateEnquiry = async (id, data) => {
    const enquiry = await Enquiry.findByIdAndUpdate(id, data, {
        returnDocument: "after",
    })
    if(!enquiry) throw new ApiError(404, "Enquiry not found");
    return enquiry;
}

export const deleteEnquiry = async (id) => {
    const enquiry = await Enquiry.findByIdAndDelete(id);
    if(!enquiry) throw new ApiError(404, "Enquiry not found");
    return enquiry;
}