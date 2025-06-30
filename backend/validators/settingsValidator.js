const Joi = require('joi');

exports.validateNotificationEmails = (data) => {
  const schema = Joi.object({
    emails: Joi.array().items(Joi.string().email()).min(1).required(),
  });
  return schema.validate(data, { abortEarly: false });
}; 