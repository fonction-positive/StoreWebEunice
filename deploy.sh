#!/bin/bash

# 遇到错误立即停止
set -e

echo "🚀 开始部署流程..."

# 1. 构建前端 (Frontend)
echo "📦 正在构建 Frontend..."
cd frontend
# 如果需要安装依赖，请取消下面这行的注释
# npm install
npm run build
cd ..

# 2. 构建移动端 (Mobile)
echo "📦 正在构建 Mobile..."
cd mobile
# 如果需要安装依赖，请取消下面这行的注释
npm install
npm run build
cd ..

# 3. 部署文件
echo "📂 正在更新 Nginx 目录文件..."

# 确保目标目录存在
sudo mkdir -p /var/www/StoreWebEunice/frontend/dist
sudo mkdir -p /var/www/StoreWebEunice/mobile/dist

# 清理旧文件
sudo rm -rf /var/www/StoreWebEunice/frontend/dist/*
sudo rm -rf /var/www/StoreWebEunice/mobile/dist/*

# 复制新构建的文件
sudo cp -r frontend/dist/* /var/www/StoreWebEunice/frontend/dist/
sudo cp -r mobile/dist/* /var/www/StoreWebEunice/mobile/dist/

# 4. 权限修正 (重要)
echo "🔒 正在修正文件权限..."
sudo chown -R storeweb:storeweb /var/www/StoreWebEunice/frontend/dist
sudo chown -R storeweb:storeweb /var/www/StoreWebEunice/mobile/dist

# 4. 重载 Nginx
echo "🔄 正在重载 Nginx 配置..."
sudo systemctl reload nginx

echo "✅ 部署完成！"
