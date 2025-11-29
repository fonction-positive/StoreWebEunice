# 测试、部署与安全文档 (Testing, Deployment & Security)

## 1. 测试计划 (Testing Plan)

### 1.1 单元测试 (Unit Testing)
- **后端 (Django)**:
  - 使用 `django.test.TestCase`。
  - 测试重点：Model 方法 (如库存扣减逻辑)、Serializer 校验、Permission 权限控制。
  - 示例：测试非管理员无法调用删除商品接口。
- **前端 (Vue)**:
  - 使用 `Vitest` + `Vue Test Utils`。
  - 测试重点：核心组件渲染 (ProductCard)、Pinia 状态变更 (CartStore 计算总价)、工具函数。

### 1.2 集成测试 (Integration Testing)
- **API 测试**:
  - 使用 Postman Collection Runner 自动化运行接口测试用例。
  - 覆盖场景：注册 -> 登录 -> 浏览 -> 加购 -> 下单 -> 支付 -> 查看订单。
- **端到端测试 (E2E)** (可选):
  - 使用 Cypress 或 Playwright。
  - 模拟真实用户在浏览器中的操作流程。

---

## 2. 部署方案 (Deployment Guide)

### 2.1 环境要求
- **OS**: Ubuntu 20.04 LTS / CentOS 7+
- **Python**: 3.9+
- **Node.js**: 16+
- **Database**: PostgreSQL 13+
- **Web Server**: Nginx

### 2.2 部署架构
```
[Client Browser]  ->  [Nginx (Reverse Proxy)]
                            |
            +---------------+---------------+
            |                               |
      [Frontend Static Files]        [Gunicorn / uWSGI]
      (Vue dist folder)              (Django App)
                                            |
                                     [PostgreSQL DB]
```

### 2.3 详细步骤
1. **后端部署**:
   - 拉取代码，创建虚拟环境 `python -m venv venv`。
   - 安装依赖 `pip install -r requirements.txt`。
   - 配置环境变量 `.env` (DB_HOST, SECRET_KEY, DEBUG=False)。
   - 收集静态文件 `python manage.py collectstatic`。
   - 运行迁移 `python manage.py migrate`。
   - 使用 Gunicorn 启动: `gunicorn config.wsgi:application --bind 127.0.0.1:8000`。

2. **前端部署**:
   - 安装依赖 `npm install`。
   - 构建生产包 `npm run build`。
   - 将 `dist/` 目录上传至服务器 `/var/www/storeweb/dist`。

3. **Nginx 配置**:
   ```nginx
   server {
       listen 80;
       server_name example.com;

       # 前端静态文件
       location / {
           root /var/www/storeweb/dist;
           try_files $uri $uri/ /index.html;
       }

       # 后端 API 代理
       location /api/ {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       # 后端 Admin 静态资源
       location /static/admin/ {
           alias /path/to/django/static/admin/;
       }
       
       # 媒体文件
       location /media/ {
           alias /path/to/django/media/;
       }
   }
   ```

4. **Docker 部署 (可选)**:
   - 编写 `Dockerfile` 和 `docker-compose.yml`。
   - 一键启动：`docker-compose up -d --build`。

---

## 3. 安全性方案 (Security Plan)

### 3.1 认证与授权
- **JWT**: 设置合理的过期时间 (Access: 1小时, Refresh: 7天)。
- **权限**: 严格检查 API 权限，防止越权访问 (IDOR)。例如，用户只能查看自己的订单 `Order.objects.filter(user=request.user)`。

### 3.2 数据安全
- **HTTPS**: 强制使用 SSL 证书 (Let's Encrypt)，防止中间人攻击。
- **密码**: 绝不存储明文密码，使用 Django 默认的 PBKDF2 哈希算法。
- **支付**: 不存储用户信用卡号等敏感支付信息，仅存储支付网关返回的 Token 或 Transaction ID。

### 3.3 常见漏洞防护
- **SQL 注入**: 始终使用 Django ORM，避免拼接原生 SQL。
- **XSS (跨站脚本)**: Vue.js 默认转义输出；Django 模板默认开启自动转义。
- **CSRF (跨站请求伪造)**: 
  - 对于 Cookie 认证：开启 CSRF Middleware。
  - 对于 JWT 认证：通常不受 CSRF 影响 (存储在 localStorage)，但需防范 XSS 窃取 Token。
- **暴力破解**: 对登录接口实施限流 (Throttling)，如每分钟最多尝试 5 次。

### 3.4 备份策略
- **数据库**: 每日定时 `pg_dump` 备份，并上传至异地存储 (如 AWS S3)。
- **媒体文件**: 定期备份 `media/` 目录。
