# Nginx 配置使用说明

这个配置文件实现了根据设备类型自动跳转到 PC 端或移动端页面的功能。

## 部署架构

- **PC 端 (Frontend)**: 部署在 `/`
- **移动端 (Mobile)**: 部署在 `/mobile`

## 如何使用

### 1. 准备构建文件

首先需要构建前端和移动端项目：

```bash
# 构建 PC 端
cd frontend
npm run build
# 生成的 dist 目录内容将用于 PC 端部署

# 构建移动端
cd ../mobile
npm run build
# 生成的 dist 目录内容将用于移动端部署
```

### 2. 使用 Docker 运行 (推荐)

创建一个 `docker-compose.yml` 文件：

```yaml
version: '3'
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./frontend/dist:/usr/share/nginx/html/frontend:ro
      - ./mobile/dist:/usr/share/nginx/html/mobile:ro
```

然后运行：
```bash
docker-compose up -d
```

### 3. 服务器直接部署 (非 Docker)

如果你在服务器上直接安装了 Nginx (例如 Ubuntu/CentOS)，且遵循了之前的部署指南（项目位于 `/var/www/StoreWebEunice`）：

1. **构建项目**：
   在服务器上或本地构建项目，生成 `frontend/dist` 和 `mobile/dist`。

2. **放置文件**：
   将构建好的文件复制到 Nginx 的标准目录，例如：
   ```bash
   # 创建目录
   sudo mkdir -p /var/www/StoreWebEunice/frontend/dist
   sudo mkdir -p /var/www/StoreWebEunice/mobile/dist
   
   # 复制文件 (假设你在项目根目录)
   sudo cp -r frontend/dist/* /var/www/StoreWebEunice/frontend/dist/
   sudo cp -r mobile/dist/* /var/www/StoreWebEunice/mobile/dist/
   
   # 修正权限
   sudo chown -R storeweb:storeweb /var/www/StoreWebEunice
   ```

3. **配置 Nginx**：
   - 将 `nginx.conf` 的内容**替换** `/etc/nginx/sites-available/storeweb` 中的内容。
   - 现在的 `nginx.conf` 已经包含了后端代理配置，所以可以直接替换。

4. **重启 Nginx**：
   ```bash
   sudo nginx -t  # 测试配置
   sudo systemctl restart nginx
   ```

### 4. 自动化部署脚本 (推荐)

为了避免每次手动执行上述步骤，你可以使用项目根目录下的 `deploy.sh` 脚本。

1. **赋予执行权限**：
   ```bash
   chmod +x deploy.sh
   ```

2. **一键部署**：
   每次更新代码后，只需运行：
   ```bash
   ./deploy.sh
   ```
   脚本会自动完成构建、文件复制和 Nginx 重载。

## 配置说明

核心逻辑在 `nginx.conf` 中：

```nginx
# 检测移动端 User-Agent
map $http_user_agent $is_mobile {
    default 0;
    "~*android|ip(hone|od)|windows\s+(phone|ce)|blackberry|symbian|opera\s+m(ob|in)i" 1;
}

# 自动跳转
location / {
    if ($is_mobile) {
        rewrite ^/$ /mobile/ redirect;
    }
    # ...
}
```
