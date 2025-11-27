<template>
  <div class="order-list-page">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <el-button text @click="$router.back()" class="back-button">
          <el-icon><ArrowLeft /></el-icon>
          {{ $t('common.back') }}
        </el-button>
        <h1 class="page-title">{{ $t('order.myOrders') }}</h1>
      </div>
    </header>

    <!-- Filter Tabs -->
    <div class="tabs-container">
      <div class="tabs">
        <div 
          v-for="tab in tabs" 
          :key="tab.value"
          :class="['tab', { active: currentTab === tab.value }]"
          @click="handleTabChange(tab.value)"
        >
          {{ tab.label }}
        </div>
      </div>
    </div>

    <!-- Orders List -->
    <div class="orders-container" v-loading="orderStore.loading">
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
              {{ order.status_display }}
            </el-tag>
          </div>

          <div class="order-items">
            <div v-for="item in order.items" :key="item.id" class="order-item">
              <div class="item-name">{{ item.product_name }}</div>
              <div class="item-detail">
                <span>¥{{ item.price }} × {{ item.quantity }}</span>
              </div>
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
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useOrderStore } from '../../stores/cart';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';
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
  background-color: var(--color-bg-secondary);
}

.header {
  background-color: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl);
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.title-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.back-button {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-primary);
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
  margin: 0;
}

.tabs-container {
  background: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 99;
}

.tabs {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
  display: flex;
  gap: var(--spacing-xl);
}

.tab {
  padding: var(--spacing-md) 0;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-secondary);
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab:hover {
  color: var(--color-text-primary);
}

.tab.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.orders-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-xl);
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.order-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.order-card:hover {
  box-shadow: var(--shadow-md);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--spacing-md);
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
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
  padding: var(--spacing-md) 0;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-sm) 0;
}

.item-name {
  font-size: 15px;
}

.item-detail {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.order-total {
  font-size: 17px;
  font-weight: 600;
}

.total-amount {
  font-size: 20px;
  color: var(--color-price);
  margin-left: var(--spacing-sm);
}

.order-actions {
  display: flex;
  gap: var(--spacing-sm);
}
</style>
