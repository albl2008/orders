import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as productService from './product.service';



export const createProduct = catchAsync(async (req: Request, res: Response) => {
    req.body.user = req.user._id
    const product = await productService.createProduct(req.body);
    console.log(product)
    res.status(httpStatus.CREATED).send(product);
});

export async function checkStock(product: any,quantity: number){
  //console.log(product)
  let productData = await productService.getProductById(new mongoose.Types.ObjectId(product))
  //console.log('data: '+productData)
  if (productData != null){
    if (productData.stock < quantity){
      return false
    }
    return true
  }
  return false
}

export async function substractStock(product: any, quantity: any){
  if (await checkStock(product,quantity)){
    let productData = await productService.getProductById(new mongoose.Types.ObjectId(product))
    if (productData != null){
      productData.stock = productData.stock - quantity
      const updateProduct = await productService.updateProductById(new mongoose.Types.ObjectId(product), productData);
      console.log('Stock actualizado')
      return updateProduct
    }
  }
  console.log(`Product ${product} no cuenta con stock suficiente`)
  return false
}

export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const filter = {user:req.user._id};
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await productService.queryProducts(filter, options);
  res.send(result);
});

export const getProduct = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['productId'] === 'string') {
    const product = await productService.getProductById(new mongoose.Types.ObjectId(req.params['productId']));
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    res.send(product);
  }
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['productId'] === 'string') {
    const product = await productService.updateProductById(new mongoose.Types.ObjectId(req.params['productId']), req.body);
    res.send(product);
  }
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['productId'] === 'string') {
    await productService.deleteProductById(new mongoose.Types.ObjectId(req.params['productId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});


