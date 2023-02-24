import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as orderService from './order.service';
import axios from 'axios';


export const createOrder = catchAsync(async (req: Request, res: Response) => {
    req.body.user = req.user._id
    console.log(req.body)
    const order = await orderService.createOrder(req.body);
    axios({
      method:'POST',
      url: 'http://localhost:3000/v1/orders/',
      headers: {authorization:req.headers.authorization},
      data: {
        _id: order._id,
        client: order.client,
        description:order.description,
        type: order.type,
        obs: order.obs,
        products: order.products,
        date: order.date,
        total: order.total,
        user: order.user
      },
    }).then(res => {
      if (res.status === 200) {
        console.log('Orden Replicada')           
      }
    })
    .catch(e => {
      console.log(e+'Error en replicacion de orden')
    })
    res.status(httpStatus.CREATED).send(order);
});

export const getOrders = catchAsync(async (req: Request, res: Response) => {
  const filter = {user:req.user._id};
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await orderService.queryOrders(filter, options);
  res.send(result);
});

export const getOrder = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['orderId'] === 'string') {
    const order = await orderService.getOrderById(new mongoose.Types.ObjectId(req.params['orderId']));
    if (!order) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    }
    res.send(order);
  }
});

export const updateOrder = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['orderId'] === 'string') {
    const order = await orderService.updateOrderById(new mongoose.Types.ObjectId(req.params['orderId']), req.body);
    axios({
      method:'PATCH',
      url: `http://localhost:3000/v1/orders/${req.params['orderId']}`,
      headers: {authorization:req.headers.authorization},
      data: {
        _id: order._id,
        client: order.client,
        description:order.description,
        type: order.type,
        obs: order.obs,
        products: order.products,
        date: order.date,
        total: order.total,
        user: order.user
      },
    }).then(res => {
      if (res.status === 200) {
        console.log('Orden Actualizada')           
      }
    })
    .catch(e => {
      console.log(e+'Error en actualizacion de orden')
    })
    res.send(order);
  }
});

export const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['orderId'] === 'string') {
    await orderService.deleteOrderById(new mongoose.Types.ObjectId(req.params['orderId']));
    axios({
      method:'DELETE',
      url: `http://localhost:3000/v1/orders/${req.params['orderId']}`,
      headers: {authorization:req.headers.authorization},
    }).then(res => {
      if (res.status === 200) {
        console.log('Orden Eliminada')           
      }
    })
    .catch(e => {
      console.log(e+'Error en eliminacion de orden')
    })
    res.status(httpStatus.NO_CONTENT).send();
  }
});
