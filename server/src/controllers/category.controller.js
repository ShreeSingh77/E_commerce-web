import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../models/category.model.js";
import mongoose from "mongoose";

const createCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name?.trim()) {
        throw new ApiError(400, "Category name is required");
    }

    const existedCategory = await Category.findOne({
        name: name.trim()
    });

    if (existedCategory) {
        throw new ApiError(409, "Category already exists");
    }

    const category = await Category.create({
        name: name.trim(),
        description
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            category,
            "Category created successfully"
        )
    );
});

const getAllCategories = asyncHandler(async (req, res) => {

    const categories = await Category.find().sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            categories,
            "Categories fetched successfully"
        )
    );
});



const getCategoryById = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new ApiError(400, "Invalid category ID");
    }

    const category = await Category.findById(categoryId);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            category,
            "Category fetched successfully"
        )
    );
});


const updateCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new ApiError(400, "Invalid category ID");
    }

    const category = await Category.findById(categoryId);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    category.name = name || category.name;
    category.description = description || category.description;

    await category.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            category,
            "Category updated successfully"
        )
    );
});


const deleteCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new ApiError(400, "Invalid category ID");
    }

    const category = await Category.findById(categoryId);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    await Category.findByIdAndDelete(categoryId);

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Category deleted successfully"
        )
    );
});

export { createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory

};