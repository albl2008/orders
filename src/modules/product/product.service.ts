import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Product from './product.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewCreatedProduct, UpdateProductBody } from './product.interfaces';

/**
 * Create a product
 * @param {NewCreatedProduct} productBody
 * @returns {}
 */
export const createProduct = async (productBody: NewCreatedProduct) => {
  return Product.create(productBody);
};


/**
 * Query for product
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryProducts = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
    const products = await Product.paginate(filter, options);
    return products;
  };


  /**
 * Get product by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {}
 */
export const getProductById = async (id: mongoose.Types.ObjectId) => Product.findById(id);


/**
 * Update product by id
 * @param {mongoose.Types.ObjectId} productId
 * @param {UpdateProductBody} updateBody
 * @returns {}
 */
export const updateProductById = async (
    productId: mongoose.Types.ObjectId,
    updateBody: UpdateProductBody
  ) => {
    console.log(productId)
    const product = await getProductById(productId);
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    
    Object.assign(product, updateBody);
    await product.save();
    return product;
  };


  /**
 * Delete product by id
 * @param {mongoose.Types.ObjectId} productId
 * @returns {}
 */
export const deleteProductById = async (productId: mongoose.Types.ObjectId) => {
    const product = await getProductById(productId);
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    await product.remove();
    return product;
  };
