import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { orderController, orderValidation } from '../../modules/order';

const router: Router = express.Router();

router
  .route('/')
  .post(auth('manageOrders'), validate(orderValidation.createOrder), orderController.createOrder)
  .get(auth('getOrders'), validate(orderValidation.getOrders), orderController.getOrders);

router
  .route('/:orderId')
  .get(auth('getOrders'), validate(orderValidation.getOrder), orderController.getOrder)
  .patch(auth('manageOrders'), validate(orderValidation.updateOrder), orderController.updateOrder)
  .delete(auth('manageOrders'), validate(orderValidation.deleteOrder), orderController.deleteOrder);

export default router;