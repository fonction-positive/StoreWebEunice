# StoreWeb 数据库设计文档

**数据库类型**: PostgreSQL  
**最后更新**: 2025年11月29日

---

## 1. 用户模块 (users)

### 1.1 User (用户表)
**表名**: `users_user`  
**说明**: 继承自 Django AbstractUser，存储用户基本信息

| 字段名 | 类型 | 长度 | 约束 | 默认值 | 说明 |
|-------|------|------|------|--------|------|
| id | Integer | - | PK, Auto | - | 主键 |
| username | CharField | 150 | Unique, Not Null | - | 用户名 |
| email | EmailField | 254 | Not Null | - | 邮箱 |
| password | CharField | 128 | Not Null | - | 密码（加密） |
| first_name | CharField | 150 | Null | - | 名 |
| last_name | CharField | 150 | Null | - | 姓 |
| role | CharField | 10 | Not Null | 'user' | 角色：user/admin |
| avatar | ImageField | - | Null | - | 头像（路径：users/{id}/avatar/） |
| is_active | Boolean | - | Not Null | True | 是否激活 |
| is_staff | Boolean | - | Not Null | False | 是否员工 |
| is_superuser | Boolean | - | Not Null | False | 是否超级用户 |
| date_joined | DateTime | - | Not Null | now() | 注册时间 |
| last_login | DateTime | - | Null | - | 最后登录时间 |

**索引**:
- username (Unique)
- email (Unique)

---

## 2. 商品模块 (products)

### 2.1 Category (商品分类表)
**表名**: `products_category`  
**说明**: 商品分类信息

| 字段名 | 类型 | 长度 | 约束 | 默认值 | 说明 |
|-------|------|------|------|--------|------|
| id | Integer | - | PK, Auto | - | 主键 |
| name | CharField | 50 | Not Null | - | 分类名称 |
| slug | SlugField | 50 | Unique, Not Null | - | URL友好标识 |
| icon | ImageField | - | Null | - | 分类图标（路径：categories/） |

**索引**:
- slug (Unique)

---

### 2.2 Product (商品表)
**表名**: `products_product`  
**说明**: 商品详细信息

| 字段名 | 类型 | 长度 | 约束 | 默认值 | 说明 |
|-------|------|------|------|--------|------|
| id | Integer | - | PK, Auto | - | 主键 |
| category_id | Integer | - | FK, Not Null | - | 分类ID（外键→Category） |
| name | CharField | 100 | Not Null | - | 商品名称 |
| description | TextField | - | Null | - | 商品描述 |
| **价格相关** |
| price | Decimal | 10,2 | Not Null | - | 现价 |
| original_price | Decimal | 10,2 | Null | - | 原价（打折前价格） |
| discount_percentage | Integer | - | Not Null | 0 | 折扣百分比（0-100） |
| **库存和销售** |
| stock | Integer | - | Not Null | 0 | 库存数量 |
| is_hot_sale | Boolean | - | Not Null | False | 是否热销商品 |
| **评价相关** |
| rating | Decimal | 3,1 | Not Null | 5.0 | 评分（0.0-5.0） |
| reviews | Integer | - | Not Null | 0 | 评论数量 |
| **商品规格** |
| color | CharField | 50 | Null | - | 颜色 |
| size | CharField | 50 | Null | - | 尺寸/型号 |
| material | CharField | 100 | Null | - | 材质 |
| weight | CharField | 50 | Null | - | 重量（如：15g） |
| length | CharField | 50 | Null | - | 长度/尺寸（如：120cm） |
| compatibility | CharField | 100 | Null | - | 适用性/兼容性 |
| **状态** |
| is_active | Boolean | - | Not Null | True | 是否上架 |
| created_at | DateTime | - | Not Null | now() | 创建时间 |
| updated_at | DateTime | - | Not Null | now() | 更新时间 |

**外键关系**:
- category_id → Category.id (PROTECT)

**计算属性**:
- has_discount: 是否有折扣（discount_percentage > 0 或 original_price > price）

**索引**:
- category_id
- is_active
- is_hot_sale
- created_at

---

### 2.3 ProductImage (商品图片表)
**表名**: `products_productimage`  
**说明**: 商品图片（支持多图）

| 字段名 | 类型 | 长度 | 约束 | 默认值 | 说明 |
|-------|------|------|------|--------|------|
| id | Integer | - | PK, Auto | - | 主键 |
| product_id | Integer | - | FK, Not Null | - | 商品ID（外键→Product） |
| image | ImageField | - | Not Null | - | 图片路径（路径：products/） |
| is_main | Boolean | - | Not Null | False | 是否主图 |

**外键关系**:
- product_id → Product.id (CASCADE)

**索引**:
- product_id
- is_main

---

## 3. 订单模块 (orders)

### 3.1 Address (收货地址表)
**表名**: `orders_address`  
**说明**: 用户收货地址

| 字段名 | 类型 | 长度 | 约束 | 默认值 | 说明 |
|-------|------|------|------|--------|------|
| id | Integer | - | PK, Auto | - | 主键 |
| user_id | Integer | - | FK, Not Null | - | 用户ID（外键→User） |
| recipient_name | CharField | 50 | Not Null | - | 收货人姓名 |
| phone | CharField | 20 | Not Null | - | 联系电话 |
| province | CharField | 50 | Not Null | - | 省份 |
| city | CharField | 50 | Not Null | - | 城市 |
| district | CharField | 50 | Not Null | - | 区县 |
| address | CharField | 200 | Not Null | - | 详细地址 |
| is_default | Boolean | - | Not Null | False | 是否默认地址 |
| created_at | DateTime | - | Not Null | now() | 创建时间 |

**外键关系**:
- user_id → User.id (CASCADE)

**索引**:
- user_id
- is_default

**排序**: is_default DESC, created_at DESC

---

### 3.2 Cart (购物车表)
**表名**: `orders_cart`  
**说明**: 用户购物车

| 字段名 | 类型 | 长度 | 约束 | 默认值 | 说明 |
|-------|------|------|------|--------|------|
| id | Integer | - | PK, Auto | - | 主键 |
| user_id | Integer | - | FK, Unique, Not Null | - | 用户ID（外键→User） |
| created_at | DateTime | - | Not Null | now() | 创建时间 |
| updated_at | DateTime | - | Not Null | now() | 更新时间 |

**外键关系**:
- user_id → User.id (CASCADE, One-to-One)

**索引**:
- user_id (Unique)

---

### 3.3 CartItem (购物车项表)
**表名**: `orders_cartitem`  
**说明**: 购物车商品项

| 字段名 | 类型 | 长度 | 约束 | 默认值 | 说明 |
|-------|------|------|------|--------|------|
| id | Integer | - | PK, Auto | - | 主键 |
| cart_id | Integer | - | FK, Not Null | - | 购物车ID（外键→Cart） |
| product_id | Integer | - | FK, Not Null | - | 商品ID（外键→Product） |
| quantity | Integer | - | Not Null | 1 | 数量 |
| created_at | DateTime | - | Not Null | now() | 添加时间 |

**外键关系**:
- cart_id → Cart.id (CASCADE)
- product_id → Product.id (CASCADE)

**唯一约束**:
- (cart_id, product_id) - 同一购物车中同一商品只能有一条记录

**计算属性**:
- subtotal: 小计金额（product.price × quantity）

**索引**:
- cart_id
- product_id

---

### 3.4 Order (订单表)
**表名**: `orders_order`  
**说明**: 订单主表

| 字段名 | 类型 | 长度 | 约束 | 默认值 | 说明 |
|-------|------|------|------|--------|------|
| id | Integer | - | PK, Auto | - | 主键 |
| user_id | Integer | - | FK, Not Null | - | 用户ID（外键→User） |
| order_no | CharField | 32 | Unique, Not Null | auto | 订单号（时间戳+UUID） |
| total_amount | Decimal | 10,2 | Not Null | - | 订单总金额 |
| status | CharField | 20 | Not Null | 'pending' | 订单状态 |
| **收货信息快照** |
| shipping_name | CharField | 50 | Not Null | - | 收货人姓名 |
| shipping_phone | CharField | 20 | Not Null | - | 联系电话 |
| shipping_province | CharField | 50 | Not Null | - | 省份 |
| shipping_city | CharField | 50 | Not Null | - | 城市 |
| shipping_district | CharField | 50 | Not Null | - | 区县 |
| shipping_address | CharField | 200 | Not Null | - | 详细地址 |
| **物流信息** |
| tracking_no | CharField | 100 | Null | - | 物流单号 |
| **时间戳** |
| created_at | DateTime | - | Not Null | now() | 创建时间 |
| paid_at | DateTime | - | Null | - | 支付时间 |
| shipped_at | DateTime | - | Null | - | 发货时间 |
| completed_at | DateTime | - | Null | - | 完成时间 |

**外键关系**:
- user_id → User.id (PROTECT)

**订单状态枚举**:
- `pending`: 待支付
- `paid`: 已支付
- `shipped`: 已发货
- `completed`: 已完成
- `cancelled`: 已取消

**索引**:
- order_no (Unique)
- user_id
- status
- created_at

**排序**: created_at DESC

---

### 3.5 OrderItem (订单项表)
**表名**: `orders_orderitem`  
**说明**: 订单商品项（商品快照）

| 字段名 | 类型 | 长度 | 约束 | 默认值 | 说明 |
|-------|------|------|------|--------|------|
| id | Integer | - | PK, Auto | - | 主键 |
| order_id | Integer | - | FK, Not Null | - | 订单ID（外键→Order） |
| product_id | Integer | - | FK, Null | - | 商品ID（外键→Product） |
| product_name | CharField | 100 | Not Null | - | 商品名称快照 |
| price | Decimal | 10,2 | Not Null | - | 购买时价格 |
| quantity | Integer | - | Not Null | - | 购买数量 |

**外键关系**:
- order_id → Order.id (CASCADE)
- product_id → Product.id (SET_NULL) - 商品删除后保留订单记录

**计算属性**:
- subtotal: 小计金额（price × quantity）

**索引**:
- order_id
- product_id

---

## 4. 数据库关系图

```
User (用户)
  ├── 1:N → Address (收货地址)
  ├── 1:1 → Cart (购物车)
  └── 1:N → Order (订单)

Category (分类)
  └── 1:N → Product (商品)

Product (商品)
  ├── 1:N → ProductImage (商品图片)
  ├── N:1 → Category (分类)
  ├── 1:N → CartItem (购物车项)
  └── 1:N → OrderItem (订单项)

Cart (购物车)
  ├── N:1 → User (用户)
  └── 1:N → CartItem (购物车项)

CartItem (购物车项)
  ├── N:1 → Cart (购物车)
  └── N:1 → Product (商品)

Order (订单)
  ├── N:1 → User (用户)
  └── 1:N → OrderItem (订单项)

OrderItem (订单项)
  ├── N:1 → Order (订单)
  └── N:1 → Product (商品, SET_NULL)
```

---

## 5. 数据库配置

**数据库引擎**: PostgreSQL  
**连接配置**:
- 数据库名: storeweb (可配置)
- 用户: postgres (可配置)
- 主机: localhost (可配置)
- 端口: 5432 (可配置)

---

## 6. 迁移历史

### 最新更新 (待执行)
**日期**: 2025年11月29日

**Products App 新增字段**:
- `original_price`: 原价
- `discount_percentage`: 折扣百分比
- `is_hot_sale`: 热销标签
- `size`: 尺寸/型号
- `material`: 材质
- `weight`: 重量
- `length`: 长度
- `compatibility`: 适用性

**执行迁移命令**:
```bash
python manage.py makemigrations products
python manage.py migrate products
```

---

## 7. 注意事项

1. **级联删除策略**:
   - User → Address, Cart: CASCADE (删除用户时删除相关数据)
   - Category → Product: PROTECT (有商品的分类不能删除)
   - Product → ProductImage, CartItem: CASCADE
   - Product → OrderItem: SET_NULL (保留订单历史)
   - User → Order: PROTECT (有订单的用户不能直接删除)

2. **唯一性约束**:
   - User.username, User.email: 全局唯一
   - Category.slug: 全局唯一
   - Order.order_no: 全局唯一
   - CartItem(cart, product): 组合唯一

3. **默认地址逻辑**:
   - 用户设置新的默认地址时，会自动取消其他地址的默认状态

4. **订单号生成**:
   - 格式: 时间戳(10位) + UUID(8位)
   - 示例: 1732867200a1b2c3d4

5. **媒体文件路径**:
   - 用户头像: `media/users/{user_id}/avatar/`
   - 分类图标: `media/categories/`
   - 商品图片: `media/products/`

---

**文档版本**: 1.0  
**维护人**: StoreWeb Team
