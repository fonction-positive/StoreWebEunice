<template>
  <div class="order-detail-page" v-if="orderStore.currentOrder">
    <div class="page-container">
      <!-- Header -->
      <div class="page-header">
        <el-button text @click="$router.back()" class="back-button">
          <el-icon><ArrowLeft /></el-icon>
          {{ $t('order.back') }}
        </el-button>
        <h1 class="page-title">{{ $t('order.detail') }}</h1>
      </div>

      <!-- Status Card -->
      <div class="status-card card">
        <div class="status-icon-wrapper">
          <el-icon :size="48" :color="getStatusColor(orderStore.currentOrder.status)">
            <component :is="getStatusIconComponent(orderStore.currentOrder.status)" />
          </el-icon>
        </div>
        <h2 class="status-title">{{ getStatusText(orderStore.currentOrder.status) }}</h2>
        <div class="order-meta">
          <p>{{ $t('order.orderNumber') }}：{{ orderStore.currentOrder.order_no }}</p>
          <p>{{ $t('order.orderDate') }}：{{ formatDate(orderStore.currentOrder.created_at) }}</p>
        </div>
      </div>

      <!-- Shipping Info Card -->
      <div class="info-card card">
        <h2 class="card-title">{{ $t('order.shippingInfo') }}</h2>
        <div class="info-list">
          <div class="info-item">
            <span class="info-label">{{ $t('order.recipient') }}</span>
            <span class="info-value">{{ orderStore.currentOrder.shipping_name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t('order.phone') }}</span>
            <span class="info-value">{{ orderStore.currentOrder.shipping_phone }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t('order.address') }}</span>
            <span class="info-value">
              {{ orderStore.currentOrder.shipping_province }}
              {{ orderStore.currentOrder.shipping_city }}
              {{ orderStore.currentOrder.shipping_district }}
              {{ orderStore.currentOrder.shipping_address }}
            </span>
          </div>
          <div v-if="orderStore.currentOrder.tracking_no" class="info-item">
            <span class="info-label">{{ $t('order.trackingNo') }}</span>
            <span class="info-value">{{ orderStore.currentOrder.tracking_no }}</span>
          </div>
        </div>
      </div>

      <!-- Items Card -->
      <div class="items-card card">
        <h2 class="card-title">{{ $t('order.itemsList') }}</h2>
        <div class="items-list">
          <div v-for="item in orderStore.currentOrder.items" :key="item.id" class="item-row">
            <div class="item-info">
              <h3 class="item-name">{{ item.product_name }}</h3>
              <p class="item-detail">¥{{ item.price }} × {{ item.quantity }}</p>
            </div>
            <div class="item-subtotal">¥{{ item.subtotal }}</div>
          </div>
        </div>
      </div>

      <!-- Summary Card -->
      <div class="summary-card card">
        <div class="summary-row">
          <span class="summary-label">{{ $t('order.itemsTotal') }}</span>
          <span class="summary-value">¥{{ orderStore.currentOrder.total_amount }}</span>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-row total">
          <span class="summary-label">{{ $t('order.actualAmount') }}</span>
          <span class="summary-value">¥{{ orderStore.currentOrder.total_amount }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions-section">
        <el-button 
          v-if="orderStore.currentOrder.status === 'pending'"
          type="primary"
          size="large"
          class="action-btn"
          @click="handlePay"
        >
          {{ $t('order.pay') }}
        </el-button>
        <el-button 
          v-if="orderStore.currentOrder.status === 'pending' || orderStore.currentOrder.status === 'paid'"
          size="large"
          class="action-btn"
          @click="handleCancel"
        >
          {{ $t('order.cancel') }}
        </el-button>
        <el-button 
          v-if="orderStore.currentOrder.status === 'shipped'"
          type="primary"
          size="large"
          class="action-btn"
          @click="handleConfirm"
        >
          {{ $t('order.confirm') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useOrderStore } from '../../stores/cart';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ArrowLeft, Clock, Checked, Van, CircleCheck, CircleClose } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const orderStore = useOrderStore();
const route = useRoute();
const router = useRouter();

onMounted(() => {
  orderStore.fetchOrder(route.params.id);
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN');
};

const getStatusIconComponent = (status) => {
  const iconMap = {
    pending: Clock,
    paid: Checked,
    shipped: Van,
    completed: CircleCheck,
    cancelled: CircleClose
  };
  return iconMap[status] || Clock;
};

const getStatusColor = (status) => {
  const colorMap = {
    pending: '#faad14',
    paid: '#1890ff',
    shipped: '#1890ff',
    completed: '#52c41a',
    cancelled: '#ff4d4f'
  };
  return colorMap[status] || '#1890ff';
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

const handlePay = async () => {
  try {
    await orderStore.payOrder(route.params.id);
    ElMessage.success(t('order.paySuccess'));
    orderStore.fetchOrder(route.params.id);
  } catch (error) {
    ElMessage.error(t('order.payError'));
  }
};

const handleCancel = () => {
  ElMessageBox.confirm(t('order.confirmCancel'), t('order.confirmTitle'), {
    confirmButtonText: t('order.confirmButton'),
    cancelButtonText: t('order.cancelButton'),
    type: 'warning',
  }).then(async () => {
    try {
      await orderStore.cancelOrder(route.params.id);
      ElMessage.success(t('order.cancelSuccess'));
      orderStore.fetchOrder(route.params.id);
    } catch (error) {
      ElMessage.error(t('order.cancelError'));
    }
  }).catch(() => {});
};

const handleConfirm = async () => {
  try {
    await orderStore.confirmOrder(route.params.id);
    ElMessage.success(t('order.confirmSuccess'));
    orderStore.fetchOrder(route.params.id);
  } catch (error) {
    ElMessage.error(t('order.confirmError'));
  }
};
</script>

<style scoped>
.order-detail-page {
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

/* Card Base Style */
.card {
  background-color: #ffffff;
  border-radius: 24px;
  padding: 32px;
  border: 1px solid #eee;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* Status Card */
.status-card {
  text-align: center;
}

.status-icon-wrapper {
  margin-bottom: 16px;
}

.status-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: #000;
}

.order-meta {
  color: #666;
  font-size: 14px;
}

.order-meta p {
  margin: 4px 0;
}

/* Info Card */
.card-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 20px 0;
  color: #000;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  font-size: 15px;
  line-height: 1.6;
}

.info-label {
  color: #999;
  min-width: 100px;
  flex-shrink: 0;
}

.info-value {
  color: #000;
  font-weight: 500;
}

/* Items Card */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #fafafa;
  border-radius: 16px;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #000;
}

.item-detail {
  color: #999;
  font-size: 14px;
  margin: 0;
}

.item-subtotal {
  font-size: 20px;
  font-weight: 700;
  color: #000;
}

/* Summary Card */
.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  font-size: 15px;
  color: #666;
}

.summary-value {
  font-weight: 600;
  color: #000;
}

.summary-divider {
  height: 1px;
  background-color: #eee;
  margin: 16px 0;
}

.summary-row.total {
  font-size: 20px;
  font-weight: 700;
  color: #000;
  padding: 0;
}

.summary-row.total .summary-value {
  font-weight: 700;
}

/* Actions */
.actions-section {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
}

.action-btn {
  min-width: 160px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 24px;
}
</style>
