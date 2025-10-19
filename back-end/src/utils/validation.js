import Joi from 'joi';

export const registerValidation = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum': 'Username must only contain alphanumeric characters',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot be longer than 30 characters',
      'any.required': 'Username is required'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    })
});

export const loginValidation = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .required()
});

export const messageValidation = Joi.object({
  content: Joi.string()
    .max(1000)
    .required(),
  roomId: Joi.string()
    .required(),
  type: Joi.string()
    .valid('text', 'image', 'file', 'system')
    .default('text'),
  replyTo: Joi.string()
    .optional()
});

export const roomValidation = Joi.object({
  name: Joi.string()
    .max(50)
    .required(),
  description: Joi.string()
    .max(200)
    .optional(),
  type: Joi.string()
    .valid('public', 'private')
    .required(),
  members: Joi.array()
    .items(Joi.string())
    .optional()
});

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    
    next();
  };
};
