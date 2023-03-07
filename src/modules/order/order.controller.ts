import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as orderService from './order.service';
import * as amqp from 'amqplib'
import { substractStock } from '../product/product.controller';

var channel: amqp.Channel, connection;
var queue = 'order'




async function connect() {
  const amqpServer = "amqp://localhost:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("order");
}
connect();

export const createOrder = catchAsync(async (req: Request, res: Response) => {
    req.body.user = req.user._id
    console.log(req.body)
    const order = await orderService.createOrder(req.body);
    const products = order.products
    const quantity = order.quantity
    

    for (let i=0; i<products.length;i++){
      if (await substractStock(order.products[i],quantity[i]) == false){
        console.log('Ocurrio un error al actualizar el stock')
        console.log('Producto: ' + products[i],'Cantidad: ' + quantity[i])
        return
      }
    }
    const sent = await channel.sendToQueue(
      "order",
      Buffer.from(
        JSON.stringify({
          products,
          quantity
        })
      )
    );
    sent
              ? console.log(`Sent message to "${queue}" queue`, req.body)
              : console.log(`Fails sending message to "${queue}" queue`, req.body)


    

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
    res.send(order);
  }
});

export const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['orderId'] === 'string') {
    await orderService.deleteOrderById(new mongoose.Types.ObjectId(req.params['orderId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});
