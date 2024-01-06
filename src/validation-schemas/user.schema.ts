import * as Joi from "@hapi/joi";

export const userSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  avatarUrl: Joi.string().uri(),
});
