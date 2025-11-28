import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/user';
import Login from '../views/auth/Login.vue';
import Register from '../views/auth/Register.vue';
import VerifyEmail from '../views/auth/VerifyEmail.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
    },
    {
        path: '/products',
        name: 'ProductList',
        component: () => import('../views/product/ProductList.vue'),
    },
    {
        path: '/product/:id',
        name: 'ProductDetail',
        component: () => import('../views/product/ProductDetail.vue'),
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
    },
    {
        path: '/verify-email',
        name: 'VerifyEmail',
        component: VerifyEmail,
    },
    {
        path: '/cart',
        name: 'Cart',
        component: () => import('../views/cart/Cart.vue'),
    },
    {
        path: '/checkout',
        name: 'Checkout',
        component: () => import('../views/cart/Checkout.vue'),
    },
    {
        path: '/user/orders',
        name: 'OrderList',
        component: () => import('../views/order/OrderList.vue'),
    },
    {
        path: '/user/orders/:id',
        name: 'OrderDetail',
        component: () => import('../views/order/OrderDetail.vue'),
    },
    {
        path: '/user/profile',
        name: 'UserProfile',
        component: () => import('../views/user/UserProfile.vue'),
    },
    {
        path: '/manage/dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/admin/AdminDashboard.vue'),
    },
    {
        path: '/manage/products',
        name: 'AdminProductList',
        component: () => import('../views/admin/AdminProductList.vue'),
    },
    {
        path: '/manage/products/:id',
        name: 'AdminProductEdit',
        component: () => import('../views/admin/AdminProductEdit.vue'),
    },
    {
        path: '/manage/orders',
        name: 'AdminOrderList',
        component: () => import('../views/admin/AdminOrderList.vue'),
    },
    {
        path: '/manage/users',
        name: 'AdminUsers',
        component: () => import('../views/admin/AdminUsers.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();
    // Simple check, can be expanded
    next();
});

export default router;
