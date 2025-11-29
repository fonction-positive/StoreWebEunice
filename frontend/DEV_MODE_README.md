# 开发模式使用说明

## 如何启用开发模式

开发模式已经启用！现在你可以在本地预览所有前端页面，无需连接数据库。

### 功能特性

✅ **自动登录** - 无需输入用户名密码，直接进入系统
✅ **Mock 用户数据** - 预设了测试用户信息
✅ **Mock 订单数据** - 包含 3 个不同状态的测试订单
✅ **Mock 购物车** - 预设了 2 个商品在购物车中
✅ **Mock 地址** - 包含 2 个收货地址

### 使用方法

1. **启动前端项目**
   ```bash
   cd /Users/jinzhuoyuan/Eunice/StoreWeb/frontend
   npm run dev
   ```

2. **访问页面**
   - 打开浏览器访问 `http://localhost:5173`
   - 点击登录按钮（随便输入用户名密码即可）
   - 自动使用 mock 数据登录

3. **可以访问的页面**
   - ✅ 个人中心 `/user/profile`
   - ✅ 基本信息 `/user/profile/basic`
   - ✅ 收货地址 `/user/profile/address`
   - ✅ 安全设置 `/user/profile/security`
   - ✅ 我的订单 `/user/orders`
   - ✅ 订单详情 `/user/orders/1` (或 2, 3)
   - ✅ 购物车 `/cart`

### Mock 数据说明

**测试用户**
- 用户名: testuser
- 邮箱: test@example.com

**测试订单**
- 订单 1: 已完成 (completed)
- 订单 2: 已发货 (shipped)
- 订单 3: 待支付 (pending)

**购物车商品**
- 无线蓝牙耳机 Pro × 2
- 智能手表 Ultra × 1

### 如何关闭开发模式

如果你想恢复正常模式（连接真实后端），编辑以下文件：

```javascript
// frontend/src/config/devMode.js
export const DEV_MODE = {
  enabled: false,  // 改为 false
  // ...
};
```

### 注意事项

⚠️ 开发模式下的所有操作都是模拟的，不会真正保存到数据库
⚠️ 刷新页面后 mock 数据会重置
⚠️ 仅用于本地开发和 UI 预览
