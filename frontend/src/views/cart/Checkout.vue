<template>
  <div class="checkout-page">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <el-button text @click="$router.back()" class="back-button">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <h1 class="page-title">确认订单</h1>
      </div>
    </header>

    <!-- Checkout Content -->
    <div class="checkout-container" v-loading="loading">
      <!-- Address Section -->
      <div class="section address-section">
        <h2 class="section-title">收货地址</h2>
        <div v-if="addressStore.addresses.length > 0" class="address-list">
          <div 
            v-for="addr in addressStore.addresses" 
            :key="addr.id"
            :class="['address-card', { selected: selectedAddress?.id === addr.id }]"
            @click="selectedAddress = addr"
          >
            <div class="address-info">
              <div class="address-header">
                <span class="recipient">{{ addr.recipient_name }}</span>
                <span class="phone">{{ addr.phone }}</span>
                <el-tag v-if="addr.is_default" type="success" size="small">默认</el-tag>
              </div>
              <p class="address-detail">
                {{ addr.province }} {{ addr.city }} {{ addr.district }} {{ addr.address }}
              </p>
            </div>
            <el-icon v-if="selectedAddress?.id === addr.id" class="check-icon" :size="24">
              <CircleCheck />
            </el-icon>
          </div>
        </div>
        <el-empty v-else description="暂无收货地址">
          <el-button type="primary" @click="showAddressDialog = true">添加地址</el-button>
        </el-empty>
      </div>

      <!-- Items Section -->
      <div class="section items-section">
        <h2 class="section-title">商品清单</h2>
        <div class="items-list">
          <div v-for="item in checkoutItems" :key="item.id" class="item-row">
            <img 
              v-if="item.product_detail.main_image" 
              :src="item.product_detail.main_image.image" 
              class="item-image"
            />
            <div class="item-info">
              <h3>{{ item.product_detail.name }}</h3>
              <p class="item-price">¥{{ item.product_detail.price }} × {{ item.quantity }}</p>
            </div>
            <div class="item-subtotal">¥{{ item.subtotal }}</div>
          </div>
        </div>
      </div>

      <!-- Summary Section -->
      <div class="section summary-section">
        <div class="summary-row">
          <span>商品总价</span>
          <span>¥{{ totalAmount }}</span>
        </div>
        <div class="summary-row total">
          <span>应付总额</span>
          <span class="total-price">¥{{ totalAmount }}</span>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="submit-section">
        <el-button 
          type="primary" 
          size="large" 
          @click="handleSubmit"
          :disabled="!selectedAddress"
          class="submit-btn"
        >
          提交订单
        </el-button>
      </div>
    </div>

    <!-- Add Address Dialog -->
    <el-dialog v-model="showAddressDialog" title="添加收货地址" width="500px">
      <el-form :model="addressForm" label-position="top">
        <el-form-item label="收货人">
          <el-input v-model="addressForm.recipient_name" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="addressForm.phone" />
        </el-form-item>
        <el-form-item label="省份">
          <el-input v-model="addressForm.province" />
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="addressForm.city" />
        </el-form-item>
        <el-form-item label="区县">
          <el-input v-model="addressForm.district" />
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="addressForm.address" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="addressForm.is_default">设为默认地址</el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddressDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAddAddress">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAddressStore, useOrderStore } from '../../stores/cart';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { ArrowLeft, CircleCheck } from '@element-plus/icons-vue';

const addressStore = useAddressStore();
const orderStore = useOrderStore();
const router = useRouter();

const checkoutItems = ref([]);
const selectedAddress = ref(null);
const loading = ref(false);
const showAddressDialog = ref(false);
const addressForm = ref({
  recipient_name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  address: '',
  is_default: false
});

const totalAmount = computed(() => {
  return checkoutItems.value.reduce((sum, item) => sum + parseFloat(item.subtotal), 0).toFixed(2);
});

onMounted(async () => {
  // 从 sessionStorage 获取结算商品
  const items = sessionStorage.getItem('checkoutItems');
  if (items) {
    checkoutItems.value = JSON.parse(items);
  } else {
    ElMessage.warning('没有要结算的商品');
    router.push('/cart');
    return;
  }

  // 获取地址列表
  await addressStore.fetchAddresses();
  // 默认选中默认地址
  selectedAddress.value = addressStore.defaultAddress;
});

const handleAddAddress = async () => {
  try {
    const response = await addressStore.createAddress(addressForm.value);
    await addressStore.fetchAddresses();
    
    // 如果是第一个地址，或者新添加的地址被设为默认，则自动选中
    if (addressStore.addresses.length === 1 || addressForm.value.is_default) {
      // 找到新添加的地址（通过ID匹配）
      const newAddress = addressStore.addresses.find(addr => addr.id === response.data.id);
      if (newAddress) {
        selectedAddress.value = newAddress;
      }
    }
    
    showAddressDialog.value = false;
    ElMessage.success('地址添加成功');
    // 重置表单
    addressForm.value = {
      recipient_name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      address: '',
      is_default: false
    };
  } catch (error) {
    ElMessage.error('添加失败');
  }
};

const handleSubmit = async () => {
  if (!selectedAddress.value) {
    ElMessage.warning('请选择收货地址');
    return;
  }

  loading.value = true;
  try {
    // 准备订单数据
    const items = checkoutItems.value.map(item => ({
      product_id: item.product,
      quantity: item.quantity
    }));

    // 创建订单
    const response = await orderStore.createOrder(selectedAddress.value.id, items);
    const orderId = response.data.id;

    // 模拟支付
    await orderStore.payOrder(orderId);

    ElMessage.success('订单提交成功！');
    sessionStorage.removeItem('checkoutItems');
    router.push(`/user/orders/${orderId}`);
  } catch (error) {
    ElMessage.error(error.response?.data?.error || '订单提交失败');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background-color: var(--color-bg-secondary);
}

.header {
  background-color: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing-md) var(--spacing-xl);
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.back-button {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-primary);
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}

.checkout-container {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-xl);
}

.section {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.address-card {
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.address-card:hover {
  border-color: var(--color-primary);
}

.address-card.selected {
  border-color: var(--color-primary);
  background-color: rgba(0, 122, 255, 0.05);
}

.address-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.recipient {
  font-size: 17px;
  font-weight: 600;
}

.phone {
  color: var(--color-text-secondary);
}

.address-detail {
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.check-icon {
  color: var(--color-primary);
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.item-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  background-color: var(--color-bg-secondary);
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

.item-info {
  flex: 1;
}

.item-info h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.item-price {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.item-subtotal {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-price);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-md) 0;
  font-size: 15px;
}

.summary-row.total {
  border-top: 1px solid var(--color-border);
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-lg);
  font-size: 17px;
  font-weight: 600;
}

.total-price {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-price);
}

.submit-section {
  text-align: center;
}

.submit-btn {
  width: 100%;
  max-width: 400px;
  height: 56px;
  font-size: 17px;
  font-weight: 600;
}
</style>
