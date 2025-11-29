# 用户名和邮箱管理规则

## 概述
本文档说明了系统中用户名和邮箱的管理规则及其实现细节。

## 核心规则

### 1. 邮箱（Email）
- **作用**：账号的唯一标识符
- **特性**：
  - 注册后不可修改
  - 必须唯一
  - 用于邮箱验证码登录
  - 用于找回密码等安全操作

### 2. 用户名（Username）
- **作用**：用户的登录标识和显示名称
- **特性**：
  - 可以修改
  - 必须保持唯一性
  - 可用于密码登录
  - 修改时会验证是否与其他用户冲突

## 实现细节

### 后端实现（Django）

#### 1. 用户序列化器（UserSerializer）
```python
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'avatar', 'date_joined', 'is_active', 'is_superuser')
        read_only_fields = ('email', 'role', 'date_joined', 'is_active', 'is_superuser')
    
    def validate_username(self, value):
        # 检查用户名是否已被其他用户使用
        user = self.context.get('request').user if self.context.get('request') else None
        if User.objects.filter(username=value).exclude(id=user.id if user else None).exists():
            raise serializers.ValidationError('该用户名已被使用')
        return value
```

**关键点**：
- `email` 在 `read_only_fields` 中，确保无法通过 API 修改
- `validate_username` 方法在修改用户名时检查唯一性
- 检查时排除当前用户自己（允许不修改用户名的情况）

#### 2. 邮箱登录自动注册
```python
# 在 EmailLoginView 中
if not user:
    # 生成唯一用户名
    base_username = email.split('@')[0]
    username = base_username
    
    while User.objects.filter(username=username).exists():
        random_suffix = random.randint(1000, 9999)
        username = f"{base_username}_{random_suffix}"
    
    # 创建新用户
    user = User.objects.create_user(
        username=username,
        email=email,
        password=''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(12))
    )
```

**关键点**：
- 从邮箱地址生成初始用户名（@前面的部分）
- 如果冲突，添加随机 4 位数字后缀（1000-9999）
- 确保生成的用户名唯一

### 前端实现（Vue 3）

#### 1. 用户资料页面（UserProfile.vue）
```vue
<el-form-item label="用户名">
  <el-input v-model="profileForm.username" />
  <div class="form-tip">用户名可用于登录，但需保持唯一</div>
</el-form-item>

<el-form-item label="邮箱">
  <el-input v-model="profileForm.email" disabled />
  <div class="form-tip">邮箱是您的账号标识，不可修改</div>
</el-form-item>
```

**关键点**：
- 用户名输入框可编辑
- 邮箱输入框为 `disabled` 状态

#### 2. 更新个人信息处理
```javascript
const handleUpdateProfile = async () => {
  loading.value = true;
  try {
    const formData = new FormData();
    formData.append('username', profileForm.username);
    formData.append('email', profileForm.email);
    if (avatarFile.value) {
      formData.append('avatar', avatarFile.value);
    }
    
    await userStore.updateProfile(formData);
    ElMessage.success('个人信息更新成功');
  } catch (error) {
    // 处理用户名重复错误
    if (error.response?.data?.username) {
      ElMessage.error(error.response.data.username[0] || '用户名已存在');
    } else {
      ElMessage.error(error.response?.data?.message || '更新失败');
    }
  } finally {
    loading.value = false;
  }
};
```

**关键点**：
- 发送用户名到后端（即使邮箱字段被禁用，也一起发送）
- 特别处理用户名重复的错误信息
- 显示友好的错误提示

## 使用场景

### 场景 1：用户通过邮箱验证码注册
1. 用户输入邮箱和用户名
2. 系统发送验证码到邮箱
3. 用户输入验证码完成注册
4. 用户名和邮箱都被保存，邮箱不可再修改

### 场景 2：用户通过邮箱验证码登录（首次）
1. 用户输入邮箱和验证码
2. 系统检测该邮箱未注册
3. 系统自动创建账号：
   - 邮箱：用户输入的邮箱
   - 用户名：从邮箱生成（如 `john` 来自 `john@example.com`）
   - 如果用户名冲突，添加随机后缀（如 `john_1234`）

### 场景 3：用户修改用户名
1. 用户进入个人中心
2. 修改用户名字段
3. 点击保存
4. 系统验证：
   - 如果用户名已被其他用户使用 → 返回错误 "该用户名已被使用"
   - 如果用户名可用 → 保存成功

### 场景 4：用户尝试修改邮箱
1. 用户进入个人中心
2. 发现邮箱字段为灰色不可编辑
3. 鼠标悬停时看到提示："邮箱是您的账号标识，不可修改"

## 数据库约束

确保 User 模型有以下约束：
```python
class User(AbstractUser):
    email = models.EmailField(unique=True)  # 邮箱唯一
    username = models.CharField(max_length=150, unique=True)  # 用户名唯一
```

## API 端点

### 获取和更新用户信息
- **端点**：`GET/PATCH /api/v1/auth/me/`
- **权限**：需要登录
- **可更新字段**：`username`, `avatar`
- **只读字段**：`email`, `role`, `date_joined`, `is_active`, `is_superuser`

### 响应示例

#### 成功更新用户名
```json
{
  "id": 1,
  "username": "new_username",
  "email": "user@example.com",
  "role": "customer",
  "avatar": null,
  "date_joined": "2024-01-01T00:00:00Z",
  "is_active": true,
  "is_superuser": false
}
```

#### 用户名重复错误
```json
{
  "username": ["该用户名已被使用"]
}
```

## 测试清单

### 后端测试
- [ ] 尝试通过 API 修改邮箱，确认被拒绝或忽略
- [ ] 尝试修改用户名为已存在的用户名，确认返回错误
- [ ] 尝试修改用户名为新的唯一值，确认成功
- [ ] 邮箱登录时用户名冲突，确认自动添加随机后缀

### 前端测试
- [ ] 邮箱字段显示为禁用状态
- [ ] 可以编辑用户名字段
- [ ] 修改用户名为已存在的值，显示错误提示
- [ ] 修改用户名为新值，显示成功提示

## 注意事项

1. **用户名唯一性**：虽然用户名可以修改，但必须保持全局唯一
2. **邮箱不可变**：邮箱是账号的唯一标识，一旦创建就无法修改
3. **自动生成用户名**：邮箱登录自动注册时，如果用户名冲突会添加随机后缀
4. **安全性**：只能修改自己的用户名，不能修改他人的

## 更新日志

- **2024-01-XX**：实现邮箱只读、用户名可修改但唯一的功能
- **2024-01-XX**：优化邮箱登录自动注册的用户名生成策略（随机后缀）
