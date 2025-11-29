# 图片上传功能使用说明

## 后端配置

### 1. Media 文件配置
已在 `settings.py` 中配置：
```python
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

### 2. URL 配置
已在 `urls.py` 中添加 media 文件服务（仅开发环境）

### 3. 图片存储位置
- 商品图片：`backend/media/products/`
- 用户头像：`backend/media/avatars/`

## 前端使用

### 方法 1：通过 Django Admin 上传（最简单）
1. 访问 `http://localhost:8000/admin/`
2. 登录管理员账号（admin/admin123）
3. 进入 Products → Products
4. 点击商品进入编辑
5. 在 Product images 部分点击 "Add another Product image"
6. 选择图片文件上传
7. 保存

### 方法 2：通过前端上传（需要开发）
需要在 `AdminProductEdit.vue` 中添加：
- Element Plus 的 `el-upload` 组件
- 图片预览功能
- 多图上传支持

## 图片访问
上传后的图片可通过以下 URL 访问：
`http://localhost:8000/media/products/图片文件名`

## 注意事项
1. 确保 `backend/media/` 目录有写入权限
2. 生产环境建议使用云存储（如 AWS S3、阿里云 OSS）
3. 图片文件会自动保存到 `media/products/` 目录
