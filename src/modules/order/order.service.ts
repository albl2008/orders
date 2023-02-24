import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Order from './order.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewCreatedOrder, UpdateOrderBody } from './order.interfaces';

/**
 * Create a order
 * @param {NewCreatedOrder} orderBody
 * @returns {}
 */
export const createOrder = async (orderBody: NewCreatedOrder) => {
  return Order.create(orderBody);
};


/**
 * Query for order
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryOrders = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
    const orders = await Order.paginate(filter, options);
    return orders;
  };

  /**
 * Get order by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {}
 */
export const getOrderById = async (id: mongoose.Types.ObjectId) => Order.findById(id);


/**
 * Update order by id
 * @param {mongoose.Types.ObjectId} orderId
 * @param {UpdateOrderBody} updateBody
 * @returns {}
 */
export const updateOrderById = async (
    orderId: mongoose.Types.ObjectId,
    updateBody: UpdateOrderBody
  ) => {
    console.log(orderId)
    const order = await getOrderById(orderId);
    if (!order) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    }
    
    Object.assign(order, updateBody);
    await order.save();
    return order;
  };


  /**
 * Delete order by id
 * @param {mongoose.Types.ObjectId} orderId
 * @returns {}
 */
export const deleteOrderById = async (orderId: mongoose.Types.ObjectId) => {
    const order = await getOrderById(orderId);
    if (!order) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    }
    await order.remove();
    return order;
  };
