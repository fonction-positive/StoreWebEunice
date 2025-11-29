# 前端设计文档 (Frontend Design)

## 1. 设计原则
- **风格**：简洁、现代、轻量化。
- **配色**：
  - 主色调：品牌蓝 (如 Element Plus 默认 Primary Blue) 或 科技黑。
  - 辅助色：白色背景，浅灰分割线，红色用于价格和警告。
- **响应式**：优先适配 PC 端，兼顾平板和移动端 (使用 Element Plus Grid 布局)。

## 2. 页面结构与路由 (Vue Router)

### 2.1 公共布局 (Layout)
- **Header**：Logo、搜索框、导航菜单 (首页/分类)、用户菜单 (登录/注册/个人中心/退出)、购物车图标。
- **Footer**：版权信息、友情链接、联系方式。
- **Main**：路由视图容器 (`<router-view>`)。

### 2.2 路由表 (Routes)

#### 用户端路由
| 路径 | 组件 | 说明 |
| :--- | :--- | :--- |
| `/` | `HomeView` | 首页，展示轮播图、热销商品 |
| `/login` | `LoginView` | 登录页 |
| `/register` | `RegisterView` | 注册页 |
| `/category/:id` | `CategoryView` | 分类商品列表页 |
| `/product/:id` | `ProductDetailView` | 商品详情页 |
| `/cart` | `CartView` | 购物车页 (需登录) |
| `/checkout` | `CheckoutView` | 结算页 (需登录) |
| `/user` | `UserLayout` | 个人中心布局 (需登录) |
| ├── `/user/profile` | `UserProfile` | 个人资料 |
| ├── `/user/orders` | `OrderList` | 订单列表 |
| ├── `/user/orders/:id` | `OrderDetail` | 订单详情 |
| └── `/user/address` | `AddressList` | 地址管理 |

#### 管理员端路由 (前缀 `/admin`)
*需 `role='admin'` 权限守卫*
| 路径 | 组件 | 说明 |
| :--- | :--- | :--- |
| `/admin` | `AdminDashboard` | 管理后台首页/仪表盘 |
| `/admin/products` | `AdminProductList` | 商品管理列表 |
| `/admin/products/new` | `AdminProductEdit` | 新增商品 |
| `/admin/products/:id` | `AdminProductEdit` | 编辑商品 |
| `/admin/orders` | `AdminOrderList` | 订单管理列表 |
| `/admin/users` | `AdminUserList` | 用户管理列表 |

## 3. 核心组件设计

### 3.1 通用组件
- `ProductCard.vue`: 商品卡片，展示图片、名称、价格。
- `SearchBar.vue`: 顶部搜索组件。
- `Pagination.vue`: 列表分页组件。

### 3.2 业务组件
- `CartItem.vue`: 购物车单行商品，包含数量加减器。
- `AddressModal.vue`: 新增/编辑地址的弹窗表单。
- `OrderStatusBadge.vue`: 根据状态显示不同颜色的标签 (待支付-黄，已完成-绿)。

## 4. 状态管理 (Pinia)

### 4.1 UserStore
- `state`: `token`, `userInfo`, `role`, `isAuthenticated`
- `actions`: `login()`, `logout()`, `fetchUserInfo()`, `register()`
- `getters`: `isAdmin` (判断是否为管理员)

### 4.2 CartStore
- `state`: `items` (购物车列表), `totalCount`
- `actions`: `fetchCart()`, `addToCart()`, `removeFromCart()`, `updateQuantity()`
- `getters`: `totalPrice` (计算选中商品总价)

## 5. 交互逻辑示例

### 5.1 登录与权限
1. 用户在 `LoginView` 输入账号密码。
2. 调用 `UserStore.login()` 发送 API 请求。
3. 成功后将 Token 存入 `localStorage` 和 Pinia。
4. 根据 `role` 跳转：管理员跳转 `/admin`，普通用户跳转 `/`。
5. Axios 拦截器自动在后续请求 Header 中添加 Token。

### 5.2 购物车交互
1. 在商品详情页点击“加入购物车”。
2. 若未登录，跳转登录页；若已登录，调用 API 添加。
3. 成功后，右上角购物车图标数字 +1 (更新 CartStore)。
4. 进入购物车页，修改数量时防抖 (Debounce) 调用 API 更新。

### 5.3 订单支付模拟
1. 在 `CheckoutView` 点击“确认支付”。
2. 前端显示“支付中...” Loading 状态。
3. 调用后端 `/pay/` 接口。
4. 成功后跳转 `/user/orders` 并提示“支付成功”。
