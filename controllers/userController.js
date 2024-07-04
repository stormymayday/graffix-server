import { StatusCodes } from "http-status-codes";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import cloudinary from "cloudinary";
import { formatImage } from "../middleware/multerMiddleware.js";

import User from "../models/UserModel.js";
import Artwork from "../models/ArtworkModel.js";

export const getAllUsers = async (req, res) => {
    const allUsers = await User.find({}).select("-password");

    res.status(StatusCodes.OK).json(allUsers);
};

export const getArtists = async (req, res) => {
    const artists = await User.find({ role: "artist" }).select("-password");

    res.status(StatusCodes.OK).json(artists);
};

export const getNearbyArtists = async (req, res) => {
    const { longitude, latitude, maxDistance } = req.query;

    const nearbyArtists = await User.find({
        role: "artist",
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [parseFloat(longitude), parseFloat(latitude)],
                },
                $maxDistance: parseFloat(maxDistance),
            },
        },
    }).select("-password -avatarPublicID");

    res.status(StatusCodes.OK).json(nearbyArtists);
};

export const getCurrentUser = async (req, res) => {
    // Getting the user
    const user = await User.findOne({ _id: req.user.userId });

    // Removing password
    const userWithoutPassword = user.removePassword();

    // Sending back user without password
    res.status(StatusCodes.OK).json({ userWithoutPassword });
};

// Two files
export const updateUser = async (req, res) => {
    const userId = req.user.userId;
    const newUser = { ...req.body };
    delete newUser.password;

    // Fetching the current user details
    const user = await User.findById(userId);

    if (req.files) {
        if (req.files.avatar) {
            if (user.avatarPublicID) {
                await cloudinary.v2.uploader.destroy(user.avatarPublicID);
            }

            const avatarFile = formatImage(req.files.avatar[0]);
            const avatarResponse = await cloudinary.v2.uploader.upload(
                avatarFile
            );

            newUser.avatar = avatarResponse.secure_url;
            newUser.avatarPublicID = avatarResponse.public_id;
        }

        if (req.files.featuredArt) {
            if (user.featuredArtPublicID) {
                await cloudinary.v2.uploader.destroy(user.featuredArtPublicID);
            }

            const featuredArtFile = formatImage(req.files.featuredArt[0]);
            const featuredArtResponse = await cloudinary.v2.uploader.upload(
                featuredArtFile
            );

            newUser.featuredArtUrl = featuredArtResponse.secure_url;
            newUser.featuredArtPublicID = featuredArtResponse.public_id;
        }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, newUser, {
        new: true,
    });

    res.status(StatusCodes.OK).json({
        msg: "user updated",
        user: updatedUser.removePassword(),
    });
};

export const getUserCollectedTreasures = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).populate("treasureCollection");
        if (!user) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "User not found" });
        }
        res.status(StatusCodes.OK).json(user.treasureCollection);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Server error",
            error,
        });
    }
};

export const likeArtwork = async (req, res) => {
    const { artworkId } = req.params;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user.likedArtwork.includes(artworkId)) {
        user.likedArtwork.push(artworkId);
        await user.save();
        res.status(200).json({ msg: "Artwork liked" });
    } else {
        res.status(400).json({ msg: "Artwork already liked" });
    }
};

export const unlikeArtwork = async (req, res) => {
    const { artworkId } = req.params;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (user.likedArtwork.includes(artworkId)) {
        user.likedArtwork = user.likedArtwork.filter(
            (id) => id.toString() !== artworkId
        );
        await user.save();
        res.status(200).json({ msg: "Artwork unliked" });
    } else {
        res.status(400).json({ msg: "Artwork not liked" });
    }
};

export const getUserLikedArtworks = async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("likedArtwork");

    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ likedArtworks: user.likedArtwork });
};
