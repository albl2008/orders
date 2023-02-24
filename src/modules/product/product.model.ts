import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import pkg from 'mongoose';
const { Schema } = pkg;
import paginate from '../paginate/paginate';
//import { roles } from '../../config/roles';
import { IProductModel, IProductDoc } from './product.interfaces';

const productSchema = new mongoose.Schema<IProductDoc,IProductModel>(
  {
    name: {
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
      stock: {
        type: Number,
        required: true,
        trim: true,
      },
      hide: {
        type: Boolean,
        trim: true,
      },
      price: {
        type: Number,
        required: true,
        trim: true,
      },
      postOn: {
        type: [String],
        required: true,
        trim: true,
      },
      dueDate: {
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
productSchema.plugin(toJSON);
productSchema.plugin(paginate);


const Product = mongoose.model<IProductDoc,IProductModel>('Product', productSchema);

export default Product;