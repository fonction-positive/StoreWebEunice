# 模块化开发与实施计划 (Implementation Plan)

## 1. 模块化开发策略
项目将按照“高内聚、低耦合”的原则拆分为以下核心模块，建议按顺序开发。

### 模块一：基础架构与用户认证 (Foundation & Auth)
- **目标**：搭建前后端脚手架，实现用户注册登录。
- **后端**：
  - 初始化 Django 项目，配置 PostgreSQL。
  - 定义 `User` 模型。
  - 实现 JWT 认证接口 (Login, Register, Refresh)。
- **前端**：
  - 初始化 Vue3 + Vite + Element Plus。
  - 配置 Axios 拦截器和 Vue Router。
  - 实现登录、注册页面。
  - 实现 Pinia UserStore。

### 模块二：商品系统 (Product System)
- **目标**：实现商品的增删改查和展示。
- **后端**：
  - 定义 `Category`, `Product`, `ProductImage` 模型。
  - 实现商品管理 API (Admin) 和展示 API (Public)。
- **前端**：
  - 开发首页、分类页、商品详情页。
  - 开发管理后台的商品列表、编辑页。

### 模块三：购物车与订单 (Cart & Order)
- **目标**：实现购物核心流程。
- **后端**：
  - 定义 `Cart`, `Order`, `Address` 模型。
  - 实现购物车增删改查 API。
  - 实现下单、支付(模拟)、订单状态流转 API。
- **前端**：
  - 开发购物车页面、结算页面、收货地址管理。
  - 开发个人中心订单列表、订单详情。
  - 开发管理后台订单处理功能。

### 模块四：管理与统计 (Admin & Dashboard)
- **目标**：完善管理功能，提供数据支持。
- **后端**：
  - 实现用户管理 API (封禁)。
  - 实现数据统计 API (聚合查询)。
- **前端**：
  - 完善管理后台仪表盘。
  - 增加用户管理页面。

---

## 2. 开发进度规划 (Timeline)

| 阶段 | 周期 | 任务重点 |
| :--- | :--- | :--- |
| **Phase 1: 初始化** | Day 1-2 | 环境搭建，数据库设计，API 接口定义，Git 仓库初始化。 |
| **Phase 2: 用户与商品** | Day 3-5 | 完成用户认证，商品浏览，后台商品管理。 |
| **Phase 3: 交易核心** | Day 6-9 | 购物车，下单流程，订单状态管理，地址管理。 |
| **Phase 4: 管理与优化** | Day 10-11 | 后台订单发货，用户管理，数据统计，UI 细节打磨。 |
| **Phase 5: 测试与部署** | Day 12-13 | 单元测试，集成测试，Bug 修复，服务器部署。 |

---

## 3. 开发规范

### 3.1 代码规范
- **Python**: 遵循 PEP 8 规范，使用 `flake8` 或 `black` 格式化。
- **Vue/JS**: 遵循 ESLint Standard 规范，使用 Prettier 格式化。
- **命名**:
  - 变量/函数: `camelCase` (JS), `snake_case` (Python)。
  - 组件: `PascalCase` (如 `ProductCard.vue`)。
  - 类名: `PascalCase`。

### 3.2 Git 提交规范
- 格式：`type(scope): subject`
- 示例：
  - `feat(auth): add login api`
  - `fix(cart): fix quantity update bug`
  - `docs(readme): update installation guide`
  - `style(ui): adjust button color`

### 3.3 接口对接规范
- 前后端约定好 API 路径和字段后，可并行开发。
- 使用 Mock 数据 (如 Mock.js) 先行开发前端 UI。
- 联调时注意处理跨域 (CORS) 和 401/403 错误。
