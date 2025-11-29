<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- Page Header -->
      <div class="page-header">
        <el-button text @click="$router.back()" class="back-button">
          <el-icon><ArrowLeft /></el-icon>
          {{ $t('profile.back') }}
        </el-button>
        <h1 class="page-title">{{ $t('profile.title') }}</h1>
      </div>

      <div class="content">
        <!-- User Info Card -->
        <div class="user-card card">
          <div class="user-info">
            <div class="avatar-wrapper">
              <el-upload
                class="avatar-upload"
                action="#"
                :show-file-list="false"
                :auto-upload="false"
                :on-change="handleAvatarChange"
              >
                <img v-if="avatarUrl" :src="avatarUrl" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </div>
            <div class="user-details">
              <h2 class="user-name">{{ profileForm.username || 'User' }}</h2>
              <p class="user-email">{{ profileForm.email }}</p>
              <el-button class="edit-profile-btn" @click="activeSection = 'basic'">
                {{ $t('profile.editProfile') }}
              </el-button>
            </div>
          </div>
        </div>

        <!-- Stats Row -->
        <div class="stats-row">
          <div class="stat-card card">
            <span class="stat-value">{{ orderCount }}</span>
            <span class="stat-label">{{ $t('profile.orders') }}</span>
          </div>
          <div class="stat-card card">
            <span class="stat-value">{{ favoriteCount }}</span>
            <span class="stat-label">{{ $t('profile.favorites') }}</span>
          </div>
          <div class="stat-card card">
            <span class="stat-value">{{ reviewCount }}</span>
            <span class="stat-label">{{ $t('profile.reviews') }}</span>
          </div>
        </div>

        <!-- Menu List -->
        <div class="menu-list">
          <div class="menu-item card" @click="activeSection = 'basic'">
            <div class="menu-left">
              <div class="menu-icon-wrapper">
                <el-icon :size="20"><User /></el-icon>
              </div>
              <span class="menu-label">{{ $t('profile.basicInfo') }}</span>
            </div>
            <el-icon class="menu-arrow"><ArrowRight /></el-icon>
          </div>

          <div class="menu-item card" @click="activeSection = 'address'">
            <div class="menu-left">
              <div class="menu-icon-wrapper">
                <el-icon :size="20"><Location /></el-icon>
              </div>
              <span class="menu-label">{{ $t('profile.address') }}</span>
            </div>
            <div class="menu-right">
              <span class="badge">{{ addressStore.addresses.length }}</span>
              <el-icon class="menu-arrow"><ArrowRight /></el-icon>
            </div>
          </div>

          <div class="menu-item card" @click="activeSection = 'security'">
            <div class="menu-left">
              <div class="menu-icon-wrapper">
                <el-icon :size="20"><Lock /></el-icon>
              </div>
              <span class="menu-label">{{ $t('profile.security') }}</span>
            </div>
            <el-icon class="menu-arrow"><ArrowRight /></el-icon>
          </div>
        </div>

        <!-- Support Section -->
        <div class="support-section card">
          <h3 class="section-title">{{ $t('profile.support') }}</h3>
          <div class="support-list">
            <div class="support-item">
              <span class="support-label">{{ $t('profile.helpCenter') }}</span>
            </div>
            <div class="support-item">
              <span class="support-label">{{ $t('profile.privacyPolicy') }}</span>
            </div>
            <div class="support-item">
              <span class="support-label">{{ $t('profile.termsOfService') }}</span>
            </div>
          </div>
        </div>

        <!-- Logout Button -->
        <button class="logout-btn" @click="handleLogout">
          <el-icon style="margin-right: 8px;"><SwitchButton /></el-icon>
          {{ $t('profile.logout') }}
        </button>
      </div>
    </div>

    <!-- Detail Dialogs -->
    <!-- Basic Info Dialog -->
    <el-dialog 
      v-model="showBasicDialog" 
      :title="$t('profile.basicInfo')" 
      width="600px"
    >
      <el-form :model="profileForm" label-position="top">
        <el-form-item :label="$t('profile.username')">
          <el-input v-model="profileForm.username" />
        </el-form-item>
        <el-form-item :label="$t('profile.email')">
          <el-input v-model="profileForm.email" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showBasicDialog = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleUpdateProfile" :loading="loading">
          {{ $t('common.save') }}
        </el-button>
      </template>
    </el-dialog>

    <!-- Address Dialog -->
    <el-dialog 
      v-model="showAddressListDialog" 
      :title="$t('profile.addressManage')" 
      width="800px"
    >
      <div class="dialog-header">
        <el-button type="primary" @click="openAddressDialog()">
          {{ $t('profile.addAddress') }}
        </el-button>
      </div>

      <div v-if="addressStore.addresses.length > 0" class="address-grid">
        <div 
          v-for="addr in addressStore.addresses" 
          :key="addr.id"
          class="address-card"
        >
          <div class="address-header">
            <span class="recipient">{{ addr.recipient_name }}</span>
            <span class="phone">{{ addr.phone }}</span>
            <el-tag v-if="addr.is_default" type="success" size="small">
              {{ $t('profile.default') }}
            </el-tag>
          </div>
          <p class="address-detail">
            {{ addr.province }} {{ addr.city }} {{ addr.district }}<br>
            {{ addr.address }}
          </p>
          <div class="address-actions">
            <el-button link type="primary" @click="openAddressDialog(addr)">
              {{ $t('profile.edit') }}
            </el-button>
            <el-button link type="danger" @click="handleDeleteAddress(addr.id)">
              {{ $t('profile.delete') }}
            </el-button>
            <el-button 
              v-if="!addr.is_default" 
              link 
              type="success" 
              @click="handleSetDefault(addr)"
            >
              {{ $t('profile.setAsDefault') }}
            </el-button>
          </div>
        </div>
      </div>
      <el-empty v-else :description="$t('profile.noAddress')" />
    </el-dialog>

    <!-- Address Edit Dialog -->
    <el-dialog 
      v-model="showAddressDialog" 
      :title="editingAddress ? $t('profile.editAddress') : $t('profile.addAddress')" 
      width="500px"
    >
      <el-form :model="addressForm" label-position="top">
        <el-form-item :label="$t('profile.recipient')">
          <el-input v-model="addressForm.recipient_name" />
        </el-form-item>
        <el-form-item :label="$t('profile.phone')">
          <el-input v-model="addressForm.phone" />
        </el-form-item>
        <el-form-item :label="$t('profile.province')">
          <el-input v-model="addressForm.province" />
        </el-form-item>
        <el-form-item :label="$t('profile.city')">
          <el-input v-model="addressForm.city" />
        </el-form-item>
        <el-form-item :label="$t('profile.district')">
          <el-input v-model="addressForm.district" />
        </el-form-item>
        <el-form-item :label="$t('profile.detailAddress')">
          <el-input v-model="addressForm.address" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="addressForm.is_default">
            {{ $t('profile.setDefault') }}
          </el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddressDialog = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSaveAddress" :loading="loading">
          {{ $t('common.save') }}
        </el-button>
      </template>
    </el-dialog>

    <!-- Security Dialog -->
    <el-dialog 
      v-model="showSecurityDialog" 
      :title="$t('profile.security')" 
      width="600px"
    >
      <h3 class="dialog-section-title">{{ $t('profile.changePassword') }}</h3>
      <el-form 
        ref="passwordFormRef"
        :model="passwordForm" 
        :rules="passwordRules" 
        label-position="top"
      >
        <el-form-item :label="$t('profile.oldPassword')" prop="old_password">
          <el-input v-model="passwordForm.old_password" type="password" show-password />
        </el-form-item>
        <el-form-item :label="$t('profile.newPassword')" prop="new_password">
          <el-input v-model="passwordForm.new_password" type="password" show-password />
        </el-form-item>
        <el-form-item :label="$t('profile.confirmPassword')" prop="confirm_password">
          <el-input v-model="passwordForm.confirm_password" type="password" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleChangePassword" :loading="passwordLoading">
            {{ $t('profile.changePassword') }}
          </el-button>
        </el-form-item>
      </el-form>

      <el-divider />

      <h3 class="dialog-section-title">{{ $t('profile.forgotPassword') }}</h3>
      <p class="section-description">{{ $t('profile.forgotPasswordDesc') }}</p>
      <el-form 
        ref="resetPasswordFormRef"
        :model="resetPasswordForm" 
        :rules="resetPasswordRules" 
        label-position="top"
      >
        <el-form-item :label="$t('profile.emailCode')" prop="code">
          <div style="display: flex; gap: 10px;">
            <el-input 
              v-model="resetPasswordForm.code" 
              :placeholder="$t('profile.codePlaceholder')"
              maxlength="6"
            />
            <el-button 
              @click="handleSendResetCode" 
              :disabled="resetCountdown > 0"
              style="width: 140px;"
            >
              {{ resetCountdown > 0 ? $t('profile.retryAfter', { count: resetCountdown }) : $t('profile.sendCode') }}
            </el-button>
          </div>
          <div class="form-tip">{{ $t('profile.codeWillSendTo') }}{{ userStore.user?.email }}</div>
        </el-form-item>
        <el-form-item :label="$t('profile.newPassword')" prop="new_password">
          <el-input 
            v-model="resetPasswordForm.new_password" 
            type="password" 
            show-password 
            :placeholder="$t('profile.newPasswordPlaceholder')"
          />
        </el-form-item>
        <el-form-item :label="$t('profile.confirmPassword')" prop="confirm_new_password">
          <el-input 
            v-model="resetPasswordForm.confirm_new_password" 
            type="password" 
            show-password 
            :placeholder="$t('profile.confirmNewPasswordPlaceholder')"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleResetPassword" :loading="resetPasswordLoading">
            {{ $t('profile.resetPassword') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, watch } from 'vue';
import { useUserStore } from '../../stores/user';
import { useAddressStore } from '../../stores/cart';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, ArrowLeft, ArrowRight, User, Location, Lock, SwitchButton } from '@element-plus/icons-vue';
import api from '../../api/axios';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();
const addressStore = useAddressStore();

const activeSection = ref('');
const loading = ref(false);
const passwordLoading = ref(false);
const resetPasswordLoading = ref(false);

// Stats
const orderCount = ref(12);
const favoriteCount = ref(24);
const reviewCount = ref(5);

// Dialogs
const showBasicDialog = computed({
  get: () => activeSection.value === 'basic',
  set: (val) => { if (!val) activeSection.value = ''; }
});

const showAddressListDialog = computed({
  get: () => activeSection.value === 'address',
  set: (val) => { if (!val) activeSection.value = ''; }
});

const showSecurityDialog = computed({
  get: () => activeSection.value === 'security',
  set: (val) => { if (!val) activeSection.value = ''; }
});

// Basic Info
const profileForm = reactive({
  username: '',
  email: ''
});
const avatarUrl = ref('');
const avatarFile = ref(null);

// Address
const showAddressDialog = ref(false);
const editingAddress = ref(null);
const addressForm = reactive({
  recipient_name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  address: '',
  is_default: false
});

// Reset Password
const resetPasswordFormRef = ref(null);
const resetPasswordForm = reactive({
  code: '',
  new_password: '',
  confirm_new_password: ''
});
const resetCountdown = ref(0);

// Password
const passwordFormRef = ref(null);
const passwordForm = reactive({
  old_password: '',
  new_password: '',
  confirm_password: ''
});

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== passwordForm.new_password) {
    callback(new Error(t('profile.passwordMismatch')));
  } else {
    callback();
  }
};

const validateConfirmResetPassword = (rule, value, callback) => {
  if (value !== resetPasswordForm.new_password) {
    callback(new Error(t('profile.passwordMismatch')));
  } else {
    callback();
  }
};

const passwordRules = computed(() => ({
  old_password: [{ required: true, message: t('profile.oldPasswordRequired'), trigger: 'blur' }],
  new_password: [
    { required: true, message: t('profile.newPasswordRequired'), trigger: 'blur' },
    { min: 6, message: t('profile.passwordMinLength'), trigger: 'blur' }
  ],
  confirm_password: [
    { required: true, message: t('profile.confirmPasswordRequired'), trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}));

const resetPasswordRules = computed(() => ({
  code: [
    { required: true, message: t('profile.codeRequired'), trigger: 'blur' },
    { len: 6, message: t('profile.codeLength'), trigger: 'blur' }
  ],
  new_password: [
    { required: true, message: t('profile.newPasswordRequired'), trigger: 'blur' },
    { min: 6, message: t('profile.passwordMinLength'), trigger: 'blur' }
  ],
  confirm_new_password: [
    { required: true, message: t('profile.confirmPasswordRequired'), trigger: 'blur' },
    { validator: validateConfirmResetPassword, trigger: 'blur' }
  ]
}));

onMounted(async () => {
  if (userStore.user) {
    initProfileForm();
  } else {
    await userStore.fetchUser();
    initProfileForm();
  }
  await addressStore.fetchAddresses();
});

const initProfileForm = () => {
  if (userStore.user) {
    profileForm.username = userStore.user.username;
    profileForm.email = userStore.user.email;
    avatarUrl.value = userStore.user.avatar;
  }
};

// Profile Actions
const handleAvatarChange = (file) => {
  avatarFile.value = file.raw;
  avatarUrl.value = URL.createObjectURL(file.raw);
};

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
    ElMessage.success(t('profile.profileUpdated'));
    showBasicDialog.value = false;
  } catch (error) {
    if (error.response?.data?.username) {
      ElMessage.error(error.response.data.username[0] || t('profile.usernameExists'));
    } else {
      ElMessage.error(error.response?.data?.message || t('profile.updateFailed'));
    }
  } finally {
    loading.value = false;
  }
};

// Address Actions
const openAddressDialog = (address = null) => {
  editingAddress.value = address;
  if (address) {
    Object.assign(addressForm, {
      recipient_name: address.recipient_name,
      phone: address.phone,
      province: address.province,
      city: address.city,
      district: address.district,
      address: address.address,
      is_default: address.is_default
    });
  } else {
    Object.assign(addressForm, {
      recipient_name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      address: '',
      is_default: false
    });
  }
  showAddressDialog.value = true;
};

const handleSaveAddress = async () => {
  loading.value = true;
  try {
    if (editingAddress.value) {
      await addressStore.updateAddress(editingAddress.value.id, addressForm);
      ElMessage.success(t('profile.addressUpdated'));
    } else {
      await addressStore.createAddress(addressForm);
      ElMessage.success(t('profile.addressAdded'));
    }
    await addressStore.fetchAddresses();
    showAddressDialog.value = false;
  } catch (error) {
    ElMessage.error(t('profile.saveFailed'));
  } finally {
    loading.value = false;
  }
};

const handleDeleteAddress = (id) => {
  ElMessageBox.confirm(t('profile.confirmDelete'), t('profile.confirmTitle'), {
    type: 'warning'
  }).then(async () => {
    try {
      await addressStore.deleteAddress(id);
      await addressStore.fetchAddresses();
      ElMessage.success(t('profile.deleteSuccess'));
    } catch (error) {
      ElMessage.error(t('profile.deleteFailed'));
    }
  });
};

const handleSetDefault = async (address) => {
  try {
    await addressStore.updateAddress(address.id, { ...address, is_default: true });
    await addressStore.fetchAddresses();
    ElMessage.success(t('profile.setSuccess'));
  } catch (error) {
    ElMessage.error(t('profile.setFailed'));
  }
};

// Password Actions
const handleChangePassword = async () => {
  if (!passwordFormRef.value) return;
  
  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      passwordLoading.value = true;
      try {
        await userStore.changePassword({
          old_password: passwordForm.old_password,
          new_password: passwordForm.new_password
        });
        ElMessage.success(t('profile.passwordChanged'));
        passwordForm.old_password = '';
        passwordForm.new_password = '';
        passwordForm.confirm_password = '';
      } catch (error) {
        ElMessage.error(error.response?.data?.old_password?.[0] || t('profile.passwordChangeFailed'));
      } finally {
        passwordLoading.value = false;
      }
    }
  });
};

// Reset Password Actions
const startResetCountdown = () => {
  resetCountdown.value = 60;
  const timer = setInterval(() => {
    resetCountdown.value--;
    if (resetCountdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};

const handleSendResetCode = async () => {
  try {
    await api.post('auth/send_reset_code/');
    ElMessage.success(t('profile.codeSent'));
    startResetCountdown();
  } catch (error) {
    const detail = error.response?.data?.detail;
    if (detail) {
      ElMessage.error(detail);
    } else {
      ElMessage.error(t('profile.codeSendFailed'));
    }
  }
};

const handleResetPassword = async () => {
  if (!resetPasswordFormRef.value) return;
  
  await resetPasswordFormRef.value.validate(async (valid) => {
    if (valid) {
      resetPasswordLoading.value = true;
      try {
        await api.post('auth/reset_password/', {
          code: resetPasswordForm.code,
          new_password: resetPasswordForm.new_password
        });
        ElMessage.success(t('profile.resetSuccess'));
        resetPasswordForm.code = '';
        resetPasswordForm.new_password = '';
        resetPasswordForm.confirm_new_password = '';
        resetPasswordFormRef.value.resetFields();
      } catch (error) {
        const detail = error.response?.data?.detail;
        if (detail) {
          ElMessage.error(detail);
        } else {
          ElMessage.error(t('profile.resetFailed'));
        }
      } finally {
        resetPasswordLoading.value = false;
      }
    }
  });
};

const handleLogout = () => {
  ElMessageBox.confirm(
    t('profile.confirmLogout'),
    t('profile.confirmTitle'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning',
    }
  ).then(() => {
    userStore.logout();
    router.push('/login');
  });
};
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: #fafafa;
  padding-top: 80px;
}

.profile-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.page-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.back-button {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-primary);
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Card Base Style */
.card {
  background-color: #ffffff;
  border-radius: 24px;
  padding: 24px;
  border: 1px solid #eee;
  transition: all 0.2s;
}

/* User Info Card */
.user-card {
  padding: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar-wrapper {
  flex-shrink: 0;
}

.avatar-upload {
  border: 1px dashed var(--color-border);
  border-radius: 50%;
  cursor: pointer;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: border-color 0.3s;
}

.avatar-upload:hover {
  border-color: var(--color-primary);
}

.avatar {
  width: 80px;
  height: 80px;
  object-fit: cover;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.user-email {
  font-size: 14px;
  color: #999;
  margin: 0 0 12px 0;
}

.edit-profile-btn {
  background-color: #f5f5f5;
  border: none;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 12px;
  font-weight: 600;
  color: #000;
}

/* Stats Row */
.stats-row {
  display: flex;
  gap: 12px;
}

.stat-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

/* Menu List */
.menu-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  cursor: pointer;
}

.menu-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: var(--color-primary);
}

.menu-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-icon-wrapper {
  width: 36px;
  height: 36px;
  background-color: #f5f5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-label {
  font-weight: 600;
  font-size: 15px;
}

.menu-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.badge {
  background-color: #000;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-arrow {
  color: #ccc;
}

/* Support Section */
.support-section {
  padding: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 20px 0;
}

.support-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.support-label {
  font-weight: 500;
  font-size: 15px;
}

/* Logout Button */
.logout-btn {
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #eee;
  border-radius: 30px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  color: #000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.logout-btn:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: var(--color-primary);
}

/* Dialog Styles */
.dialog-header {
  margin-bottom: 20px;
}

.dialog-section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.section-description {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}

.form-tip {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-top: 4px;
}

/* Address Grid */
.address-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.address-card {
  border: 2px solid var(--color-border);
  border-radius: 16px;
  padding: 16px;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.address-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  border-color: var(--color-primary);
}

.address-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.recipient {
  font-weight: 600;
  font-size: 16px;
}

.phone {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.address-detail {
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 12px;
  min-height: 42px;
}

.address-actions {
  display: flex;
  gap: 8px;
  border-top: 1px solid var(--color-border);
  padding-top: 8px;
}
</style>
