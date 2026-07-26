import apiResponse from "../../../utils/apiResponse.js";
import { createBlog, deleteBlog, getAllBlogs, getBlogById, updateBlog } from "./blog.service.js";



export const getAllBlogsController = async (req, res, next) => {
    try {
        const blogs = await getAllBlogs();
        apiResponse(res, 200, "Blogs fetched successfully", blogs);
    } catch (error) {
        next(error);
    }
}

export const getBlogByIdController = async (req, res, next) => {
    try{
        const blog = await getBlogById(req.params.id);
        apiResponse(res, 200, "Blog fetched successfully", blog);
    }catch(error){
        next(error);
    }
}

export const createBlogController = async (req, res, next) => {
    try {
        const blog = await createBlog(req.body);
        apiResponse(res, 200, "Blog created successfully", blog);
    } catch (error) {
        next(error);
    }
}


export const updateBlogController = async (req, res, next) => {
    try {
        const blog = await updateBlog(req.params.id, req.body, {
            returnDocument: "after",
        });
        apiResponse(res, 200, "Blog updated successfully", blog);
    } catch (error) {
        next(error);
    }
}

export const deleteBlogController = async (req, res, next) => {
    try {
        const blog = await deleteBlog(req.params.id);
        apiResponse(res, 200, "Blog deleted successfully", blog);
    } catch (error) {
        next(error);
    }
}