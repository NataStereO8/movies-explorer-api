const mongoose = require('mongoose');
const validatorLib = require('validator');

const movieSchema = new mongoose.Schema({
    country: {
        type: String,
        required: true,
    },
    director: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
        validate: {
            validator(value) {
                return validatorLib.isURL(value, { require_protocol: true })
            },
        },
    },
    trailer: {
        type: String,
        required: true,
        validate: {
            validator(value) {
                return validatorLib.isURL(value, { require_protocol: true })
            },
        },
    },
    thumbnail: {
        type: String,
        required: true,
        validate: {
            validator(value) {
                return validatorLib.isURL(value, { require_protocol: true })
            },
        },
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    movieId: {
        type: Number,
        required: true,
    },
    nameRU: {
        type: String,
        required: true,
    },
    nameEN: {
        type: String,
        required: true,
    }, 
});

module.exports = mongoose.model('movie', movieSchema);