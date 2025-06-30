const Joi = require('joi');

exports.validateContactSubmission = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().max(100).required(),
    lastName: Joi.string().max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().max(30).allow('', null),
    message: Joi.string().max(2000).required(),
    captchaToken: Joi.string().required(),
  });
  return schema.validate(data, { abortEarly: false });
}; 