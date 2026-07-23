import { asyncHandler } from "../utils/asyncHandler.js";
import {User } from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import {uploadOnCloudinary } from "../utils/cloudinary.js"
import { sendEmail } from "../utils/mail.service.js";
import crypto from "crypto";


 
const generateAccessAndRefreshTokens = async(userId) =>{
    try {
        const user =await User.findById(userId);

       const accessToken = user.generateAccessToken();
       const refreshToken = user.generateRefreshToken();

       user.refreshToken = refreshToken;

       await user.save({validateBeforeSave:false});

       return {accessToken,refreshToken};

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
};

const registerUser= asyncHandler(async(req,res)=>{
    const {
        fullName,
        email,
        username,
        password
    } =req.body;

    if([fullName,email,username,password].some(
        (field) => field?.trim() === ""
    )
){
    throw new ApiError(400,"All fields are required");
}


const existedUser =await User.findOne({
    $or:[{username},{email}]
});
if(existedUser){
    throw new ApiError(409,"User with email or username already exists")
}

const user =await User.create({
    fullName,
    email,
    username:username.toLowerCase(),
    password,
});

const createdUser =await User.findById(user._id).select(
    "-password -refreshToken"
);

if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering user");
}

await sendEmail(
    user.email,
    "Welcome to E-Commerce",
    `
        <h2>Welcome ${user.fullName}</h2>
        <p>Your account has been created successfully.</p>
        <p>Thank you for joining our E-Commerce platform.</p>
    `
);


return res
.status(201)
.json(
    new ApiResponse(201,createdUser,"User  registered successfully")
);

});


const loginUser = asyncHandler(async(req, res) =>{
    const{
        email,
        username,
        password
    } = req.body;

    console.log("Request Body:", req.body);
console.log("Email:", email);
console.log("Username:", username);
    if(!(email || username)){
        throw new ApiError(400,"Username or Email is required");
    }
    
console.log("requested email",email);

   const user = await User.findOne({
  email: email.trim().toLowerCase()
});

console.log("Found User:", user);
   
    if(!user){
        throw new ApiError(404,"User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credentials");       
    }

    const {accessToken,refreshToken} = await
     generateAccessAndRefreshTokens(user._id);
     
     const loggedInUser =await User.findById(user._id)
     .select("-password -refreshToken");

     const options ={
        httpOnly:true,
        secure:false
     }

     return res 
     .status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",refreshToken,options)
     .json(new ApiResponse(
        200,{
            user:loggedInUser,
            accessToken,
            refreshToken
        },
        "User logged in successfully"
     )
    );
});

const logoutUser = asyncHandler(async(req,res )=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
        $unset :{
                   refreshToken:1
                }
       },
    {
        new:true
    }
);
 
const options ={
    httpOnly:true,
    secure:false
}

return res.status(200)
.clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(
    new ApiResponse(
        200,
        {},
        "User logged out successfully"
    )
)

});

const getCurrentUser = asyncHandler(async(req ,res)=>{
    return res
    .status(200)
    .json(new ApiResponse(200,req.user,
        "Current user fetched successfully "
    )
);
});


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const options = {
            httpOnly: true,
            secure: false
        };

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken
                    },
                    "Access token refreshed successfully"
                )
            );

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

const changeCurrentPassword = asyncHandler(async(req,res) =>{
    const{oldPassword ,newPassword}=req.body;

    const user = await User.findById(req.user?._id);
    const isPasswordCorrect =await user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid old password");
    }

    user.password = newPassword;

    await user.save({validateBeforeSave:false});

    return res
    .status(200).json(new ApiResponse(200,
        {},
        "Password changed successfully"
    )
);
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required");
    }

     console.log("req.user",req.user);
     console.log("req.user._id",req.user?._id);

    const user = await User.findByIdAndUpdate(
       
        req.user?._id,
        {
            $set: {
                fullName,
                email
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken");
   console.log("updateuser",user);
    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "Account details updated successfully"
        )
    );
});


const updateUserAvatar =asyncHandler(async(req,res)=>{
    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is missing");
    }

    const avatar =await uploadOnCloudinary(avatarLocalPath);

    if(!avatar){
        throw new ApiError(400,"Error while uploading avatar");
    }

    const user= await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:avatar.url
            }
        },
        {
            new:true
        }
    ).select("-password -refreshToken");

    return res
    .status(200)
    .json(
        new ApiResponse(200,
            user,
            "Avatar updated successfully"
        )
    );
});

const updateUserCoverImage =asyncHandler(async(req,res)=>{
    const coverImageLocalPath = req.file?.path;

    if(!coverImageLocalPath){
        throw new ApiError(400,"Avatar file is missing");
    }

    const coverImage =await uploadOnCloudinary(coverImageLocalPath);

    if(!coverImage){
        throw new ApiError(400,"Error while uploading cover image");
    }

    const user= await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage:coverImage.url
            }
        },
        {
            new:true
        }
    ).select("-password -refreshToken");

    return res
    .status(200)
    .json(
        new ApiResponse(200,
            user,
            "Cover Image updated successfully"
        )
    );
});

const forgotPassword = asyncHandler(async (req, res) => {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    await sendEmail(
    user.email,
    "Reset Your Password",
    `
        <h2>Password Reset Request</h2>

        <p>Hello ${user.fullName},</p>

        <p>Click the link below to reset your password:</p>

        <a href="${resetLink}">
            Reset Password
        </a>

        <p>This link will expire in 15 minutes.</p>
    `
);

    return res.status(200).json(
        new ApiResponse(
            200,
             {},
            "Password reset token generated successfully"
        )
    );

});

const resetPassword = asyncHandler(async (req, res) => {

    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired reset token");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Password reset successfully"
        )
    );
});
export {registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    refreshAccessToken,
    changeCurrentPassword,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    forgotPassword,resetPassword


};