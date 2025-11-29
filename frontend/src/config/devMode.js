// 开发模式配置
export const DEV_MODE = {
    // 设置为 true 启用开发模式（使用 mock 数据，跳过登录）
    enabled: true,

    // Mock 用户数据
    mockUser: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=testuser',
    },

    // Mock 订单数据
    mockOrders: [
        {
            id: 1,
            order_no: 'ORD20231129001',
            status: 'completed',
            total_amount: '299.00',
            created_at: '2023-11-25T10:30:00',
            shipping_name: '张三',
            shipping_phone: '13800138000',
            shipping_province: '广东省',
            shipping_city: '深圳市',
            shipping_district: '南山区',
            shipping_address: '科技园南区某某大厦',
            tracking_no: 'SF1234567890',
            items: [
                {
                    id: 1,
                    product_name: '无线蓝牙耳机',
                    price: '299.00',
                    quantity: 1,
                    subtotal: '299.00',
                    product_image: 'https://picsum.photos/200/200?random=1'
                }
            ]
        },
        {
            id: 2,
            order_no: 'ORD20231128002',
            status: 'shipped',
            total_amount: '1299.00',
            created_at: '2023-11-28T14:20:00',
            shipping_name: '张三',
            shipping_phone: '13800138000',
            shipping_province: '广东省',
            shipping_city: '深圳市',
            shipping_district: '南山区',
            shipping_address: '科技园南区某某大厦',
            tracking_no: 'SF0987654321',
            items: [
                {
                    id: 2,
                    product_name: '智能手表',
                    price: '1299.00',
                    quantity: 1,
                    subtotal: '1299.00',
                    product_image: 'https://picsum.photos/200/200?random=2'
                }
            ]
        },
        {
            id: 3,
            order_no: 'ORD20231127003',
            status: 'pending',
            total_amount: '599.00',
            created_at: '2023-11-27T16:45:00',
            shipping_name: '张三',
            shipping_phone: '13800138000',
            shipping_province: '广东省',
            shipping_city: '深圳市',
            shipping_district: '南山区',
            shipping_address: '科技园南区某某大厦',
            items: [
                {
                    id: 3,
                    product_name: '机械键盘',
                    price: '599.00',
                    quantity: 1,
                    subtotal: '599.00',
                    product_image: 'https://picsum.photos/200/200?random=3'
                }
            ]
        }
    ],

    // Mock 购物车数据
    mockCartItems: [
        {
            id: 1,
            product: 1,
            quantity: 2,
            subtotal: '598.00',
            selected: true,
            product_detail: {
                id: 1,
                name: '无线蓝牙耳机 Pro',
                price: '299.00',
                stock: 50,
                category_name: '数码配件',
                main_image: {
                    image: 'https://picsum.photos/200/200?random=4'
                }
            }
        },
        {
            id: 2,
            product: 2,
            quantity: 1,
            subtotal: '1299.00',
            selected: true,
            product_detail: {
                id: 2,
                name: '智能手表 Ultra',
                price: '1299.00',
                stock: 30,
                category_name: '智能穿戴',
                main_image: {
                    image: 'https://picsum.photos/200/200?random=5'
                }
            }
        }
    ],

    // Mock 地址数据
    mockAddresses: [
        {
            id: 1,
            recipient_name: '张三',
            phone: '13800138000',
            province: '广东省',
            city: '深圳市',
            district: '南山区',
            address: '科技园南区某某大厦 1001室',
            is_default: true
        },
        {
            id: 2,
            recipient_name: '李四',
            phone: '13900139000',
            province: '北京市',
            city: '北京市',
            district: '朝阳区',
            address: '建国路某某小区 2号楼 302室',
            is_default: false
        }
    ]
};
