const { Goods } = require('../models/goods');
const {ctrlWrapper, HttpError } = require('../helpers');

const getAll = async (req, res, next) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10, favorite } = req.query;
    const skip = (page - 1) * limit;
    const result = await Goods.find({ owner }, "", { skip, limit });
    
    let filterFavorite;
    
    if (favorite) {
        filterFavorite= result.filter(item => item.favorite === true)
    }
    if (!favorite) {
        filterFavorite= result.filter(item => item.favorite === false)
    }
    else {
        filterFavorite = result;
    }

    res.status(200).json(favorite ? filterFavorite : result);
};

const getById = async (req, res, next) => {
    const { id } = req.params;
    const result = await Goods.findById(id);
    if (!result) {
        throw HttpError(404, 'Not found');
    }
    res.status(200).json(result);
};

module.exports = {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
}