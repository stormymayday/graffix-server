import ArtModel from "../models/ArtworkModel.js";
import { StatusCodes } from "http-status-codes";
import cloudinary from "cloudinary";
// import { promises as fs } from "fs";
import { formatImage } from "../middleware/multerMiddleware.js";

export const createArtwork = async (req, res) => {
    // CREATE v1 - START
    // req.body.createdBy = req.user.userId;
    // const art = await ArtModel.create(req.body);
    // return res.status(StatusCodes.CREATED).json({ art });
    // CREATE v1 - END

    // CREATE v2 - START (testing file upload)
    const { title, description, category } = req.body;
    const createdBy = req.user.userId;
    let artworkUrl, artworkPublicID;
    if (req.file) {
        const file = formatImage(req.file);
        const response = await cloudinary.v2.uploader.upload(file);
        // await fs.unlink(req.file.path);

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
    // CREATE v2 - END (testing file upload)
};

export const getAllArtworks = async (req, res) => {
    // console.log(req.user);
    const allArt = await ArtModel.find({});
    res.status(StatusCodes.OK).json({ allArt });
};

export const getSingleArtwork = async (req, res) => {
    const { id } = req.params;

    const singleArt = await ArtModel.findById(id);

    res.status(200).json({ singleArt });
};

export const updateArtwork = async (req, res) => {
    // UPDATE V1 - START
    // const { id } = req.params;
    // const updatedArt = await ArtModel.findByIdAndUpdate(id, req.body, {
    //     new: true,
    // });
    // return res
    //     .status(StatusCodes.OK)
    //     .json({ msg: "art modified", art: updatedArt });
    // UPDATE V1 - END

    // UPDATE v2 - START (testing file upload)
    const { id } = req.params;
    const updates = req.body;

    if (req.file) {
        const artwork = await ArtModel.findById(id);

        if (artwork.artworkPublicID) {
            await cloudinary.v2.uploader.destroy(artwork.artworkPublicID);
        }

        const file = formatImage(req.file);

        // const response = await cloudinary.v2.uploader.upload(req.file.path);
        const response = await cloudinary.v2.uploader.upload(file);
        // await fs.unlink(req.file.path);

        updates.artworkUrl = response.secure_url;
        updates.artworkPublicID = response.public_id;
    }

    const updatedArt = await ArtModel.findByIdAndUpdate(id, updates, {
        new: true,
    });

    return res
        .status(StatusCodes.OK)
        .json({ msg: "art modified", art: updatedArt });
    // UPDATE v2 - END (testing file upload)
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
