# 邮箱验证码登录功能实现文档

## 功能概述

实现基于邮箱验证码的快捷登录功能，用户无需记住密码，只需通过邮箱接收验证码即可登录。

## 技术方案

- **验证码存储**：Redis（5分钟过期）
- **邮件服务**：Gmail SMTP
- **验证码格式**：6位数字
- **安全措施**：
  - 验证码5分钟过期
  - 同一邮箱60秒内只能发送一次
  - 验证码使用后立即删除
  - 记录发送日志

## 实现步骤

### 一、环境准备

#### 1. 安装依赖

```bash
# 后端依赖
pip install django-redis

# 更新 requirements.txt
# echo "django-redis" >> backend/requirements.txt
```

#### 2. 配置 Gmail 应用专用密码

1. 登录 Google 账号
2. 访问：https://myaccount.google.com/security
3. 开启"两步验证"
4. 生成"应用专用密码"
5. 保存密码到 `.env` 文件

#### 3. 安装 Redis

**Ubuntu 服务器：**
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis
sudo systemctl enable redis
```

**macOS 本地开发：**
```bash
brew install redis
brew services start redis
```

**验证 Redis 运行：**
```bash
redis-cli ping
# 应该返回：PONG
```

### 二、后端实现

#### 1. Django 配置（settings.py）

```python
# 邮件配置
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = os.getenv('EMAIL_HOST_USER')

# Redis 配置
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        },
        'TIMEOUT': 300,  # 默认5分钟过期
    }
}
```

#### 2. 环境变量（.env）

```env
# 邮件配置
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-specific-password
```

#### 3. API 端点

**发送验证码：**
- URL: `POST /api/v1/auth/send_email_code/`
- 参数: `{"email": "user@example.com"}`
- 返回: `{"message": "验证码已发送"}`

**邮箱验证码登录：**
- URL: `POST /api/v1/auth/email_login/`
- 参数: `{"email": "user@example.com", "code": "123456"}`
- 返回: `{"access": "...", "refresh": "..."}`

#### 4. 核心逻辑

**发送验证码流程：**
1. 验证邮箱格式
2. 检查发送频率（60秒限制）
3. 生成6位随机数字
4. 存储到 Redis：`email_code:{email}` = `{code}`
5. 发送邮件
6. 记录最后发送时间：`email_sent:{email}` = `timestamp`

**验证码登录流程：**
1. 从 Redis 获取验证码
2. 验证码匹配检查
3. 根据邮箱查找用户
   - 存在：直接登录
   - 不存在：自动注册新用户
4. 删除已使用的验证码
5. 生成并返回 JWT Token

### 三、前端实现

#### 1. Login.vue 修改

添加两个登录方式的切换：
- 用户名密码登录（原有）
- 邮箱验证码登录（新增）

#### 2. 邮箱登录表单

```vue
<el-form-item label="邮箱">
  <el-input v-model="emailForm.email" type="email" />
</el-form-item>

<el-form-item label="验证码">
  <div class="code-input-group">
    <el-input v-model="emailForm.code" />
    <el-button 
      @click="sendCode" 
      :disabled="countdown > 0"
    >
      {{ countdown > 0 ? `${countdown}秒后重试` : '发送验证码' }}
    </el-button>
  </div>
</el-form-item>
```

#### 3. 倒计时逻辑

```javascript
const countdown = ref(0);

const sendCode = async () => {
  // 发送验证码
  await api.post('auth/send_email_code/', { email: emailForm.email });
  
  // 开始倒计时
  countdown.value = 60;
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};
```

### 四、安全措施

1. **频率限制**：同一邮箱60秒内只能发送一次
2. **验证码过期**：5分钟后自动失效
3. **一次性使用**：验证成功后立即删除
4. **邮箱验证**：确保邮箱格式正确
5. **日志记录**：记录所有发送和验证操作

### 五、测试步骤

#### 本地测试

1. 启动 Redis：`redis-server`
2. 配置 Gmail 应用密码
3. 启动 Django：`python manage.py runserver`
4. 启动前端：`npm run dev`
5. 测试发送验证码
6. 测试登录功能

#### 生产部署

1. 确保服务器安装 Redis
2. 配置环境变量
3. 更新 requirements.txt
4. 重启 Gunicorn

### 六、邮件模板示例

```
主题：StoreWeb 登录验证码

您好，

您的登录验证码是：123456

验证码有效期为5分钟，请尽快使用。

如果这不是您本人的操作，请忽略此邮件。

---
StoreWeb 团队
```

### 七、故障排查

**验证码收不到：**
1. 检查 Gmail 应用密码是否正确
2. 检查邮箱是否在垃圾邮件中
3. 查看 Django 日志

**Redis 连接失败：**
```bash
# 检查 Redis 状态
sudo systemctl status redis

# 测试连接
redis-cli ping
```

**验证码过期太快：**
- 修改 `settings.py` 中的 `TIMEOUT` 值

## 附录

### Redis 命令

```bash
# 查看所有验证码
redis-cli keys "email_code:*"

# 查看特定验证码
redis-cli get "email_code:user@example.com"

# 删除验证码
redis-cli del "email_code:user@example.com"

# 清空所有数据（谨慎使用）
redis-cli flushdb
```

### Gmail 限制

- 每天发送限制：500封
- 建议使用专业邮件服务（SendGrid、阿里云）用于生产环境
