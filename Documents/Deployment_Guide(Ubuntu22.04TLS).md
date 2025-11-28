# StoreWeb Ubuntu 服务器部署指南

本指南提供了在 Ubuntu 20.04/22.04 服务器上部署 StoreWeb 应用 (Django + Vue 3) 的详细步骤。

## 1. 准备工作

- 一台运行 Ubuntu 20.04 或 22.04 的服务器。
- Root 权限或拥有 `sudo` 权限的用户。
- 一个指向服务器 IP 地址的域名（可选，但推荐）。

## 2. 系统环境配置

更新系统软件包并安装必要的依赖：

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3-pip python3-venv python3-dev libpq-dev postgresql postgresql-contrib nginx curl git
```

安装 Node.js 20.x (LTS 版本) 用于构建前端项目：

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

**注意：** Vite 7.x 要求 Node.js 20.19+ 或 22.12+，请确保安装正确版本。

## 3. 数据库配置 (PostgreSQL)

创建数据库和用户：

```bash
sudo -u postgres psql
```

在 PostgreSQL 命令行中执行：

```sql
CREATE DATABASE storeweb;
CREATE USER storewebuser WITH PASSWORD 'your_secure_password';
ALTER ROLE storewebuser SET client_encoding TO 'utf8';
ALTER ROLE storewebuser SET default_transaction_isolation TO 'read committed';
ALTER ROLE storewebuser SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE storeweb TO storewebuser;
\c storeweb
GRANT ALL ON SCHEMA public TO storewebuser;
\q
```

**注意：**
1. 请将 `'your_secure_password'` 替换为您自己的强密码。
2. 如果您使用的是 PostgreSQL 15 及以上版本，必须执行 `GRANT ALL ON SCHEMA public ...` 这行命令，否则会出现权限错误。

## 4. 项目代码获取

将代码库克隆到服务器（例如克隆到 `/var/www/storeweb`）：

```bash
sudo mkdir -p /var/www/storeweb
sudo chown -R $USER:$USER /var/www/storeweb
git clone <your-repository-url> /var/www/storeweb
cd /var/www/storeweb
```

## 5. 后端部署

### 5.1. 虚拟环境和依赖

进入后端目录：

```bash
cd /var/www/storeweb/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn  # 安装 Gunicorn 用于生产环境
```

### 5.2. 环境变量配置

在 `/var/www/storeweb/backend/` 目录下创建 `.env` 文件：

```bash
nano .env
```

添加以下内容（请根据实际情况修改）：

```env
DEBUG=False
SECRET_KEY=your_production_secret_key
ALLOWED_HOSTS=your_domain.com,your_server_ip
DB_NAME=storeweb
DB_USER=storewebuser
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432
```

**提示：** 您可以使用以下命令生成一个新的 `SECRET_KEY`：
```bash
python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

### 5.3. 数据库迁移和静态文件收集

```bash
python manage.py migrate
python manage.py collectstatic --noinput
```

### 5.4. 配置 Gunicorn 服务

创建 Gunicorn 的 systemd 服务文件：

```bash
sudo nano /etc/systemd/system/gunicorn.service
```

内容如下：

```ini
[Unit]
Description=Gunicorn daemon for StoreWebEunice
After=network.target

[Service]
User=storeweb
Group=storeweb
WorkingDirectory=/var/www/StoreWebEunice/backend
ExecStart=/var/www/StoreWebEunice/backend/venv/bin/gunicorn \
          --access-logfile - \
          --workers 3 \
          --bind unix:/var/www/StoreWebEunice/backend/storeweb.sock \
          config.wsgi:application

[Install]
WantedBy=multi-user.target
```

启动并设置 Gunicorn 开机自启：

```bash
sudo systemctl daemon-reload
sudo systemctl start gunicorn
sudo systemctl enable gunicorn
sudo systemctl status gunicorn
```

## 6. 前端部署

进入前端目录并构建项目：

```bash
cd /var/www/StoreWebEunice/frontend
npm install
npm run build
```

构建完成后会生成 `dist` 目录，其中包含静态文件。

## 7. Nginx 配置

创建 Nginx 配置文件：

```bash
sudo nano /etc/nginx/sites-available/storeweb
```

内容如下：

```nginx
server {
    listen 80;
    server_name your_server_ip_or_domain;  # 替换为服务器IP或域名

    # 前端 (Vue 3)
    location / {
        root /var/www/StoreWebEunice/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API (Django)
    location /api/ {
        include proxy_params;
        proxy_pass http://unix:/var/www/StoreWebEunice/backend/storeweb.sock;
    }

    # Django 管理后台
    location /admin/ {
        include proxy_params;
        proxy_pass http://unix:/var/www/StoreWebEunice/backend/storeweb.sock;
    }

    # Django 静态文件
    location /static/ {
        alias /var/www/StoreWebEunice/backend/static/;
    }

    # 媒体文件 (用户上传)
    location /media/ {
        alias /var/www/StoreWebEunice/backend/media/;
    }
}
```

启用配置并重启 Nginx：

```bash
sudo ln -s /etc/nginx/sites-available/storeweb /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx
```

## 8. 权限设置

确保 Nginx 有权限读取文件：

```bash
sudo chown -R storeweb:storeweb /var/www/StoreWebEunice/frontend/dist
sudo chown -R storeweb:storeweb /var/www/StoreWebEunice/backend/static
sudo chown -R storeweb:storeweb /var/www/StoreWebEunice/backend/media
sudo chmod -R 755 /var/www/StoreWebEunice
```

## 9. SSL 证书配置 (可选但推荐)

安装 Certbot 并配置 SSL：

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d estore.jzy.asia
```

配置过程中：
1. 输入邮箱地址（用于证书续期通知）
2. 同意服务条款：输入 `A`
3. 选择是否订阅邮件：输入 `N`
4. **重要：选择 `2` 进行 HTTP 到 HTTPS 的重定向**

证书会自动配置并每 90 天续期。

**配置 SSL 后需要更新后端配置：**

```bash
# 编辑后端 .env 文件
sudo nano /var/www/StoreWebEunice/backend/.env
```

更新以下内容：
```env
DEBUG=False
SECRET_KEY=your_production_secret_key
ALLOWED_HOSTS=estore.jzy.asia
CSRF_TRUSTED_ORIGINS=https://estore.jzy.asia
DB_NAME=storeweb
DB_USER=storewebuser
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432
```

**重要：** 添加域名后必须重启 Gunicorn：
```bash
sudo systemctl restart gunicorn
sudo systemctl status gunicorn
```

## 10. 验证部署

在浏览器中访问 `http://your_domain.com` (或您的服务器 IP)。您应该能看到 StoreWeb 应用正常运行。


1. 首先确认所有服务都在运行
# 检查 Gunicorn 状态
sudo systemctl status gunicorn

# 检查 Nginx 状态
sudo systemctl status nginx

# 检查 PostgreSQL 状态
sudo systemctl status postgresql

2. 确认配置文件中的 IP 地址
后端 .env 文件 (/var/www/StoreWebEunice/backend/.env)：
```
ALLOWED_HOSTS=34.147.177.108
```
Nginx 配置 (/etc/nginx/sites-available/storeweb)：
```
server_name 34.147.177.108;
```
3. 重启服务
如果修改了配置，需要重启：
```
# 重启 Gunicorn
sudo systemctl restart gunicorn

# 重启 Nginx
sudo systemctl restart nginx
```

4. 检查防火墙
```
# 如果使用 ufw
sudo ufw allow 80/tcp
sudo ufw status

# 如果使用 Google Cloud，需要在 GCP 控制台添加防火墙规则
# 允许 TCP 端口 80 的入站流量
```

5. 检查日志
```
# 检查 Gunicorn 日志
sudo journalctl -u gunicorn

# 检查 Nginx 日志
sudo journalctl -u nginx
```

http://34.147.177.108/

http://34.147.177.108/admin/

http://34.147.177.108/api/v1/products/