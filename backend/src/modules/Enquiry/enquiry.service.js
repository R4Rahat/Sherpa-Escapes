import Enquiry from "./enquiry.model.js";
import ApiError from "../../../utils/apiError.js";


export const getEnquiries = async () => {
    return await Enquiry.find({}).sort({ createdAt: -1 }).populate("package");
}

export const getEnquiryById = async (id) => {
    const enquiry = await Enquiry.findOne({ _id: id }).populate("package");
    if(!enquiry) throw new ApiError(404, "Enquiry not found");
    return enquiry;
}

export const createEnquiry = async (data) => {
    const enquiry = await (await Enquiry.create(data)).populate("package");
    return enquiry;
}

export const updateEnquiry = async (id, data) => {
    const enquiry = await Enquiry.findByIdAndUpdate(id, data, {
        returnDocument: "after",
    }).populate("package");
    if(!enquiry) throw new ApiError(404, "Enquiry not found");
    return enquiry;
}

export const deleteEnquiry = async (id) => {
    const enquiry = await Enquiry.findByIdAndDelete(id);
    if(!enquiry) throw new ApiError(404, "Enquiry not found");
    return enquiry;
}