// Mock 商品数据
export const mockProducts = [
    {
        id: 1,
        name: "经典白色T恤",
        price: 99,
        main_image: {
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop"
        },
        images: [
            { id: 1, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1200&fit=crop" },
            { id: 2, image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&h=1200&fit=crop" },
            { id: 3, image: "https://images.unsplash.com/photo-1622445275576-721325f6c8bc?w=800&h=1200&fit=crop" }
        ],
        category_name: "男装",
        stock: 100,
        description: "简约舒适的经典白色T恤，采用100%纯棉材质，透气舒适，四季皆宜。精选优质面料，手感柔软细腻，版型修身但不紧身，展现完美身材线条。"
    },
    {
        id: 2,
        name: "牛仔夹克",
        price: 299,
        main_image: {
            image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=600&fit=crop"
        },
        images: [
            { id: 4, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1200&fit=crop" },
            { id: 5, image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&h=1200&fit=crop" },
            { id: 6, image: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=800&h=1200&fit=crop" }
        ],
        category_name: "男装",
        stock: 50,
        description: "经典蓝色牛仔夹克，百搭时尚单品。采用优质牛仔布料，耐磨耐洗，越洗越有味道。复古水洗工艺，呈现自然做旧效果。"
    },
    {
        id: 3,
        name: "黑色连衣裙",
        price: 399,
        main_image: {
            image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop"
        },
        images: [
            { id: 7, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=1200&fit=crop" },
            { id: 8, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&h=1200&fit=crop" },
            { id: 9, image: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=800&h=1200&fit=crop" }
        ],
        category_name: "女装",
        stock: 40,
        description: "优雅的黑色连衣裙，适合多种场合。精致剪裁，凸显女性优雅气质。采用高档面料，垂感好，不易起皱。"
    },
    {
        id: 4,
        name: "羊毛针织衫",
        price: 259,
        main_image: {
            image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=600&fit=crop"
        },
        images: [
            { id: 10, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1200&fit=crop" },
            { id: 11, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1200&fit=crop" },
            { id: 12, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1200&fit=crop" }
        ],
        category_name: "女装",
        stock: 60,
        description: "柔软舒适的羊毛针织衫，温暖过冬。采用100%美丽诺羊毛，天然保暖，亲肤柔软。精细编织工艺，质感细腻。"
    },
    {
        id: 5,
        name: "运动鞋",
        price: 599,
        main_image: {
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=600&fit=crop"
        },
        images: [
            { id: 13, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1200&fit=crop" },
            { id: 14, image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=1200&fit=crop" },
            { id: 15, image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&h=1200&fit=crop" }
        ],
        category_name: "鞋类",
        stock: 80,
        description: "舒适透气的运动鞋，适合日常运动。采用透气网面材质，保持双脚干爽。缓震中底设计，减轻运动压力。"
    },
    {
        id: 6,
        name: "皮革手提包",
        price: 899,
        main_image: {
            image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=600&fit=crop"
        },
        images: [
            { id: 16, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=1200&fit=crop" },
            { id: 17, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=1200&fit=crop" },
            { id: 18, image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&h=1200&fit=crop" }
        ],
        category_name: "配饰",
        stock: 30,
        description: "高品质真皮手提包，大容量实用设计。采用头层牛皮，触感细腻，历久弥新。多隔层设计，合理分区。"
    },
    {
        id: 7,
        name: "格子衬衫",
        price: 189,
        main_image: {
            image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=600&fit=crop"
        },
        images: [
            { id: 19, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1200&fit=crop" },
            { id: 20, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=1200&fit=crop" },
            { id: 21, image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&h=1200&fit=crop" }
        ],
        category_name: "男装",
        stock: 70,
        description: "经典格子衬衫，休闲商务两相宜。精选优质棉质面料，透气吸汗。修身剪裁，展现优雅风范。"
    },
    {
        id: 8,
        name: "短裤",
        price: 149,
        main_image: {
            image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=600&fit=crop"
        },
        images: [
            { id: 22, image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&h=1200&fit=crop" },
            { id: 23, image: "https://images.unsplash.com/photo-1613753982875-ff09c56d1c60?w=800&h=1200&fit=crop" },
            { id: 24, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&h=1200&fit=crop" }
        ],
        category_name: "男装",
        stock: 90,
        description: "夏季清爽短裤，透气舒适。轻薄速干面料，运动休闲皆宜。松紧腰设计，穿着自如。"
    }
];

// 根据ID获取商品详情
export const getProductById = (id) => {
    return mockProducts.find(product => product.id === parseInt(id));
};
