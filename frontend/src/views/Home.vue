<template>
  <div class="home-page">
    <!-- 固定悬浮导航栏 -->
    <!-- 固定悬浮导航栏 -->
    <NavBar />

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 品牌故事区域（Hero Section） -->
      <section class="hero-section animate-fade-in">
        <div class="hero-container">
          <div class="hero-image-wrapper">
            <div class="hero-image-container">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop" 
                :alt="$t('home.hero.brandName')"
                class="hero-image"
              />
            </div>
          </div>
          <div class="hero-content">
            <h1 class="hero-title">{{ $t('home.hero.brandName') }}</h1>
            <p class="hero-description">
              {{ $t('home.hero.description') }}
            </p>
            <div class="hero-social">
              <button class="follow-button">{{ $t('home.hero.followUs') }}</button>
              <div class="social-icons">
                <a href="#" class="social-icon" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" class="social-icon" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" class="social-icon" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 商品列表区域 -->
      <section class="products-section animate-slide-up">
        <div class="container">
        <div class="section-header">
          <h2 class="section-title">{{ $t('home.products.title') }}</h2>
          <el-button type="primary" @click="goToProducts" class="view-all-button">
            {{ $t('home.products.viewAll') }}
            <el-icon class="ml-1"><ArrowRight /></el-icon>
          </el-button>
        </div>

          
          <div v-loading="productStore.loading" class="products-grid">
            <div 
              v-for="product in productStore.products" 
              :key="product.id" 
              class="product-card"
              @click="goToDetail(product.id)"
            >
              <div class="product-image-wrapper">
                <img 
                  v-if="product.main_image" 
                  :src="product.main_image.image" 
                  :alt="product.name"
                  class="product-image" 
                />
                <div v-else class="product-image-placeholder">
                  <el-icon :size="48"><Picture /></el-icon>
                </div>
              </div>
              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-price">¥{{ product.price }}</p>
              </div>
            </div>
          </div>

          <el-empty 
            v-if="!productStore.loading && productStore.products.length === 0" 
            :description="$t('home.products.empty')"
            :image-size="120"
          />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue';
import { onMounted } from 'vue';
import { useProductStore } from '../stores/product';
import { useUserStore } from '../stores/user';
import { useCartStore } from '../stores/cart';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Picture, ArrowRight } from '@element-plus/icons-vue';

const productStore = useProductStore();
const userStore = useUserStore();
const cartStore = useCartStore();
const router = useRouter();
const { t } = useI18n();

onMounted(() => {
  productStore.fetchProducts();
  if (userStore.isAuthenticated) {
    if (!userStore.user) {
      userStore.fetchUser();
    }
    cartStore.fetchCart();
  }
});

const goToProducts = () => {
  router.push('/products');
};

const goToDetail = (id) => {
  router.push(`/product/${id}`);
};


</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background-color: var(--bg-color);
  transition: background-color 0.3s ease;
}



/* 主内容区 */
.main-content {
  padding-top: calc(6rem + var(--spacing-xl));
  padding-bottom: var(--spacing-2xl);
}

/* Hero Section - 品牌故事区域 */
.hero-section {
  margin-bottom: var(--spacing-2xl);
  padding: 0 var(--spacing-xl);
}

.hero-container {
  max-width: 1400px;
  margin: 0 auto;
  background-color: var(--card-bg);
  border-radius: 3.5rem;
  overflow: hidden;
  box-shadow: var(--shadow-card);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-2xl);
  min-height: 400px;
  padding: var(--spacing-2xl);
  align-items: center;
  border: 1px solid var(--border-color);
}

.hero-image-wrapper {
  width: 100%;
  height: 100%;
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.hero-image-container {
  width: 100%;
  height: 100%;
  min-height: 350px;
  max-height: 400px;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background-color: var(--muted-color);
  box-shadow: 0 4px 20px -4px hsl(0 0% 0% / 0.15);
  transition: var(--transition);
  position: relative;
}

.hero-image-container:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 30px -6px hsl(0 0% 0% / 0.2);
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  animation: breathe 3s ease-in-out infinite;
}

.hero-image-container:hover .hero-image {
  transform: scale(1.05);
  animation: none;
}

@keyframes breathe {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

.hero-content {
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--spacing-lg);
}

.hero-title {
  font-family: var(--font-serif);
  font-size: 3rem;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1.2;
  margin: 0;
}

@media (min-width: 768px) {
  .hero-title {
    font-size: 3.5rem;
  }
}

@media (min-width: 1024px) {
  .hero-title {
    font-size: 4.5rem;
  }
}

.hero-description {
  font-size: 1.25rem;
  line-height: 1.8;
  color: var(--text-color);
  opacity: 0.8;
  margin: 0;
}

@media (min-width: 1024px) {
  .hero-description {
    font-size: 1.375rem;
  }
}

.hero-social {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  margin-top: var(--spacing-md);
}

.follow-button {
  padding: var(--spacing-md) var(--spacing-xl);
  background-color: var(--primary-color);
  color: var(--primary-text);
  border: none;
  border-radius: var(--radius-base);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  font-size: 1rem;
}

.follow-button:hover {
  opacity: 0.9;
  transform: scale(1.05);
}

.social-icons {
  display: flex;
  gap: var(--spacing-lg);
}

.social-icon {
  width: 3rem;
  height: 3rem;
  border-radius: var(--radius-full);
  background-color: var(--primary-color);
  color: var(--primary-text);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  text-decoration: none;
}

.social-icon:hover {
  transform: scale(1.1);
  opacity: 0.9;
}

/* 商品列表区域 */
.products-section {
  padding: var(--spacing-2xl) 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.view-all-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.ml-1 {
  margin-left: 0.25rem;
}


.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--spacing-xl);
}

/* 商品卡片 */
.product-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-base);
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow-card);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
}

.product-image-wrapper {
  width: 100%;
  height: 260px;
  overflow: hidden;
  background-color: var(--muted-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-image-placeholder {
  color: var(--secondary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.product-info {
  padding: var(--spacing-lg);
}

.product-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: var(--spacing-sm);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--accent-color);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    min-height: auto;
    padding: var(--spacing-xl);
    gap: var(--spacing-xl);
    border-radius: 3rem;
    align-items: start;
  }

  .hero-image-wrapper {
    min-height: 250px;
    padding: 0;
    align-items: flex-start;
  }

  .hero-image-container {
    min-height: 250px;
    max-height: 300px;
    border-radius: 2rem;
  }

  .hero-content {
    padding: 0;
    justify-content: flex-start;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: var(--spacing-lg);
  }
}

@media (max-width: 768px) {


  .main-content {
    padding-top: calc(7rem + var(--spacing-md));
  }

  .hero-section {
    padding: 0 var(--spacing-md);
    margin-bottom: var(--spacing-xl);
  }

  .hero-content {
    padding: var(--spacing-lg);
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--spacing-md);
  }

  .products-section {
    padding: var(--spacing-xl) var(--spacing-md);
  }
}
</style>
