<template>
  <div class="profile-page">
    <div class="profile-container">
      <div class="page-header">
        <el-button text @click="$router.back()" class="back-button">
          <el-icon><ArrowLeft /></el-icon>
          {{ $t('profile.back') }}
        </el-button>
        <h1 class="page-title">{{ $t('profile.title') }}</h1>
      </div>
      
      <el-tabs v-model="activeTab" class="profile-tabs" type="border-card">
        <!-- 基本信息 -->
        <el-tab-pane :label="$t('profile.basicInfo')" name="basic">
          <div class="tab-content">
            <h2 class="section-title">{{ $t('profile.basicInfo') }}</h2>
            <el-form :model="profileForm" label-position="top" class="profile-form">
              <el-form-item :label="$t('profile.avatar')">
                <div class="avatar-uploader">
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
                  <div class="avatar-tip">{{ $t('profile.avatarTip') }}</div>
                </div>
              </el-form-item>

              <el-form-item :label="$t('profile.username')">
                <el-input v-model="profileForm.username" />
              </el-form-item>

              <el-form-item :label="$t('profile.email')">
                <el-input v-model="profileForm.email" disabled />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="handleUpdateProfile" :loading="loading">{{ $t('profile.saveChanges') }}</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <!-- 收货地址 -->
        <el-tab-pane :label="$t('profile.address')" name="address">
          <div class="tab-content">
            <div class="section-header">
              <h2 class="section-title">{{ $t('profile.addressManage') }}</h2>
              <el-button type="primary" @click="openAddressDialog()">{{ $t('profile.addAddress') }}</el-button>
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
                  <el-tag v-if="addr.is_default" type="success" size="small">{{ $t('profile.default') }}</el-tag>
                </div>
                <p class="address-detail">
                  {{ addr.province }} {{ addr.city }} {{ addr.district }}<br>
                  {{ addr.address }}
                </p>
                <div class="address-actions">
                  <el-button link type="primary" @click="openAddressDialog(addr)">{{ $t('profile.edit') }}</el-button>
                  <el-button link type="danger" @click="handleDeleteAddress(addr.id)">{{ $t('profile.delete') }}</el-button>
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
          </div>
        </el-tab-pane>

        <!-- 安全设置 -->
        <el-tab-pane :label="$t('profile.security')" name="security">
          <div class="tab-content">
            <h2 class="section-title">{{ $t('profile.changePassword') }}</h2>
            <el-form 
              ref="passwordFormRef"
              :model="passwordForm" 
              :rules="passwordRules" 
              label-position="top" 
              class="password-form"
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
                <el-button type="primary" @click="handleChangePassword" :loading="passwordLoading">{{ $t('profile.changePassword') }}</el-button>
              </el-form-item>
            </el-form>

            <el-divider />

            <h2 class="section-title">{{ $t('profile.forgotPassword') }}</h2>
            <p class="section-description">{{ $t('profile.forgotPasswordDesc') }}</p>
            <el-form 
              ref="resetPasswordFormRef"
              :model="resetPasswordForm" 
              :rules="resetPasswordRules" 
              label-position="top" 
              class="password-form"
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
                <el-button type="primary" @click="handleResetPassword" :loading="resetPasswordLoading">{{ $t('profile.resetPassword') }}</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- Address Dialog -->
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
          <el-checkbox v-model="addressForm.is_default">{{ $t('profile.setDefault') }}</el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddressDialog = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSaveAddress" :loading="loading">{{ $t('common.save') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { useUserStore } from '../../stores/user';
import { useAddressStore } from '../../stores/cart';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, ArrowLeft } from '@element-plus/icons-vue';
import api from '../../api/axios';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const userStore = useUserStore();
const addressStore = useAddressStore();

const activeTab = ref('basic');
const loading = ref(false);
const passwordLoading = ref(false);
const resetPasswordLoading = ref(false);

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
  } catch (error) {
    // 处理用户名重复错误
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
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: var(--color-bg-secondary);
  padding-top: 80px; /* Space for fixed navbar */
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
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.profile-tabs {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  min-height: 500px;
}

.tab-content {
  padding: var(--spacing-lg);
  max-width: 600px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: var(--spacing-xl);
  color: var(--color-text-primary);
}

.section-description {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.form-tip {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-top: 5px;
}

/* Avatar Upload */
.avatar-uploader {
  text-align: center;
}

.avatar-upload {
  border: 1px dashed var(--color-border);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.3s;
}

.avatar-upload:hover {
  border-color: var(--color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  text-align: center;
  line-height: 120px;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
  object-fit: cover;
}

.avatar-tip {
  margin-top: 8px;
  font-size: 12px;
  color: var(--color-text-secondary);
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
  gap: var(--spacing-lg);
}

.address-card {
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  position: relative;
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
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
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
  margin-bottom: var(--spacing-md);
  min-height: 42px;
}

.address-actions {
  display: flex;
  gap: var(--spacing-sm);
  border-top: 1px solid var(--color-border);
  padding-top: var(--spacing-sm);
}
</style>
