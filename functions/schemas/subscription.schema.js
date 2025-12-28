const Joi = require('joi');

const create = Joi.object({
    tutorId: Joi.string().required(),
});

module.exports = {
    create
};
