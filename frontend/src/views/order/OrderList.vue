<template>
  <div class="order-list-page">
    <div class="page-container">
      <!-- Header -->
      <div class="page-header">
        <el-button text @click="$router.back()" class="back-button">
          <el-icon><ArrowLeft /></el-icon>
          {{ $t('common.back') }}
        </el-button>
        <h1 class="page-title">{{ $t('order.myOrders') }}</h1>
      </div>

      <!-- Filter Tabs -->
      <div class="tabs-container">
        <div class="tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.value"
            :class="['tab-btn', { active: currentTab === tab.value }]"
            @click="handleTabChange(tab.value)"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Orders List -->
      <div class="orders-content" v-loading="orderStore.loading">
      <div v-if="orderStore.orders.length > 0" class="orders-list">
        <div 
          v-for="order in orderStore.orders" 
          :key="order.id"
          class="order-card"
          @click="$router.push(`/user/orders/${order.id}`)"
        >
          <div class="order-header">
            <div class="order-info">
              <span class="order-no">{{ $t('order.orderNumber') }}：{{ order.order_no }}</span>
              <span class="order-time">{{ formatDate(order.created_at) }}</span>
            </div>
            <el-tag :type="getStatusType(order.status)" size="large">
              {{ getStatusText(order.status) }}
            </el-tag>
          </div>

          <div class="order-items">
            <div v-for="item in order.items" :key="item.id" class="order-item">
              <div class="item-image-wrapper">
                <img 
                  v-if="item.product_image" 
                  :src="item.product_image" 
                  :alt="item.product_name"
                  class="item-image"
                />
                <div v-else class="item-image-placeholder">
                  <el-icon :size="32"><Picture /></el-icon>
                </div>
              </div>
              <div class="item-info">
                <div class="item-name">{{ item.product_name }}</div>
                <div class="item-detail">
                  <span>¥{{ item.price }} × {{ item.quantity }}</span>
                </div>
              </div>
              <div class="item-subtotal">¥{{ item.subtotal }}</div>
            </div>
          </div>

          <div class="order-footer">
            <div class="order-total">
              <span>{{ $t('order.total') }}：</span>
              <span class="total-amount">¥{{ order.total_amount }}</span>
            </div>
            <div class="order-actions" @click.stop>
              <el-button 
                v-if="order.status === 'pending'"
                size="small"
                @click="handlePay(order.id)"
              >
                {{ $t('order.pay') }}
              </el-button>
              <el-button 
                v-if="order.status === 'pending' || order.status === 'paid'"
                size="small"
                type="danger"
                @click="handleCancel(order.id)"
              >
                {{ $t('order.cancel') }}
              </el-button>
              <el-button 
                v-if="order.status === 'shipped'"
                size="small"
                type="primary"
                @click="handleConfirm(order.id)"
              >
                {{ $t('order.confirm') }}
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <el-empty v-else :description="$t('order.noOrders')" :image-size="120">
        <el-button type="primary" @click="$router.push('/')">{{ $t('order.goShopping') }}</el-button>
      </el-empty>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useOrderStore } from '../../stores/cart';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ArrowLeft, Picture } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const orderStore = useOrderStore();
const currentTab = ref('all');

const tabs = computed(() => [
  { label: t('order.all'), value: 'all' },
  { label: t('order.waitingPayment'), value: 'pending' },
  { label: t('order.waitingShip'), value: 'paid' },
  { label: t('order.waitingReceive'), value: 'shipped' },
  { label: t('order.completed'), value: 'completed' },
]);

onMounted(() => {
  orderStore.fetchOrders();
});

const handleTabChange = (value) => {
  currentTab.value = value;
  const status = value === 'all' ? null : value;
  orderStore.fetchOrders(status);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN');
};

const getStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    paid: 'primary',
    shipped: 'info',
    completed: 'success',
    cancelled: 'danger'
  };
  return typeMap[status] || 'info';
};

const getStatusText = (status) => {
  const statusMap = {
    pending: t('order.pending'),
    paid: t('order.paid'),
    shipped: t('order.shipped'),
    completed: t('order.completed'),
    cancelled: t('order.cancelled')
  };
  return statusMap[status] || status;
};

const handlePay = async (orderId) => {
  try {
    await orderStore.payOrder(orderId);
    ElMessage.success(t('order.paySuccess'));
    orderStore.fetchOrders(currentTab.value === 'all' ? null : currentTab.value);
  } catch (error) {
    ElMessage.error(t('order.payError'));
  }
};

const handleCancel = (orderId) => {
  ElMessageBox.confirm(t('order.confirmCancel'), t('order.confirmTitle'), {
    confirmButtonText: t('order.confirmButton'),
    cancelButtonText: t('order.cancelButton'),
    type: 'warning',
  }).then(async () => {
    try {
      await orderStore.cancelOrder(orderId);
      ElMessage.success(t('order.cancelSuccess'));
      orderStore.fetchOrders(currentTab.value === 'all' ? null : currentTab.value);
    } catch (error) {
      ElMessage.error(t('order.cancelError'));
    }
  }).catch(() => {});
};

const handleConfirm = async (orderId) => {
  try {
    await orderStore.confirmOrder(orderId);
    ElMessage.success(t('order.confirmSuccess'));
    orderStore.fetchOrders(currentTab.value === 'all' ? null : currentTab.value);
  } catch (error) {
    ElMessage.error(t('order.confirmError'));
  }
};
</script>

<style scoped>
.order-list-page {
  min-height: 100vh;
  background-color: #fafafa;
  padding-top: 80px;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.page-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
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

.tabs-container {
  background: #fafafa;
  border-bottom: none;
  padding: 0 0 20px 0;
}

.tabs {
  display: flex;
  gap: 12px;
  background-color: #f0f0f0;
  border-radius: 30px;
  padding: 4px;
}

.tab-btn {
  padding: 10px 24px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  background: transparent;
  border: none;
  border-radius: 26px;
  transition: all 0.3s;
  white-space: nowrap;
}

.tab-btn:hover {
  color: #000;
}

.tab-btn.active {
  color: #000;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.orders-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background: #ffffff;
  border-radius: 24px;
  padding: 24px;
  border: 1px solid #eee;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.3s ease;
}

.order-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
  border-color: var(--color-primary);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #f5f5f5;
  margin-bottom: 16px;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-no {
  font-size: 16px;
  font-weight: 600;
}

.order-time {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background-color: #fafafa;
  border-radius: 16px;
  transition: all 0.2s;
}

.order-item:hover {
  background-color: #f5f5f5;
}

.item-image-wrapper {
  flex-shrink: 0;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
}

.item-image-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-detail {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.item-subtotal {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-price);
  flex-shrink: 0;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f5f5f5;
}

.order-total {
  font-size: 17px;
  font-weight: 600;
}

.total-amount {
  font-size: 22px;
  color: var(--color-price);
  margin-left: 8px;
  font-weight: 700;
}

.order-actions {
  display: flex;
  gap: 8px;
}
</style>
