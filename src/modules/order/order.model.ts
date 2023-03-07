import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import pkg from 'mongoose';
const { Schema } = pkg;
import paginate from '../paginate/paginate';
//import { roles } from '../../config/roles';
import { IOrderModel, IOrderDoc } from './order.interfaces';

const orderSchema = new mongoose.Schema<IOrderDoc,IOrderModel>(
  {
    client: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
      },
      obs: {
        type: String,
        required: true,
        trim: true,
      },
      type: {
        type: String,
        required: true,
        trim: true,
      },
      total: {
        type: Number,
        required: true,
        trim: true,
      },
     
      products: {
        type: [Schema.Types.ObjectId],
        ref: 'Product',
        trim: true
      },
      quantity: {
        type: [Number],
        required: true
      },
      
      date: {
        type: Date,
        required: true,
        trim: true,
      },
      user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);


const Order = mongoose.model<IOrderDoc,IOrderModel>('Order', orderSchema);

export default Order;