<template>
  <div class="cart-page">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="title-row">
          <el-button text @click="$router.back()" class="back-button">
            <el-icon><ArrowLeft /></el-icon>
            返回
          </el-button>
          <h1 class="page-title">购物车</h1>
        </div>
      </div>
    </header>

    <!-- Cart Content -->
    <div class="cart-container" v-loading="cartStore.loading">
      <div v-if="cartStore.items.length > 0" class="cart-content">
        <!-- Cart Items -->
        <div class="cart-items">
          <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
            <el-checkbox v-model="item.selected" @change="updateSelection" />
            
            <div class="item-image">
              <img 
                v-if="item.product_detail.main_image" 
                :src="`http://localhost:8000/${item.product_detail.main_image.image}`" 
                :alt="item.product_detail.name" 
                class="product-image" 
              />
              <div v-else class="image-placeholder">
                <el-icon><Picture /></el-icon>
              </div>
            </div>

            <div class="item-info">
              <h3 class="item-name">{{ item.product_detail.name }}</h3>
            </div>

            <div class="item-quantity">
              <el-input-number 
                v-model="item.quantity" 
                :min="1" 
                :max="item.product_detail.stock"
                @change="handleQuantityChange(item)"
              />
            </div>

            <div class="item-subtotal">
              <span class="subtotal-label">小计</span>
              <span class="subtotal-price">¥{{ item.subtotal }}</span>
            </div>

            <el-button 
              text 
              type="danger" 
              @click="handleRemove(item.id)"
              class="remove-btn"
            >
              删除
            </el-button>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="cart-summary">
          <div class="summary-card">
            <h3 class="summary-title">订单摘要</h3>
            
            <div class="summary-row">
              <span>商品总数</span>
              <span>{{ selectedCount }} 件</span>
            </div>
            
            <div class="summary-row total">
              <span>总计</span>
              <span class="total-price">¥{{ selectedTotal }}</span>
            </div>

            <el-button 
              type="primary" 
              size="large" 
              @click="handleCheckout"
              :disabled="selectedCount === 0"
              :class="['checkout-btn', { 'is-disabled': selectedCount === 0 }]"
            >
              去结算
            </el-button>
          </div>
        </div>
      </div>

      <el-empty 
        v-else 
        description="购物车是空的"
        :image-size="120"
      >
        <el-button type="primary" @click="$router.push('/')">去逛逛</el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useCartStore } from '../../stores/cart';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ArrowLeft, Picture } from '@element-plus/icons-vue';
import api from '../../api/axios';

const cartStore = useCartStore();
const router = useRouter();

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

const handleQuantityChange = async (item) => {
  try {
    await cartStore.updateQuantity(item.id, item.quantity);
  } catch (error) {
    ElMessage.error('更新失败');
  }
};

const handleRemove = (itemId) => {
  ElMessageBox.confirm('确定要删除这件商品吗？', '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await cartStore.removeItem(itemId);
      ElMessage.success('已删除');
    } catch (error) {
      ElMessage.error('删除失败');
    }
  }).catch(() => {});
};

const handleCheckout = () => {
  const selectedItems = cartStore.items.filter(item => item.selected);
  if (selectedItems.length === 0) {
    ElMessage.warning('请选择要结算的商品');
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

.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-xl);
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: var(--spacing-2xl);
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.cart-item {
  background: var(--color-bg-primary);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  display: grid;
  grid-template-columns: auto 100px 1fr auto auto auto;
  gap: var(--spacing-lg);
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.cart-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  border-color: var(--color-primary);
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: var(--radius-md);
  overflow: hidden;
  background-color: var(--color-bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-placeholder {
  color: var(--color-text-secondary);
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.item-price {
  font-size: 15px;
  color: var(--color-text-secondary);
}

.item-subtotal {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.subtotal-label {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.subtotal-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-price);
}

.remove-btn {
  color: var(--color-danger);
}

.cart-summary {
  position: sticky;
  top: 100px;
}

.summary-card {
  background: var(--color-bg-primary);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.summary-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
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

.checkout-btn {
  width: 100%;
  height: 56px;
  margin-top: var(--spacing-xl);
  font-size: 17px;
  font-weight: 600;
}

.checkout-btn.is-disabled {
  background-color: var(--color-bg-secondary) !important;
  border-color: var(--color-border) !important;
  color: var(--color-text-secondary) !important;
  cursor: not-allowed;
  opacity: 0.6;
}

@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-summary {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: auto 80px 1fr;
    gap: var(--spacing-md);
  }
  
  .item-image {
    width: 80px;
    height: 80px;
  }
  
  .item-quantity,
  .item-subtotal {
    grid-column: 2 / 4;
  }
  
  .remove-btn {
    grid-column: 3;
  }
}
</style>
