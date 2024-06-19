import ArtModel from "../models/ArtworkModel.js";
import { StatusCodes } from "http-status-codes";
import cloudinary from "cloudinary";
import { formatImage } from "../middleware/multerMiddleware.js";

export const createArtwork = async (req, res) => {
    const { title, description, category } = req.body;

    const createdBy = req.user.userId;

    let artworkUrl, artworkPublicID;

    // Checking if file is present
    if (req.file) {
        const file = formatImage(req.file);
        const response = await cloudinary.v2.uploader.upload(file);

        artworkUrl = response.secure_url;
        artworkPublicID = response.public_id;
    }

    const art = await ArtModel.create({
        title,
        description,
        category,
        artworkUrl,
        artworkPublicID,
        createdBy,
    });

    return res.status(StatusCodes.CREATED).json({ art });
};

export const getAllArtworks = async (req, res) => {
    const allArt = await ArtModel.find({});

    res.status(StatusCodes.OK).json({ allArt });
};

export const getArtworksByCategory = async (req, res) => {
    const { category } = req.params;

    const artworks = await ArtModel.find({ category });

    res.status(StatusCodes.OK).json(artworks);
};

export const getSingleArtwork = async (req, res) => {
    const { id } = req.params;

    const singleArt = await ArtModel.findById(id);

    res.status(200).json({ singleArt });
};

export const updateArtwork = async (req, res) => {
    const { id } = req.params;

    const updates = req.body;

    if (req.file) {
        const artwork = await ArtModel.findById(id);

        if (artwork.artworkPublicID) {
            await cloudinary.v2.uploader.destroy(artwork.artworkPublicID);
        }

        const file = formatImage(req.file);

        const response = await cloudinary.v2.uploader.upload(file);

        updates.artworkUrl = response.secure_url;
        updates.artworkPublicID = response.public_id;
    }

    const updatedArt = await ArtModel.findByIdAndUpdate(id, updates, {
        new: true,
    });

    return res
        .status(StatusCodes.OK)
        .json({ msg: "art modified", art: updatedArt });
};

export const deleteArtwork = async (req, res) => {
    const { id } = req.params;

    const removedArt = await ArtModel.findOneAndDelete(id);

    // Deleting file from Cloudinary
    if (removedArt.artworkPublicID) {
        await cloudinary.v2.uploader.destroy(removedArt.artworkPublicID);
    }

    res.status(StatusCodes.OK).json({ msg: "art deleted", art: removedArt });
};
