import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const createProduct = asyncHandler(async (req, res) => {

    const { name, description, price, stock, category } = req.body;

    if (!name || !description || !price || !stock || !category) {
        throw new ApiError(400, "All fields are required");
    }

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
        throw new ApiError(404, "Category not found");
    }

    const product = await Product.create({
        name,
        description,
        price,
        stock,
        category,
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


const getAllProducts = asyncHandler(async(req,res )=>
{
    const products =await Product.find()
    .populate("category","name")
    .populate("createdBy","fullName email")
    .sort({createdAt :-1});

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        products,
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