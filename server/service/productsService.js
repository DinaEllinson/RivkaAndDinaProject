
import { executeQuery } from './db.js';
import { getProductsJoinTable, getQuery, getByIdQuery, addQuery, deleteQuery, updateQuery, getProductByIdQuery } from './queries.js';

export class ProductsService {

    async getProducts(url) {
        const { ownerId,category, priceMin, priceMax, area, status, sortBy, direction, limit, offset } = url;
        const params = [
            { field: 'ownerId', comparison: undefined, value: ownerId },
            { field: 'category', comparison: undefined, value: category },
            { field: 'price', comparison: '>=', value: priceMin },
            { field: 'price', comparison: '<=', value: priceMax },
            { field: 'area', comparison: undefined, value: area },
            { field: 'status', comparison: undefined, value: status }
        ]
        const orderBy = { 'column': sortBy, 'direction': direction };
        let queryProducts = getQuery(getProductsJoinTable(), params, orderBy, limit, offset);
        const result = await executeQuery(queryProducts.sql, queryProducts.queryParams);
        return result;
    }

    async getProduct(id) {
        const query = getProductByIdQuery(getProductsJoinTable(), "users");
        const result = await executeQuery(query, [id]);
        return result;
    }

    async addProduct(productItem, imgSrc) {
        const queryProduct = addQuery("products", [...Object.keys(productItem), 'img', 'adDate']);
        const nowDate = new Date();
        const date = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate();
        const result = await executeQuery(queryProduct, [...Object.values(productItem), imgSrc, date]);
        return result;
    }



    async deleteProduct(id) {

        const queryProduct = deleteQuery("products");
        const result = await executeQuery(queryProduct, [id])
        return result;
    }
    async updateProduct(productItem, imgSrc, productId) {
        const nowDate = new Date();
        const date = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate();
        const updatedProduct = imgSrc ? { ...productItem, 'img': imgSrc, 'adDate': date } : { ...productItem, 'adDate': date }
        const queryProduct = updateQuery("products", updatedProduct);
        const result = await executeQuery(queryProduct, [...Object.values(updatedProduct), productId]);
        return result;
    }
}

