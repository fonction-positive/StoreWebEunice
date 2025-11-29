import { defineStore } from 'pinia';
import api from '../api/axios';
import { DEV_MODE } from '../config/devMode';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        accessToken: localStorage.getItem('access_token') || null,
        refreshToken: localStorage.getItem('refresh_token') || null,
    }),
    getters: {
        isAuthenticated: (state) => {
            // 开发模式下始终返回已认证
            if (DEV_MODE.enabled) return true;
            return !!state.accessToken;
        },
        isAdmin: (state) => state.user?.role === 'admin',
    },
    actions: {
        async login(username, password) {
            // 开发模式：跳过真实登录
            if (DEV_MODE.enabled) {
                this.user = DEV_MODE.mockUser;
                this.accessToken = 'mock-token';
                this.refreshToken = 'mock-refresh-token';
                return true;
            }

            try {
                const response = await api.post('auth/login/', { username, password });
                const { access, refresh } = response.data;
                this.accessToken = access;
                this.refreshToken = refresh;
                localStorage.setItem('access_token', access);
                localStorage.setItem('refresh_token', refresh);
                await this.fetchUser();
                return true;
            } catch (error) {
                console.error('Login failed:', error);
                throw error;
            }
        },
        async register(userData) {
            try {
                await api.post('auth/register/', userData);
                return true;
            } catch (error) {
                console.error('Registration failed:', error);
                throw error;
            }
        },
        async fetchUser() {
            // 开发模式：返回 mock 用户
            if (DEV_MODE.enabled) {
                this.user = DEV_MODE.mockUser;
                return;
            }

            try {
                const response = await api.get('auth/me/');
                this.user = response.data;
            } catch (error) {
                console.error('Fetch user failed:', error);
            }
        },
        async updateProfile(userData) {
            // 开发模式：模拟更新
            if (DEV_MODE.enabled) {
                this.user = { ...this.user, ...userData };
                return this.user;
            }

            try {
                const response = await api.patch('auth/me/', userData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                this.user = response.data;
                return response.data;
            } catch (error) {
                console.error('Update profile failed:', error);
                throw error;
            }
        },
        async changePassword(passwordData) {
            // 开发模式：模拟成功
            if (DEV_MODE.enabled) {
                return true;
            }

            try {
                await api.put('auth/password_change/', passwordData);
                return true;
            } catch (error) {
                console.error('Change password failed:', error);
                throw error;
            }
        },
        logout() {
            this.user = null;
            this.accessToken = null;
            this.refreshToken = null;
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        }
    }
});
