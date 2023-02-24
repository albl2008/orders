import mongoose, { Model, Document, ObjectId } from 'mongoose';
import { QueryResult } from '../paginate/paginate';
//import { AccessAndRefreshTokens } from '../token/token.interfaces';


export interface IOrder {
    _id: mongoose.Types.ObjectId,
    client: string;
    description: string;
    total: number;
    products: Array<ObjectId>;
    type: string;
    obs: string;
    date: Date;
    user:ObjectId
  }


export interface IOrderDoc extends IOrder, Document {
  _id: mongoose.Types.ObjectId,
  }


export interface IOrderModel extends Model<IOrderDoc>{
    _id: mongoose.Types.ObjectId,
    paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
  }

export type UpdateOrderBody = Partial<IOrder>;

export type NewCreatedOrder = Partial<IOrder>;