import ApiError from "../../../utils/apiError.js";
import Blog from "./blog.model.js";

// public + private

export const getAllBlogs = async () => {
    return await Blog.find({}).sort({ createdAt: -1 });
}


// public + private

export const getBlogById = async (id) => {
    const blog = await Blog.findOne({ _id: id });
    if(!blog) throw new ApiError(404, "Blog not found");
    return blog;
}

// admin only

export const createBlog = async (data) => {
    const blog = await Blog.create(data);
    return blog;
}

// admin only

export const updateBlog = async (id, data) => {
    const blog = await Blog.findByIdAndUpdate(id, data, {
        returnDocument: "after",
    })
}

// admin only

export const deleteBlog = async (id) => {
    const blog = await Blog.findByIdAndDelete(id);
    return blog;
}