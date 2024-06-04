import ArtModel from "../models/ArtModel.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customErrors.js";

export const createArt = async (req, res) => {
    const art = await ArtModel.create(req.body);

    return res.status(StatusCodes.CREATED).json({ art });
};

export const getAllArt = async (req, res) => {
    const allArt = await ArtModel.find({});
    res.status(StatusCodes.OK).json({ allArt });
};

export const getSingleArt = async (req, res) => {
    const { id } = req.params;

    const singleArt = await ArtModel.findById(id);

    if (!singleArt) {
        throw new NotFoundError(`no art with id ${id}`);
    }

    res.status(200).json({ singleArt });
};

export const updateArt = async (req, res) => {
    const { id } = req.params;

    const updatedArt = await ArtModel.findByIdAndUpdate(id, req.body, {
        new: true,
    });

    if (!updatedArt) {
        throw new NotFoundError(`no art with id ${id}`);
    }

    return res
        .status(StatusCodes.OK)
        .json({ msg: "art modified", art: updatedArt });
};

export const deleteArt = async (req, res) => {
    const { id } = req.params;

    const removedArt = await ArtModel.findOneAndDelete(id);

    if (!removedArt) {
        throw new NotFoundError(`no art with id ${id}`);
    }

    res.status(StatusCodes.OK).json({ msg: "art deleted", art: removedArt });
};
