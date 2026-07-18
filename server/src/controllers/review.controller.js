import { Review } from "../models/review.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addReview = asyncHandler(async (req, res) => {

    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
        throw new ApiError(400, "All fields are required");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const alreadyReviewed = await Review.findOne({
        user: req.user._id,
        product: productId
    });

    if (alreadyReviewed) {
        throw new ApiError(400, "You have already reviewed this product");
    }

    const review = await Review.create({
        user: req.user._id,
        product: productId,
        rating,
        comment
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            review,
            "Review added successfully"
        )
    );
});

const getProductReviews = asyncHandler(async (req, res) => {

    const { productId } = req.params;

    const reviews = await Review.find({
        product: productId
    })
    .populate("user", "fullName")
    .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            reviews,
            "Product reviews fetched successfully"
        )
    );
});

const updateReview = asyncHandler(async (req, res) => {

    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
        throw new ApiError(400, "Rating and comment are required");
    }

    const review = await Review.findOne({
        _id: reviewId,
        user: req.user._id
    });

    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    review.rating = rating;
    review.comment = comment;

    await review.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            review,
            "Review updated successfully"
        )
    );
});

const deleteReview = asyncHandler(async (req, res) => {
 
    const { reviewId } = req.params;
  console.log("Review Id",reviewId );
  console.log("logged user",req.user._id);
  
  
    const review = await Review.findOneAndDelete({
        _id: reviewId,
        user: req.user._id
    });
console.log("review found",review);

    if (!review) {
        throw new ApiError(404, "Review not found");
    }
    
    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Review deleted successfully"
        )
    );
});
export {
    addReview,
    getProductReviews,
    updateReview,
    deleteReview

};