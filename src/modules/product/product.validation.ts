import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewCreatedProduct } from './product.interfaces';

const createProductBody: Record<keyof NewCreatedProduct, any> = {
  _id: Joi.string(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().required(),
  obs: Joi.string().required(),
  price: Joi.number().required(),
  stock: Joi.number().required(),
  hide: Joi.boolean(),
  postOn: Joi.array(),
  dueDate: Joi.date(),
  user: Joi.string()
};

export const createProduct = {
  body: Joi.object().keys(createProductBody),
};

export const getProducts = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

export const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
        _id: Joi.string(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        type: Joi.string().required(),
        obs: Joi.string().required(),
        price: Joi.number().required(),
        stock: Joi.number().required(),
        hide: Joi.bool(),
        postOn: Joi.array(),
        dueDate: Joi.date(),
        user: Joi.string()
    })
    .min(1),
};

export const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};
