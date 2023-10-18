const { Schema, model } = require('mongoose');
const { hendleMongooseError } = require('../helpers');
const Joi = require('joi');

const goodsShema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name']
    },
    title: {
        type: String,
    },
    price: {
        type: Number,
    },
    photo: {
        type: String,
        required: [true, 'Set url']
    }
}, { versionKey: false, timestamps: false });

goodsShema.post('save', hendleMongooseError);

const addSchema = Joi.object({
    name: Joi.string().required(),
    title: Joi.string(),
    photo: Joi.string().required(),
    price: Joi.number(),
});

const Goods = model("goods", goodsShema);

module.exports = {
    Goods,
    addSchema,
}