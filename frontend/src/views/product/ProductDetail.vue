<template>
  <div class="product-detail-page" v-if="productStore.currentProduct">
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
      <div class="image-section card">
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
        <!-- Title and Price Card -->
        <div class="info-card card">
          <div class="tag-row">
            <span class="tag hot-sale">Hot Sale</span>
            <div class="rating">
              <el-icon color="#000000" :size="14"><StarFilled /></el-icon>
              <span class="rating-score">4.8</span>
              <span class="rating-count">(128)</span>
            </div>
          </div>

          <h1 class="product-title">{{ productStore.currentProduct.name }}</h1>
          
          <div class="price-row">
            <span class="current-price">¥{{ productStore.currentProduct.price }}</span>
            <span class="original-price">¥{{ (parseFloat(productStore.currentProduct.price) * 1.5).toFixed(0) }}</span>
          </div>

          <div class="stock-info">
            <span class="label">{{ $t('product.stock') }}:</span>
            <span class="value badge">
              {{ productStore.currentProduct.stock > 0 ? `${productStore.currentProduct.stock} ${$t('product.inStock')}` : $t('product.outOfStock') }}
            </span>
          </div>
        </div>

        <!-- Description Card -->
        <div class="description-card card">
          <h3 class="section-title">{{ $t('product.description') }}</h3>
          <p class="product-description">
            {{ productStore.currentProduct.description || $t('product.noDescription') }}
          </p>
        </div>

        <!-- Specifications Card -->
        <div class="specs-card card">
          <h3 class="section-title">{{ $t('product.specifications') }}</h3>
          <div class="specs-list">
            <div class="spec-item">
              <span class="spec-label">{{ $t('product.category') }}</span>
              <span class="spec-value">{{ productStore.currentProduct.category_name }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">{{ $t('product.stock') }}</span>
              <span class="spec-value">{{ productStore.currentProduct.stock }}</span>
            </div>
          </div>
        </div>

        <!-- Actions Section -->
        <div class="actions-section card">
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
            <span>{{ productStore.currentProduct.stock > 0 ? $t('product.addToCart') : $t('product.outOfStock') }}</span>
            <div class="btn-icon">
              <el-icon><ArrowRight /></el-icon>
              <el-icon style="margin-left: -4px;"><ArrowRight /></el-icon>
              <el-icon style="margin-left: -4px;"><ArrowRight /></el-icon>
            </div>
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
import { Picture, StarFilled, ArrowRight } from '@element-plus/icons-vue';
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
  background-color: #fafafa;
  padding-top: calc(6rem + var(--spacing-xl));
}

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
  gap: 24px;
}

/* Card Base Style */
.card {
  background-color: #ffffff;
  border-radius: 24px;
  border: 1px solid #eee;
  overflow: hidden;
  transition: all 0.2s;
}

/* Image Section */
.image-section {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.main-image-wrapper {
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  padding: 20px;
}

.main-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.thumbnail-gallery {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #ffffff;
  overflow-x: auto;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 12px;
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
  gap: 20px;
}

.info-card {
  padding: 24px;
}

.tag-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.tag.hot-sale {
  background-color: #f5f5f5;
  color: #000000;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 16px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating-score {
  font-weight: 700;
  font-size: 14px;
}

.rating-count {
  color: #999;
  font-size: 14px;
}

.product-title {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
  line-height: 1.2;
  margin: 0 0 16px 0;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 16px;
}

.current-price {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-price);
  letter-spacing: -0.01em;
}

.original-price {
  font-size: 20px;
  color: #999;
  text-decoration: line-through;
}

.stock-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.stock-info .badge {
  background-color: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  color: #000;
  font-weight: 500;
}

.description-card,
.specs-card {
  padding: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 16px 0;
}

.product-description {
  font-size: 15px;
  line-height: 1.6;
  color: var(--color-text-primary);
  margin: 0;
}

.specs-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.spec-label {
  color: #999;
}

.spec-value {
  font-weight: 600;
}

/* Actions Section */
.actions-section {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.quantity-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.add-to-cart-btn {
  width: 100%;
  height: 56px;
  font-size: 17px;
  font-weight: 700;
  border-radius: 30px;
  background-color: #000;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-icon {
  display: flex;
  align-items: center;
}

/* Responsive */
@media (max-width: 1024px) {
  .detail-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .image-section {
    position: relative;
    top: 0;
  }
  
  .product-title {
    font-size: 28px;
  }
  
  .current-price {
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
    font-size: 24px;
  }
  
  .main-image-wrapper,
  .image-placeholder {
    height: 300px;
  }
}
</style>
