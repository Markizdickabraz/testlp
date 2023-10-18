const { Goods } = require('../models/goods');
const {ctrlWrapper, HttpError } = require('../helpers');

const getAll = async (req, res, next) => {
    const { id } = req.body;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const result = await Goods.find({ id }, "", { skip, limit });

    res.status(200).json(result);
};


const getById = async (req, res, next) => {
    const { id } = req.params;
    const result = await Goods.findById(id);
    if (!result) {
        throw HttpError(404, 'Not found');
    }
    res.status(200).json(result);
};

const addGood = async (req, res, next) => {
    const { _id: owner } = req.user;
    const result = await Goods.create({ ...req.body, owner});
    res.status(201).json(result)
};

module.exports = {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    addGood: ctrlWrapper(addGood),
}