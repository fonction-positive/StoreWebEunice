<template>
  <div class="cart-page">
    <!-- Header -->
    <div class="page-container">
      <div class="page-header">
        <el-button text @click="$router.push('/')" class="back-button">
          <el-icon><ArrowLeft /></el-icon>
          {{ $t('cart.back') }}
        </el-button>
        <h1 class="page-title">{{ $t('cart.title') }}</h1>
      </div>

      <!-- Cart Content -->
      <div class="cart-content" v-loading="cartStore.loading">
      <div v-if="cartStore.items.length > 0" class="cart-content">
        <!-- Cart Items -->
        <div class="cart-items-section">
          <div v-for="item in cartStore.items" :key="item.id" class="cart-item card">
            <el-checkbox v-model="item.selected" @change="updateSelection" class="item-checkbox" />
            
            <div class="item-image-wrapper">
              <img 
                v-if="item.product_detail.main_image" 
                :src="`${item.product_detail.main_image.image}`" 
                :alt="item.product_detail.name" 
                class="item-image" 
              />
              <div v-else class="image-placeholder">
                <el-icon :size="32"><Picture /></el-icon>
              </div>
            </div>

            <div class="item-details">
              <div class="item-header">
                <h3 class="item-name">{{ item.product_detail.name }}</h3>
                <el-icon 
                  class="delete-icon" 
                  :size="18"
                  @click="handleRemove(item.id)"
                >
                  <Delete />
                </el-icon>
              </div>
              
              <p class="item-specs" v-if="item.product_detail.category_name">
                {{ $t('product.category') }}: {{ item.product_detail.category_name }}
              </p>
              
              <div class="item-footer">
                <div class="item-price">¥{{ item.product_detail.price }}</div>
                <div class="quantity-control">
                  <button 
                    class="qty-btn" 
                    @click="decreaseQuantity(item)"
                    :disabled="item.quantity <= 1"
                  >
                    <el-icon :size="12"><Minus /></el-icon>
                  </button>
                  <span class="qty-value">{{ item.quantity }}</span>
                  <button 
                    class="qty-btn" 
                    @click="increaseQuantity(item)"
                    :disabled="item.quantity >= item.product_detail.stock"
                  >
                    <el-icon :size="12"><Plus /></el-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="order-summary-section">
          <div class="summary-card card">
            <h2 class="summary-title">{{ $t('cart.orderSummary') }}</h2>
            
            <div class="summary-row">
              <span class="summary-label">{{ $t('cart.itemCount') }}</span>
              <span class="summary-value">{{ selectedCount }} {{ $t('cart.itemUnit') }}</span>
            </div>
            
            <div class="summary-row">
              <span class="summary-label">{{ $t('cart.subtotal') }}</span>
              <span class="summary-value">¥{{ selectedTotal }}</span>
            </div>
            
            <div class="summary-row">
              <span class="summary-label">{{ $t('cart.shipping') }}</span>
              <span class="summary-value">¥0.00</span>
            </div>
            
            <div class="summary-divider"></div>
            
            <div class="summary-row total">
              <span class="summary-label">{{ $t('cart.total') }}</span>
              <span class="summary-value">¥{{ selectedTotal }}</span>
            </div>
          </div>

          <button 
            class="checkout-btn"
            @click="handleCheckout"
            :disabled="selectedCount === 0"
            :class="{ 'is-disabled': selectedCount === 0 }"
          >
            {{ $t('cart.checkout') }}
          </button>
        </div>
      </div>

      <el-empty 
        v-else 
        :description="$t('cart.empty')"
        :image-size="120"
      >
        <el-button type="primary" @click="$router.push('/')">{{ $t('cart.goShopping') }}</el-button>
      </el-empty>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useCartStore } from '../../stores/cart';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ArrowLeft, Picture, Delete, Minus, Plus } from '@element-plus/icons-vue';

const cartStore = useCartStore();
const router = useRouter();
const { t } = useI18n();

onMounted(() => {
  cartStore.fetchCart();
  // 初始化选中状态
  cartStore.items.forEach(item => {
    item.selected = true;
  });
});

// 监听 cartStore.items 的变化，确保每个商品都有 selected 标记
watch(() => cartStore.items, (newItems) => {
  newItems.forEach(item => {
    if (item.selected === undefined) {
      item.selected = true;
    }
  });
}, { immediate: true });

const selectedCount = computed(() => {
  return cartStore.items.filter(item => item.selected).reduce((sum, item) => sum + item.quantity, 0);
});

const selectedTotal = computed(() => {
  return cartStore.items
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.quantity * parseFloat(item.product_detail.price), 0)
    .toFixed(2);
});

const updateSelection = () => {
  // 选中状态已更新
};

const increaseQuantity = async (item) => {
  if (item.quantity < item.product_detail.stock) {
    item.quantity++;
    await handleQuantityChange(item);
  }
};

const decreaseQuantity = async (item) => {
  if (item.quantity > 1) {
    item.quantity--;
    await handleQuantityChange(item);
  }
};

const handleQuantityChange = async (item) => {
  try {
    await cartStore.updateQuantity(item.id, item.quantity);
  } catch (error) {
    ElMessage.error(t('messages.operationFailed'));
  }
};

const handleRemove = (itemId) => {
  ElMessageBox.confirm(t('cart.confirmRemove'), t('cart.confirmTitle'), {
    confirmButtonText: t('cart.remove'),
    cancelButtonText: t('cart.cancel'),
    type: 'warning',
  }).then(async () => {
    try {
      await cartStore.removeItem(itemId);
      ElMessage.success(t('messages.deleteSuccess'));
    } catch (error) {
      ElMessage.error(t('messages.operationFailed'));
    }
  }).catch(() => {});
};

const handleCheckout = () => {
  const selectedItems = cartStore.items.filter(item => item.selected);
  if (selectedItems.length === 0) {
    ElMessage.warning(t('cart.selectItems'));
    return;
  }
  // 将选中的商品信息存储到 sessionStorage
  sessionStorage.setItem('checkoutItems', JSON.stringify(selectedItems));
  router.push('/checkout');
};
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background-color: #fafafa;
  padding-top: 80px;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl);
  width: 100%;
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

.cart-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
}

/* Card Base Style */
.card {
  background-color: #ffffff;
  border-radius: 24px;
  border: 1px solid #eee;
  transition: all 0.2s;
}

/* Cart Items Section */
.cart-items-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item {
  padding: 24px;
  display: flex;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.cart-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: var(--color-primary);
}

.item-checkbox {
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 8px;
}

.item-image-wrapper {
  width: 120px;
  height: 120px;
  border-radius: 16px;
  overflow: hidden;
  background-color: #f5f5f5;
  flex-shrink: 0;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cccccc;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.item-name {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin: 0;
  text-transform: uppercase;
  line-height: 1.2;
}

.delete-icon {
  color: #000000;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
  font-size: 20px;
}

.delete-icon:hover {
  color: var(--color-danger);
}

.item-specs {
  font-size: 13px;
  color: #999999;
  margin: 4px 0;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  gap: 48px;
}

.item-price {
  font-size: 20px;
  font-weight: 700;
  color: #000000;
}

.quantity-control {
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 20px;
  padding: 4px;
}

.qty-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #000000;
  transition: background-color 0.2s;
}

.qty-btn:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-value {
  font-size: 14px;
  font-weight: 600;
  margin: 0 12px;
  min-width: 20px;
  text-align: center;
}

/* Order Summary Section */
.order-summary-section {
  position: sticky;
  top: 100px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.summary-card {
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.summary-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 20px 0;
  color: #000000;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 15px;
  color: #666666;
}

.summary-value {
  font-weight: 600;
  color: #000000;
}

.summary-divider {
  height: 1px;
  background-color: #eeeeee;
  margin: 16px 0;
}

.summary-row.total {
  margin-bottom: 0;
  font-size: 20px;
  font-weight: 700;
  color: #000000;
}

.summary-row.total .summary-value {
  font-weight: 700;
}

.checkout-btn {
  width: 100%;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 30px;
  padding: 16px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
}

.checkout-btn:hover:not(.is-disabled) {
  transform: scale(1.02);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
}

.checkout-btn:active:not(.is-disabled) {
  transform: scale(0.98);
}

.checkout-btn.is-disabled {
  background-color: #f5f5f5;
  color: #999;
  cursor: not-allowed;
  box-shadow: none;
}

/* Responsive */
@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .order-summary-section {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .item-checkbox {
    position: absolute;
    top: 16px;
    left: 16px;
  }

  .cart-item {
    padding-left: 48px;
  }
  
  .item-image-wrapper {
    width: 80px;
    height: 80px;
  }
}
</style>
