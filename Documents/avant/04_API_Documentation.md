# API 接口文档 (API Documentation)

## 1. 接口设计规范
- **协议**：HTTP/1.1 (HTTPS)
- **格式**：JSON
- **认证**：Authorization: Bearer <token>
- **URL 前缀**：`/api/v1/`

## 2. 通用响应格式
```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```
或直接使用 DRF 默认 REST 风格 (200 OK 返回数据，4xx/5xx 返回错误详情)。

## 3. 用户端接口 (Client API)

### 3.1 认证模块 (Auth)
| 方法 | 路径 | 描述 | 权限 |
| :--- | :--- | :--- | :--- |
| POST | `/auth/register/` | 用户注册 (username, email, password) | 无需登录 |
| POST | `/auth/login/` | 用户登录，获取 Token | 无需登录 |
| POST | `/auth/refresh/` | 刷新 Token | 无需登录 |
| GET | `/auth/me/` | 获取当前用户信息 | 需登录 |
| PUT | `/auth/me/` | 修改个人信息 (nickname, avatar) | 需登录 |
| POST | `/auth/password/` | 修改密码 | 需登录 |

### 3.2 收货地址 (Address)
| 方法 | 路径 | 描述 | 权限 |
| :--- | :--- | :--- | :--- |
| GET | `/addresses/` | 获取我的地址列表 | 需登录 |
| POST | `/addresses/` | 新增地址 | 需登录 |
| PUT | `/addresses/{id}/` | 修改地址 | 需登录 |
| DELETE | `/addresses/{id}/` | 删除地址 | 需登录 |

### 3.3 商品模块 (Product)
| 方法 | 路径 | 描述 | 权限 |
| :--- | :--- | :--- | :--- |
| GET | `/categories/` | 获取分类列表 | 公开 |
| GET | `/products/` | 获取商品列表 (支持 ?category=x&search=y&sort=z) | 公开 |
| GET | `/products/{id}/` | 获取商品详情 | 公开 |

### 3.4 购物车模块 (Cart)
| 方法 | 路径 | 描述 | 权限 |
| :--- | :--- | :--- | :--- |
| GET | `/cart/` | 获取购物车内容 | 需登录 |
| POST | `/cart/items/` | 添加商品到购物车 (product_id, quantity) | 需登录 |
| PUT | `/cart/items/{id}/` | 修改条目数量 | 需登录 |
| DELETE | `/cart/items/{id}/` | 删除购物车条目 | 需登录 |

### 3.5 订单模块 (Order)
| 方法 | 路径 | 描述 | 权限 |
| :--- | :--- | :--- | :--- |
| POST | `/orders/` | 创建订单 (address_id, items=[...]) | 需登录 |
| GET | `/orders/` | 获取我的订单列表 | 需登录 |
| GET | `/orders/{id}/` | 获取订单详情 | 需登录 |
| POST | `/orders/{id}/pay/` | 模拟支付订单 | 需登录 |
| POST | `/orders/{id}/cancel/` | 取消订单 | 需登录 |
| POST | `/orders/{id}/confirm/` | 确认收货 | 需登录 |

---

## 4. 管理员端接口 (Admin API)
*注：所有管理端接口需验证 `IsAdminUser` 权限*

### 4.1 统计与概览
| 方法 | 路径 | 描述 |
| :--- | :--- | :--- |
| GET | `/admin/dashboard/` | 获取统计数据 (销售额、订单数等) |

### 4.2 商品管理
| 方法 | 路径 | 描述 |
| :--- | :--- | :--- |
| POST | `/admin/products/` | 新增商品 |
| PUT | `/admin/products/{id}/` | 编辑商品信息 |
| PATCH | `/admin/products/{id}/stock/` | 快速调整库存 |
| DELETE | `/admin/products/{id}/` | 删除/下架商品 |
| POST | `/admin/products/{id}/images/` | 上传商品图片 |

### 4.3 订单管理
| 方法 | 路径 | 描述 |
| :--- | :--- | :--- |
| GET | `/admin/orders/` | 获取所有订单 (支持筛选) |
| GET | `/admin/orders/{id}/` | 查看订单详情 |
| POST | `/admin/orders/{id}/ship/` | 订单发货 (填写 tracking_no) |
| POST | `/admin/orders/{id}/cancel/` | 强制取消订单 |

### 4.4 用户管理
| 方法 | 路径 | 描述 |
| :--- | :--- | :--- |
| GET | `/admin/users/` | 获取用户列表 |
| POST | `/admin/users/{id}/ban/` | 封禁用户 |
| POST | `/admin/users/{id}/unban/` | 解封用户 |

---

## 5. 接口测试建议
- **工具**：Postman 或 Insomnia
- **流程**：
  1. 调用 `/auth/login/` 获取 `access` token。
  2. 在 Postman Headers 中设置 `Authorization: Bearer <your_token>`。
  3. 测试各个业务接口。
- **Swagger/OpenAPI**：
  - 集成 `drf-spectacular` 或 `drf-yasg` 自动生成在线 API 文档。
  - 访问 `/api/schema/swagger-ui/` 可视化调试接口。
