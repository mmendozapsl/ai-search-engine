const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
        timestamp: new Date().toISOString()
      });
    }
    next();
  };
};

// User validation schemas
const userRegistrationSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const userUpdateSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30),
  email: Joi.string().email()
});

// Post validation schema (for PostgreSQL)
const postSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  content: Joi.string().max(5000)
});

// Product validation schema (for MySQL)
const productSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(5000),
  price: Joi.number().positive().precision(2).required()
});

module.exports = {
  validate,
  userRegistrationSchema,
  userLoginSchema,
  userUpdateSchema,
  postSchema,
  productSchema
};