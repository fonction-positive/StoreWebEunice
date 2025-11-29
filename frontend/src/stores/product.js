import { defineStore } from 'pinia';
import api from '../api/axios';
import { DEV_MODE } from '../config/devMode';
import { mockProducts } from '../mock/products';

export const useProductStore = defineStore('product', {
    state: () => ({
        products: [],
        categories: [],
        currentProduct: null,
        loading: false,
    }),
    actions: {
        async fetchCategories() {
            try {
                const response = await api.get('categories/');
                this.categories = response.data;
            } catch (error) {
                console.error('Fetch categories failed:', error);
            }
        },
        async fetchProducts(params = {}) {
            this.loading = true;
            
            // 如果开发模式启用，直接使用 mock 数据
            if (DEV_MODE.enabled) {
                console.log('开发模式：使用 mock 商品数据');
                this.products = mockProducts;
                this.loading = false;
                return;
            }
            
            try {
                const response = await api.get('products/', { params });
                this.products = response.data;
            } catch (error) {
                console.error('Fetch products failed:', error);
            } finally {
                this.loading = false;
            }
        },
        async fetchProduct(id) {
            this.loading = true;
            
            // 如果开发模式启用，直接使用 mock 数据
            if (DEV_MODE.enabled) {
                console.log('开发模式：使用 mock 商品详情数据，ID:', id);
                const product = mockProducts.find(p => p.id === parseInt(id));
                console.log('找到的商品:', product);
                this.currentProduct = product || null;
                this.loading = false;
                return;
            }
            
            try {
                const response = await api.get(`products/${id}/`);
                this.currentProduct = response.data;
            } catch (error) {
                console.error('Fetch product failed:', error);
            } finally {
                this.loading = false;
            }
        },
        // Admin actions
        async fetchAllProducts() {
            this.loading = true;
            try {
                const response = await api.get('admin/products/');
                this.products = response.data;
            } catch (error) {
                console.error('Fetch all products failed:', error);
            } finally {
                this.loading = false;
            }
        },
        async createProduct(data) {
            return api.post('admin/products/', data);
        },
        async updateProduct(id, data) {
            return api.put(`admin/products/${id}/`, data);
        },
        async deleteProduct(id) {
            return api.delete(`admin/products/${id}/`);
        }
    }
});
