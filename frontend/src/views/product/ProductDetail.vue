<template>
  <div class="product-detail-page" v-if="productStore.currentProduct">
    <!-- Header -->
    <!-- Navigation Bar -->
    <NavBar />

    <!-- Breadcrumb -->
    <div class="breadcrumb-container">
      <el-breadcrumb separator="›">
        <el-breadcrumb-item :to="{ path: '/' }">{{ $t('product.home') }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ productStore.currentProduct.category_name }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ productStore.currentProduct.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- Product Detail Content -->
    <div class="detail-container">
      <!-- Image Gallery -->
      <div class="image-section">
        <!-- Main Image -->
        <div class="main-image-wrapper">
          <img 
            v-if="productStore.currentProduct.images.length > 0" 
            :src="currentImage" 
            :alt="productStore.currentProduct.name" 
            class="main-image" 
          />
          <div v-else class="image-placeholder">
            <el-icon :size="80"><Picture /></el-icon>
            <p>{{ $t('product.noImage') }}</p>
          </div>
        </div>
        
        <!-- Thumbnail Gallery -->
        <div v-if="productStore.currentProduct.images.length > 1" class="thumbnail-gallery">
          <div 
            v-for="(img, index) in productStore.currentProduct.images" 
            :key="img.id"
            :class="['thumbnail', { active: currentImageIndex === index }]"
            @click="currentImageIndex = index"
          >
            <img :src="img.image" :alt="`${$t('product.image')} ${index + 1}`" />
          </div>
        </div>
      </div>
      
      <!-- Product Info -->
      <div class="info-section">
        <h1 class="product-title">{{ productStore.currentProduct.name }}</h1>
        <p class="product-price">¥{{ productStore.currentProduct.price }}</p>
        
        <div class="divider"></div>
        
        <div class="description-section">
          <h3 class="section-label">{{ $t('product.description') }}</h3>
          <p class="product-description">
            {{ productStore.currentProduct.description || $t('product.noDescription') }}
          </p>
        </div>
        
        <div class="divider"></div>
        
        <div class="stock-info">
          <span class="section-label">{{ $t('product.stock') }}：</span>
          <span :class="['stock-value', { 'out-of-stock': productStore.currentProduct.stock === 0 }]">
            {{ productStore.currentProduct.stock > 0 ? `${productStore.currentProduct.stock} ${$t('product.inStock')}` : $t('product.outOfStock') }}
          </span>
        </div>
        
        <div class="actions-section">
          <div class="quantity-selector">
            <span class="section-label">{{ $t('product.quantity') }}</span>
            <el-input-number 
              v-model="quantity" 
              :min="1" 
              :max="productStore.currentProduct.stock"
              :disabled="productStore.currentProduct.stock === 0"
            />
          </div>
          
          <el-button 
            type="primary" 
            size="large" 
            @click="addToCart" 
            :disabled="productStore.currentProduct.stock === 0"
            class="add-to-cart-btn"
          >
            {{ productStore.currentProduct.stock > 0 ? $t('product.addToCart') : $t('product.outOfStock') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '../../components/NavBar.vue';
import { ref, onMounted, computed } from 'vue';
import { useProductStore } from '../../stores/product';
import { useCartStore } from '../../stores/cart';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Picture } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const productStore = useProductStore();
const cartStore = useCartStore();
const route = useRoute();
const quantity = ref(1);
const currentImageIndex = ref(0);

const currentImage = computed(() => {
  if (productStore.currentProduct && productStore.currentProduct.images.length > 0) {
    return productStore.currentProduct.images[currentImageIndex.value].image;
  }
  return '';
});

onMounted(() => {
  productStore.fetchProduct(route.params.id);
});

const addToCart = async () => {
  try {
    await cartStore.addToCart(route.params.id, quantity.value);
    ElMessage.success(t('product.addedToCart', { count: quantity.value }));
  } catch (error) {
    ElMessage.error(t('product.addError'));
  }
};
</script>

<style scoped>
.product-detail-page {
  min-height: 100vh;
  background-color: var(--color-bg-secondary);
  padding-top: calc(6rem + var(--spacing-xl));
}

/* Header */


/* Breadcrumb */
.breadcrumb-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-lg) var(--spacing-xl);
}

/* Detail Container */
.detail-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--spacing-xl) var(--spacing-2xl);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-2xl);
}

/* Image Section */
.image-section {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.main-image-wrapper {
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.main-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.thumbnail-gallery {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--color-bg-primary);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  overflow-x: auto;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
  flex-shrink: 0;
}

.thumbnail:hover {
  border-color: var(--color-primary);
  transform: scale(1.05);
}

.thumbnail.active {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  gap: var(--spacing-md);
}

/* Info Section */
.info-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.product-title {
  font-size: 40px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.product-price {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-price);
  letter-spacing: -0.01em;
}

.divider {
  height: 1px;
  background-color: var(--color-border);
  margin: var(--spacing-md) 0;
}

.section-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: var(--spacing-sm);
}

.description-section {
  padding: var(--spacing-md) 0;
}

.product-description {
  font-size: 17px;
  line-height: 1.6;
  color: var(--color-text-primary);
}

.stock-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.stock-value {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-success);
}

.stock-value.out-of-stock {
  color: var(--color-danger);
}

/* Actions Section */
.actions-section {
  margin-top: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.quantity-selector {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.add-to-cart-btn {
  width: 100%;
  height: 56px;
  font-size: 17px;
  font-weight: 600;
  border-radius: var(--radius-md);
}

/* Responsive */
@media (max-width: 1024px) {
  .detail-container {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }
  
  .product-title {
    font-size: 32px;
  }
  
  .product-price {
    font-size: 28px;
  }
}

@media (max-width: 768px) {
  .breadcrumb-container,
  .detail-container {
    padding-left: var(--spacing-md);
    padding-right: var(--spacing-md);
  }
  
  .product-title {
    font-size: 28px;
  }
  
  .carousel-image-wrapper,
  .image-placeholder {
    height: 300px;
  }
}
</style>
