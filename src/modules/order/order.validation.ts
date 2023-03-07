import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewCreatedOrder } from './order.interfaces';

const createOrderBody: Record<keyof NewCreatedOrder, any> = {
  _id: Joi.string(),
  client: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().required(),
  obs: Joi.string().required(),
  total: Joi.number().required(),
  products: Joi.array(),
  quantity: Joi.array(),
  date: Joi.date(),
  user: Joi.string()
};

export const createOrder = {
  body: Joi.object().keys(createOrderBody),
};

export const getOrders = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

export const updateOrder = {
  params: Joi.object().keys({
    orderId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      _id: Joi.string(),
      client: Joi.string().required(),
      description: Joi.string().required(),
      type: Joi.string().required(),
      obs: Joi.string().required(),
      total: Joi.number().required(),
      products: Joi.array(),
      quantity: Joi.array(),
      date: Joi.date(),
      user: Joi.string()
    })
    .min(1),
};

export const deleteOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};
