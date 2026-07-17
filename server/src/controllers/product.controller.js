import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import mongoose from "mongoose";

const createProduct = asyncHandler(async (req, res) => {

    const { name, description, price, stock, category } = req.body;
   console.log("Body",req.body);
   
    if (!name || !description || !price || !stock || !category) {
        throw new ApiError(400, "All fields are required");
    }

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
        throw new ApiError(404, "Category not found");
    }

    // Upload product images to Cloudinary
    const imageLocalPaths = req.files?.map((file) => file.path) || [];
    console.log("Files",req.files);
    
    const imageUrls = [];

    for (const path of imageLocalPaths) {
        const uploadedImage = await uploadOnCloudinary(path);

        if (uploadedImage?.url) {
            imageUrls.push(uploadedImage.url);
        }
    }

    const product = await Product.create({
        name,
        description,
        price,
        stock,
        category,
        images: imageUrls,
        createdBy: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            product,
            "Product created successfully"
        )
    );
});


const getAllProducts = asyncHandler(async (req, res) => {

    const {
        search = "",
        category,
        page = 1,
        limit = 10,
        sort = "-createdAt"
    } = req.query;

    const filter = {};

    // Search by product name
    if (search) {
        filter.name = {
            $regex: search,
            $options: "i"
        };
    }

    // Filter by category
    if (category) {
        filter.category = category;
    }

    const products = await Product.find(filter)
        .populate("category", "name")
        .populate("createdBy", "fullName email")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const totalProducts = await Product.countDocuments(filter);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalProducts,
                currentPage: Number(page),
                totalPages: Math.ceil(totalProducts / limit),
                products
            },
            "Products fetched successfully"
        )
    );
});

const getProductById = asyncHandler(async(req,res)=>{
    const {productId}=req.params;

    if(!mongoose.Types.ObjectId.isValid(productId)){
        throw new ApiError(400,"Invalid product ID");
    }
    const product = await Product.findById(productId)
    .populate("category","name")
    .populate("createdBy","fullName email");

    if(!product){
        throw new ApiError(400, "product not  found");
    }
   return res
   .status(200)
   .json(new ApiResponse(
    200,
    product,
    "Products fetched successfully"
   )
);
})

const updateProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { name, description, price, stock, category } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "Invalid product ID");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    if (category) {
        const categoryExists = await Category.findById(category);

        if (!categoryExists) {
            throw new ApiError(404, "Category not found");
        }

        product.category = category;
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ?? product.price;
    product.stock = stock ?? product.stock;

    await product.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            product,
            "Product updated successfully"
        )
    );
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "Invalid product ID");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    await Product.findByIdAndDelete(productId);

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Product deleted successfully"
        )
    );
});


export {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};