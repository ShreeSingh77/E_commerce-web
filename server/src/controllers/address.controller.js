import { Address } from "../models/address.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addAddress = asyncHandler(async (req, res) => {
    const {
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country
    } = req.body;

    if (
        !fullName ||
        !phone ||
        !addressLine1 ||
        !city ||
        !state ||
        !postalCode
    ) {
        throw new ApiError(400, "All required fields are mandatory");
    }

    const address = await Address.create({
        user: req.user._id,
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country
    });

    return res
        .status(201)
        .json(new ApiResponse(201, address, "Address added successfully"));
});
const getMyAddresses = asyncHandler(async (req, res) => {
    const addresses = await Address.find({
        user: req.user._id,
    }).sort({ isDefault: -1, createdAt: -1 });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                addresses,
                "Addresses fetched successfully"
            )
        );
});

const updateAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;

    const address = await Address.findOne({
        _id: addressId,
        user: req.user._id,
    });

    if (!address) {
        throw new ApiError(404, "Address not found");
    }

    const updatedAddress = await Address.findByIdAndUpdate(
        addressId,
        {
            $set: req.body,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedAddress,
                "Address updated successfully"
            )
        );
});

const deleteAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;

    const address = await Address.findOne({
        _id: addressId,
        user: req.user._id,
    });

    if (!address) {
        throw new ApiError(404, "Address not found");
    }

    await Address.findByIdAndDelete(addressId);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Address deleted successfully"
            )
        );
});
const setDefaultAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;

    const address = await Address.findOne({
        _id: addressId,
        user: req.user._id,
    });

    if (!address) {
        throw new ApiError(404, "Address not found");
    }

    // Remove default from all addresses of this user
    await Address.updateMany(
        { user: req.user._id },
        { $set: { isDefault: false } }
    );

    // Set selected address as default
    address.isDefault = true;
    await address.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            address,
            "Default address updated successfully"
        )
    );
});
export { addAddress ,
    getMyAddresses,
    updateAddress,
    deleteAddress,
    setDefaultAddress
};