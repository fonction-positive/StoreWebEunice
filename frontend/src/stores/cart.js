import { defineStore } from 'pinia';
import api from '../api/axios';
import { DEV_MODE } from '../config/devMode';

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [],
        totalCount: 0,
        totalPrice: 0,
        loading: false,
    }),
    actions: {
        async fetchCart() {
            this.loading = true;
            try {
                // 开发模式：返回 mock 购物车数据
                if (DEV_MODE.enabled) {
                    this.items = DEV_MODE.mockCartItems;
                    this.totalCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
                    this.totalPrice = this.items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
                    this.loading = false;
                    return;
                }

                const response = await api.get('cart/');
                this.items = response.data.items || [];
                this.totalCount = response.data.total_count || 0;
                this.totalPrice = response.data.total_price || 0;
            } catch (error) {
                console.error('Fetch cart failed:', error);
            } finally {
                this.loading = false;
            }
        },
        async addToCart(productId, quantity = 1) {
            // 开发模式：模拟添加
            if (DEV_MODE.enabled) {
                console.log('Dev mode: Added to cart', productId, quantity);
                return true;
            }

            try {
                await api.post('cart/add_item/', {
                    product_id: productId,
                    quantity: quantity
                });
                await this.fetchCart();
                return true;
            } catch (error) {
                console.error('Add to cart failed:', error);
                throw error;
            }
        },
        async updateQuantity(itemId, quantity) {
            // 开发模式：模拟更新
            if (DEV_MODE.enabled) {
                const item = this.items.find(i => i.id === itemId);
                if (item) {
                    item.quantity = quantity;
                    item.subtotal = (parseFloat(item.product_detail.price) * quantity).toFixed(2);
                }
                return;
            }

            try {
                await api.put(`cart/update_item/${itemId}/`, { quantity });
                await this.fetchCart();
            } catch (error) {
                console.error('Update quantity failed:', error);
                throw error;
            }
        },
        async removeItem(itemId) {
            // 开发模式：模拟删除
            if (DEV_MODE.enabled) {
                this.items = this.items.filter(i => i.id !== itemId);
                return;
            }

            try {
                await api.delete(`cart/remove_item/${itemId}/`);
                await this.fetchCart();
            } catch (error) {
                console.error('Remove item failed:', error);
                throw error;
            }
        },
        async clearCart() {
            // 开发模式：模拟清空
            if (DEV_MODE.enabled) {
                this.items = [];
                return;
            }

            try {
                await api.post('cart/clear/');
                await this.fetchCart();
            } catch (error) {
                console.error('Clear cart failed:', error);
            }
        }
    }
});

export const useOrderStore = defineStore('order', {
    state: () => ({
        orders: [],
        currentOrder: null,
        loading: false,
    }),
    actions: {
        async fetchOrders(status = null) {
            this.loading = true;
            try {
                // 开发模式：返回 mock 订单数据
                if (DEV_MODE.enabled) {
                    this.orders = status
                        ? DEV_MODE.mockOrders.filter(o => o.status === status)
                        : DEV_MODE.mockOrders;
                    this.loading = false;
                    return;
                }

                const params = status ? { status } : {};
                const response = await api.get('orders/', { params });
                this.orders = response.data;
            } catch (error) {
                console.error('Fetch orders failed:', error);
            } finally {
                this.loading = false;
            }
        },
        async fetchOrder(id) {
            this.loading = true;
            try {
                // 开发模式：返回 mock 订单详情
                if (DEV_MODE.enabled) {
                    this.currentOrder = DEV_MODE.mockOrders.find(o => o.id === parseInt(id));
                    this.loading = false;
                    return;
                }

                const response = await api.get(`orders/${id}/`);
                this.currentOrder = response.data;
            } catch (error) {
                console.error('Fetch order failed:', error);
            } finally {
                this.loading = false;
            }
        },
        async createOrder(addressId, items) {
            // 开发模式：模拟创建订单
            if (DEV_MODE.enabled) {
                return { data: { id: 999 } };
            }

            return api.post('orders/', {
                address_id: addressId,
                items: items
            });
        },
        async payOrder(orderId) {
            // 开发模式：模拟支付
            if (DEV_MODE.enabled) {
                const order = DEV_MODE.mockOrders.find(o => o.id === orderId);
                if (order) order.status = 'paid';
                return { data: { success: true } };
            }

            return api.post(`orders/${orderId}/pay/`);
        },
        async cancelOrder(orderId) {
            // 开发模式：模拟取消
            if (DEV_MODE.enabled) {
                const order = DEV_MODE.mockOrders.find(o => o.id === orderId);
                if (order) order.status = 'cancelled';
                return { data: { success: true } };
            }

            return api.post(`orders/${orderId}/cancel/`);
        },
        async confirmOrder(orderId) {
            // 开发模式：模拟确认收货
            if (DEV_MODE.enabled) {
                const order = DEV_MODE.mockOrders.find(o => o.id === orderId);
                if (order) order.status = 'completed';
                return { data: { success: true } };
            }

            return api.post(`orders/${orderId}/confirm/`);
        }
    }
});

export const useAddressStore = defineStore('address', {
    state: () => ({
        addresses: [],
        loading: false,
    }),
    getters: {
        defaultAddress: (state) => state.addresses.find(addr => addr.is_default),
    },
    actions: {
        async fetchAddresses() {
            this.loading = true;
            try {
                // 开发模式：返回 mock 地址数据
                if (DEV_MODE.enabled) {
                    this.addresses = DEV_MODE.mockAddresses;
                    this.loading = false;
                    return;
                }

                const response = await api.get('addresses/');
                this.addresses = response.data;
            } catch (error) {
                console.error('Fetch addresses failed:', error);
            } finally {
                this.loading = false;
            }
        },
        async createAddress(data) {
            // 开发模式：模拟创建
            if (DEV_MODE.enabled) {
                const newAddress = { ...data, id: Date.now() };
                this.addresses.push(newAddress);
                return { data: newAddress };
            }

            return api.post('addresses/', data);
        },
        async updateAddress(id, data) {
            // 开发模式：模拟更新
            if (DEV_MODE.enabled) {
                const index = this.addresses.findIndex(a => a.id === id);
                if (index !== -1) {
                    this.addresses[index] = { ...this.addresses[index], ...data };
                }
                return { data: this.addresses[index] };
            }

            return api.put(`addresses/${id}/`, data);
        },
        async deleteAddress(id) {
            // 开发模式：模拟删除
            if (DEV_MODE.enabled) {
                this.addresses = this.addresses.filter(a => a.id !== id);
                return { data: { success: true } };
            }

            return api.delete(`addresses/${id}/`);
        }
    }
});
