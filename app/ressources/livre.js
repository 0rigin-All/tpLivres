const Joi = require('joi');

const schema = Joi.object({
  numero: Joi.number().required(),
  titre: Joi.string().required(),
  pages: Joi.array().items(Joi.string()).required(),
});

module.exports.schema = schema;
