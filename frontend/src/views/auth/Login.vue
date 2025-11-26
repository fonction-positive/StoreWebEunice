<template>
  <div class="login-page">
    <div class="login-card">
      <!-- Logo -->
      <div class="logo-container">
        <div class="logo">S</div>
      </div>

      <!-- Title -->
      <h1 class="title">欢迎回来</h1>
      <p class="subtitle">登录您的账户以继续</p>

      <!-- Forms Container with Transition -->
      <transition name="fade-slide" mode="out-in">
        <!-- Password Login Form -->
        <el-form 
          v-if="loginMode === 'password'"
          key="password-form"
          ref="formRef"
          :model="form" 
          :rules="rules"
          label-position="top"
          class="login-form"
          :hide-required-asterisk="true"
        >
        <el-form-item prop="username">
          <el-input 
            v-model="form.username" 
            placeholder="请输入用户名或邮箱"
            size="large"
            clearable
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input 
            v-model="form.password" 
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入密码"
            size="large"
            clearable
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
            <template #suffix>
              <el-icon 
                class="password-toggle" 
                @click="showPassword = !showPassword"
              >
                <View v-if="!showPassword" />
                <Hide v-else />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <div class="button-group">
          <el-alert v-if="errorMessage" type="error" :title="errorMessage" show-icon class="login-error-alert" :closable="false" :duration="0" />
          <el-button 
            type="primary" 
            size="large" 
            @click="handleLogin" 
            :loading="loading"
            :disabled="loading"
            class="login-button"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>

          <el-button 
            size="large" 
            @click="$router.push('/register')"
            class="register-button"
          >
            注册新账户
          </el-button>

          <!-- Divider -->
          <div class="divider">
            <span class="divider-line"></span>
            <span class="divider-text">或</span>
            <span class="divider-line"></span>
          </div>

          <!-- Email Login Link -->
          <a class="email-login-link" @click="loginMode = 'email'">
            <svg class="email-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>使用邮箱验证登录</span>
          </a>
        </div>
      </el-form>

      <!-- Email Login Form -->
      <el-form 
        v-else
        key="email-form"
        ref="emailFormRef"
        :model="emailForm" 
        :rules="emailRules"
        label-position="top"
        class="login-form"
        :hide-required-asterisk="true"
      >
        <el-form-item prop="email">
          <el-input 
            v-model="emailForm.email" 
            placeholder="请输入邮箱地址"
            size="large"
            clearable
          >
            <template #prefix>
              <el-icon><Message /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="code">
          <div class="code-input-group">
            <el-input 
              v-model="emailForm.code" 
              placeholder="请输入验证码"
              size="large"
              clearable
              @keyup.enter="handleEmailLogin"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
            <el-button 
              @click="sendCode" 
              :disabled="countdown > 0 || codeSending"
              :loading="codeSending"
              class="code-button"
              size="large"
            >
              {{ countdown > 0 ? `${countdown}秒后重试` : '发送验证码' }}
            </el-button>
          </div>
        </el-form-item>

        <div class="button-group">
          <el-alert v-if="errorMessage" type="error" :title="errorMessage" show-icon class="login-error-alert" :closable="false" :duration="0" />
          <el-button 
            type="primary" 
            size="large" 
            @click="handleEmailLogin" 
            :loading="loading"
            :disabled="loading"
            class="login-button"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>

          <el-button 
            size="large" 
            @click="$router.push('/register')"
            class="register-button"
          >
            注册新账户
          </el-button>

          <!-- Divider -->
          <div class="divider">
            <span class="divider-line"></span>
            <span class="divider-text">或</span>
            <span class="divider-line"></span>
          </div>

          <!-- Email Login Link -->
          <a class="email-login-link" @click="loginMode = 'password'">
            <svg class="email-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>使用账号密码登录</span>
          </a>
        </div>
      </el-form>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useUserStore } from '../../stores/user';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { User, Lock, View, Hide, Message } from '@element-plus/icons-vue';
import axios from '../../api/axios';

const userStore = useUserStore();
const router = useRouter();

// Login mode: 'password' or 'email'
const loginMode = ref('password');

// 监听登录模式切换，重置错误信息
watch(loginMode, () => {
  errorMessage.value = '';
});

// Password login
const formRef = ref(null);
const form = ref({
  username: '',
  password: ''
});

// Email login
const emailFormRef = ref(null);
const emailForm = ref({
  email: '',
  code: ''
});

const loading = ref(false);
const showPassword = ref(false);
const errorMessage = ref('');
const codeSending = ref(false);
const countdown = ref(0);
let countdownTimer = null;

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名或邮箱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ]
};

const emailRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ]
};

// 密码登录
const handleLogin = async () => {
  // 验证表单
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
  } catch (error) {
    ElMessage.warning('请正确填写表单信息');
    return;
  }

  loading.value = true;
  // 清除之前的错误信息
  errorMessage.value = '';
  try {
    await userStore.login(form.value.username, form.value.password);
    ElMessage.success('登录成功！欢迎回来');
    errorMessage.value = '';
    router.push('/');
  } catch (error) {
    let errorMsg = '登录失败，请检查用户名和密码';
    
    // 处理不同的错误情况
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;
      // 如果detail是数组,取第一个元素
      errorMsg = Array.isArray(detail) ? detail[0] : detail;
    } else if (error.response?.data?.message) {
      const message = error.response.data.message;
      errorMsg = Array.isArray(message) ? message[0] : message;
    }
    
    // 清除输入框内容
    form.value.username = '';
    form.value.password = '';
    errorMessage.value = errorMsg;
  } finally {
    loading.value = false;
  }
};

// 发送验证码
const sendCode = async () => {
  // 验证邮箱
  if (!emailFormRef.value) return;
  
  try {
    await emailFormRef.value.validateField('email');
  } catch (error) {
    return;
  }

  codeSending.value = true;
  errorMessage.value = '';
  
  try {
    await axios.post('auth/send_email_code/', {
      email: emailForm.value.email
    });
    
    ElMessage.success('验证码已发送到您的邮箱');
    
    // 开始倒计时
    countdown.value = 60;
    if (countdownTimer) {
      clearInterval(countdownTimer);
    }
    countdownTimer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(countdownTimer);
        countdownTimer = null;
      }
    }, 1000);
  } catch (error) {
    let errorMsg = '发送验证码失败';
    if (error.response?.data?.detail) {
      errorMsg = error.response.data.detail;
    }
    errorMessage.value = errorMsg;
    ElMessage.error(errorMsg);
  } finally {
    codeSending.value = false;
  }
};

// 邮箱验证码登录
const handleEmailLogin = async () => {
  // 验证表单
  if (!emailFormRef.value) return;
  
  try {
    await emailFormRef.value.validate();
  } catch (error) {
    ElMessage.warning('请正确填写表单信息');
    return;
  }

  loading.value = true;
  errorMessage.value = '';
  
  try {
    const response = await axios.post('auth/email_login/', {
      email: emailForm.value.email,
      code: emailForm.value.code
    });
    
    // 保存token和用户信息
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    
    // 更新用户store
    userStore.accessToken = response.data.access;
    userStore.refreshToken = response.data.refresh;
    userStore.user = response.data.user;
    
    ElMessage.success('登录成功！欢迎');
    router.push('/');
  } catch (error) {
    let errorMsg = '登录失败';
    if (error.response?.data?.detail) {
      errorMsg = error.response.data.detail;
    }
    
    emailForm.value.code = '';
    errorMessage.value = errorMsg;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f7;
  padding: var(--spacing-xl);
}

.login-card {
  background: white;
  border-radius: 24px;
  padding: 48px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.logo {
  width: 72px;
  height: 72px;
  background: #1d1d1f;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  color: white;
  letter-spacing: -0.02em;
}

.title {
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  color: #1d1d1f;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 15px;
  text-align: center;
  color: #86868b;
  margin-bottom: 24px;
}

.divider {
  display: flex;
  align-items: center;
  margin: 10px 0;
  color: #86868b;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: #d2d2d7;
}

.divider-text {
  padding: 0 16px;
  font-size: 14px;
  color: #86868b;
}

.email-login-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 15px;
  font-weight: 400;
  color: #1d1d1f;
  text-decoration: none;
}

.email-login-link:hover {
  transform: scale(1.05);
}

.email-icon {
  width: 18px;
  height: 18px;
  transition: all 0.2s ease;
}

.email-login-link:hover .email-icon {
  transform: scale(1.1);
}

/* 表单切换过渡效果 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(15px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-15px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 16px;
}

.login-form :deep(.el-form-item__label) {
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 8px;
  padding: 0;
  line-height: 1.5;
}

.login-form :deep(.el-form-item__error) {
  font-size: 13px;
  margin-top: 6px;
  color: #ff3b30;
}

.login-form :deep(.el-input__wrapper) {
  background-color: #f5f5f7;
  border: none;
  box-shadow: none;
  border-radius: 12px;
  padding: 12px 16px;
  transition: all 0.2s ease;
}

.login-form :deep(.el-input__wrapper:hover) {
  background-color: #ebebed;
}

.login-form :deep(.el-input__wrapper.is-focus) {
  background-color: #ebebed;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.login-form :deep(.el-input__inner) {
  font-size: 15px;
}

.login-form :deep(.el-input__prefix),
.login-form :deep(.el-input__suffix) {
  color: #86868b;
}

.password-toggle {
  cursor: pointer;
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: #1d1d1f;
}

.code-input-group {
  display: flex;
  gap: 12px;
  width: 100%;
  align-items: center;
}

.code-input-group :deep(.el-input) {
  flex: 1;
}

.code-button {
  min-width: 120px;
  background: #f5f5f7;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #1d1d1f;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.code-button:hover:not(:disabled) {
  background: #ebebed;
}

.code-button:disabled {
  background: #f5f5f7;
  color: #86868b;
  cursor: not-allowed;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
  align-items: stretch;
}

.button-group .el-button + .el-button {
  margin-left: 0;
}

.login-error-alert {
  margin-bottom: 12px;
}

.login-button {
  width: 100%;
  height: 52px;
  background: #1d1d1f;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(29, 29, 31, 0.3);
  position: relative;
  overflow: hidden;
}

.login-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.login-button:hover::before {
  left: 100%;
}

.login-button:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 24px rgba(29, 29, 31, 0.4);
}

.login-button:active {
  transform: translateY(0) scale(0.98);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.register-button {
  width: 100%;
  height: 52px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #d2d2d7;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  color: #1d1d1f;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.register-button :deep(span) {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.register-button:hover {
  background: rgba(255, 255, 255, 0.8) !important;
  border-color: #d2d2d7 !important;
  color: #1d1d1f !important;
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.register-button:active {
  transform: scale(0.98);
}

@media (max-width: 768px) {
  .login-card {
    padding: 32px 24px;
  }

  .title {
    font-size: 24px;
  }
  
  .code-input-group {
    flex-direction: column;
  }
  
  .code-button {
    width: 100%;
  }
}
</style>
