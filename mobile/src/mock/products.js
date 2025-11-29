// 模拟商品数据
export const mockProducts = [
    {
        id: 1,
        name: "Black Crop Top",
        price: 45,
        main_image: {
            image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=600&fit=crop"
        },
        images: [
            { image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&h=1200&fit=crop" },
            { image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=1200&fit=crop" },
            { image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&h=1200&fit=crop" }
        ],
        category: "women",
        description: "Stylish black crop top made from premium cotton blend. Perfect for casual outings or layering. Features a comfortable fit and modern design.",
        stock: 50,
        rating: 4.5,
        colors: ["Black", "White", "Grey"],
        sizes: ["XS", "S", "M", "L", "XL"],
        material: "95% Cotton, 5% Elastane",
        care_instructions: "Machine wash cold, tumble dry low"
    },
    {
        id: 2,
        name: "Luxe Sweater",
        price: 85,
        main_image: {
            image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=600&fit=crop"
        },
        images: [
            { image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1200&fit=crop" },
            { image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1200&fit=crop" },
            { image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1200&fit=crop" }
        ],
        category: "women",
        description: "Cozy and luxurious sweater crafted from soft merino wool. Ideal for cooler weather with a timeless design that never goes out of style.",
        stock: 30,
        rating: 4.8,
        colors: ["Grey", "Beige", "Navy"],
        sizes: ["S", "M", "L", "XL"],
        material: "100% Merino Wool",
        care_instructions: "Hand wash only, lay flat to dry"
    },
    {
        id: 3,
        name: "Classic Blazer",
        price: 120,
        main_image: {
            image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=600&fit=crop"
        },
        images: [
            { image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=1200&fit=crop" },
            { image: "https://images.unsplash.com/photo-1592878849819-4e218292d2c7?w=800&h=1200&fit=crop" },
            { image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1200&fit=crop" }
        ],
        category: "women",
        description: "Sophisticated blazer with a tailored fit. Perfect for office wear or formal occasions. Features notch lapels and button closure.",
        stock: 25,
        rating: 4.6,
        colors: ["Black", "Navy", "Charcoal"],
        sizes: ["XS", "S", "M", "L", "XL"],
        material: "70% Wool, 30% Polyester",
        care_instructions: "Dry clean only"
    },
    {
        id: 4,
        name: "Elegant Dress",
        price: 95,
        main_image: {
            image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop"
        },
        images: [
            { image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=1200&fit=crop" },
            { image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&h=1200&fit=crop" },
            { image: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=800&h=1200&fit=crop" }
        ],
        category: "women",
        description: "Flowing elegant dress with a flattering silhouette. Perfect for evening events or special occasions. Features a fitted bodice and flowing skirt.",
        stock: 40,
        rating: 4.7,
        colors: ["Black", "Red", "Emerald"],
        sizes: ["XS", "S", "M", "L", "XL"],
        material: "100% Silk",
        care_instructions: "Dry clean recommended"
    },
    {
        id: 5,
        name: "Casual T-Shirt",
        price: 35,
        main_image: {
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop"
        },
        images: [
            { image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1200&fit=crop" },
            { image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&h=1200&fit=crop" },
            { image: "https://images.unsplash.com/photo-1622445275576-721325f6c8bc?w=800&h=1200&fit=crop" }
        ],
        category: "man",
        description: "Comfortable everyday t-shirt made from breathable cotton. Classic crew neck design with a relaxed fit. Essential wardrobe staple.",
        stock: 100,
        rating: 4.4,
        colors: ["White", "Black", "Grey", "Navy"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        material: "100% Cotton",
        care_instructions: "Machine wash cold, tumble dry medium"
    },
    {
        id: 6,
        name: "Denim Jacket",
        price: 75,
        main_image: {
            image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=600&fit=crop"
        },
        images: [
            { image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1200&fit=crop" },
            { image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&h=1200&fit=crop" },
            { image: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=800&h=1200&fit=crop" }
        ],
        category: "man",
        description: "Classic denim jacket with a vintage wash. Versatile layering piece with button closure and chest pockets. Timeless style.",
        stock: 45,
        rating: 4.5,
        colors: ["Blue", "Black", "Light Blue"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        material: "100% Denim",
        care_instructions: "Machine wash cold, hang dry"
    },
    {
        id: 7,
        name: "Kids Hoodie",
        price: 40,
        main_image: {
            image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop"
        },
        images: [
            { image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1200&fit=crop" },
            { image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&h=1200&fit=crop" },
            { image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&h=1200&fit=crop" }
        ],
        category: "kid",
        description: "Soft and warm hoodie for kids. Features a cozy fleece lining and kangaroo pocket. Perfect for outdoor play and casual wear.",
        stock: 60,
        rating: 4.6,
        colors: ["Red", "Blue", "Green", "Pink"],
        sizes: ["2T", "3T", "4T", "5T", "6", "8", "10"],
        material: "80% Cotton, 20% Polyester",
        care_instructions: "Machine wash cold, tumble dry low"
    },
    {
        id: 8,
        name: "Summer Shorts",
        price: 28,
        main_image: {
            image: "https://images.unsplash.com/photo-1506629905607-0c0c0e0b5b5a?w=400&h=600&fit=crop"
        },
        images: [
            { image: "https://images.unsplash.com/photo-1506629905607-0c0c0e0b5b5a?w=800&h=1200&fit=crop" },
            { image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&h=1200&fit=crop" },
            { image: "https://images.unsplash.com/photo-1613753982875-ff09c56d1c60?w=800&h=1200&fit=crop" }
        ],
        category: "kid",
        description: "Lightweight and breathable shorts perfect for summer. Features an elastic waistband for comfort and side pockets.",
        stock: 80,
        rating: 4.3,
        colors: ["Khaki", "Navy", "Grey", "Coral"],
        sizes: ["2T", "3T", "4T", "5T", "6", "8", "10", "12"],
        material: "100% Cotton",
        care_instructions: "Machine wash cold, tumble dry low"
    },
    {
        id: 9,
        name: "Leather Boots",
        price: 145,
        main_image: {
            image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&h=600&fit=crop"
        },
        images: [
            { image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&h=1200&fit=crop" },
            { image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1200&fit=crop" },
            { image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=1200&fit=crop" }
        ],
        category: "women",
        description: "Premium leather ankle boots with a comfortable heel. Versatile design suitable for both casual and formal occasions.",
        stock: 35,
        rating: 4.9,
        colors: ["Black", "Brown", "Tan"],
        sizes: ["36", "37", "38", "39", "40", "41"],
        material: "100% Genuine Leather",
        care_instructions: "Wipe clean with damp cloth, use leather conditioner"
    },
    {
        id: 10,
        name: "Formal Shirt",
        price: 65,
        main_image: {
            image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=600&fit=crop"
        },
        images: [
            { image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1200&fit=crop" },
            { image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=1200&fit=crop" },
            { image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&h=1200&fit=crop" }
        ],
        category: "man",
        description: "Crisp formal shirt with a tailored fit. Made from premium cotton fabric. Perfect for office wear and formal events.",
        stock: 55,
        rating: 4.7,
        colors: ["White", "Light Blue", "Pink", "Black"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        material: "100% Egyptian Cotton",
        care_instructions: "Machine wash cold, iron on medium heat"
    }
];

// 根据ID获取单个商品详情
export const getProductById = (id) => {
    return mockProducts.find(product => product.id === parseInt(id));
};

