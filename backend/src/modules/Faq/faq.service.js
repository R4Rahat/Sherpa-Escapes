import ApiError from "../../../utils/apiError.js";
import Faq from "./faq.model.js";

// public
export const getPublicFaqs = async () => {
    return await Faq.find({ isDisplay: true }).sort({ createdAt: -1 });
}

// private
export const getAllFaqs = async () => {
    return await Faq.find({}).sort({createdAt:-1})
}

export const getFaqById = async (id) => {
    const faq = await Faq.findOne({ _id: id });
    if(!faq) throw new ApiError(404, "Faq not found");
    return faq;
}

export const createFaq = async (data) => {
    const faq = await Faq.create(data);
    return faq
}

export const updateFaq = async (id, data) => {
    const faq = await Faq.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    if(!faq) throw new ApiError(404, "Faq not found");
    return faq;
}

export const deleteFaq = async (id) => {
    const faq = await Faq.findByIdAndDelete(id);
    if(!faq) throw new ApiError(404, "Faq not found");
    return faq;
}