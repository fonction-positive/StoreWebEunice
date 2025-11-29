<template>

  <div class="home-page">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="header-top">
        <div class="header-left">
          <div class="logo-circle">
            <span class="logo-text">F</span>
          </div>
          <div class="brand-info">
            <h1 class="brand-name">Fluxwear</h1>
            <p class="brand-tagline">Bold Looks. Clean Lines.</p>
          </div>
        </div>
        <div class="header-right">
          <div class="header-icon-wrapper">
            <van-icon name="shopping-cart-o" size="20" class="header-icon" />
          </div>
          <div class="header-icon-wrapper">
            <van-icon name="bell" size="20" class="header-icon" />
          </div>
          <div class="header-icon-wrapper">
            <van-icon name="globe-o" size="20" class="header-icon" />
          </div>
        </div>
      </div>
      
      <!-- 搜索栏 -->
      <div class="search-bar">
        <van-icon name="search" size="16" class="search-icon" />
        <input 
          type="text" 
          placeholder="Search" 
          class="search-input"
        />
        <van-icon name="filter-o" size="16" class="filter-icon" />
      </div>
    </div>

    <!-- Shop Markets 区域 -->
    <div class="shop-markets-section">
      <div class="section-header">
        <h2 class="section-title">Shop Markets</h2>
        <span class="see-all">See All</span>
      </div>
      <div class="category-tabs">
        <div 
          v-for="(category, index) in categories" 
          :key="index"
          :class="['category-tab', { active: activeCategory === category.value }]"
          @click="selectCategory(category.value)"
        >
          {{ category.label }}
        </div>
      </div>
    </div>

    <!-- 产品网格 -->
    <div class="products-section">
      <van-loading v-if="productStore.loading" class="loading" />
      <div v-else class="products-grid">
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
              <van-icon name="photo-o" size="32" />
            </div>
            <div class="favorite-icon">
              <van-icon name="like-o" size="16" color="#000000" />
            </div>
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-color">Color - Grey</p>
            <div class="product-price">
              ${{ product.price }}
            </div>
          </div>
        </div>
      </div>
      <van-empty v-if="!productStore.loading && productStore.products.length === 0" description="暂无商品" />
    </div>

    <!-- 底部导航栏 -->
    <div class="bottom-nav">
      <div 
        v-for="item in navItems" 
        :key="item.name"
        :class="['nav-item', { active: activeNav === item.name }]"
        @click="navigateTo(item.name)"
      >
        <van-icon :name="item.icon" size="24" />
        <span v-show="activeNav === item.name">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '../stores/product';

const router = useRouter();
const productStore = useProductStore();

const activeCategory = ref('all');
const activeNav = ref('home');

const navItems = [
  { name: 'home', icon: 'wap-home-o', label: 'Home' },
  { name: 'favorites', icon: 'like-o', label: 'Favorites' },
  { name: 'cart', icon: 'shopping-cart-o', label: 'Cart' },
  { name: 'profile', icon: 'user-o', label: 'Profile' },
];

const categories = [
  { label: 'All', value: 'all' },
  { label: 'Women', value: 'women' },
  { label: 'Man', value: 'man' },
  { label: 'Kid', value: 'kid' },
];

const selectCategory = (value) => {
  activeCategory.value = value;
  // 这里可以根据分类筛选产品
  productStore.fetchProducts({ category: value === 'all' ? '' : value });
};

const getCategoryName = (category) => {
  const categoryMap = {
    'women': "Women's Top",
    'man': "Men's Wear",
    'kid': "Kids' Wear"
  };
  return categoryMap[category] || "Fashion";
};

const goToDetail = (id) => {
  router.push(`/product/${id}`);
};

const navigateTo = (name) => {
  activeNav.value = name;
  if (name === 'home') {
    router.push('/');
  } else if (name === 'favorites') {
    router.push('/favorites');
  } else if (name === 'cart') {
    router.push('/cart');
  } else if (name === 'profile') {
    router.push('/profile');
  }
  // 其他页面路由可以后续添加
};

onMounted(() => {
  productStore.fetchProducts();
});

</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background-color: #fafafa; /* Updated to HSL(0, 0%, 98%) */
  padding-bottom: 80px;
}

/* 顶部导航栏 */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 8px 20px 12px; /* 减小顶部内边距 */
  background-color: transparent; /* Removed background color */
  z-index: 1000;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.logo-text {
  color: #ffffff;
  font-size: 22px;
  font-weight: 700;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  letter-spacing: -0.5px;
}

.brand-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-name {
  font-size: 20px;
  font-weight: 700;
  color: #000000;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.3px;
}

.brand-tagline {
  font-size: 12px;
  color: #666666;
  margin: 0;
  line-height: 1.2;
  font-weight: 400;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 50%; /* 圆形背景 */
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.header-icon-wrapper:active {
  transform: scale(0.95);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.header-icon {
  color: #000000;
}

/* 搜索栏 */
.search-bar {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 16px;
  padding: 10px 16px; /* 减小内边距使搜索栏变细 */
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.search-icon {
  color: #999999;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 15px;
  color: #000000;
  outline: none;
  font-weight: 400;
}

.search-input::placeholder {
  color: #999999;
}

.filter-icon {
  color: #999999;
  flex-shrink: 0;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-icon:active {
  transform: scale(0.9);
}

/* Shop Markets 区域 */
.shop-markets-section {
  padding: 0 20px 28px;
  margin-top: 130px; /* 减少顶部间隔 */
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: #000000;
  margin: 0;
  letter-spacing: -0.5px;
}

.see-all {
  font-size: 15px;
  color: #999999;
  font-weight: 400;
}

.category-tabs {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 4px;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.category-tab {
  padding: 10px 24px;
  border-radius: 24px;
  background-color: #f5f5f5;
  color: #000000;
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.category-tab:active {
  transform: scale(0.96);
}

.category-tab.active {
  background-color: #000000;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 产品网格 */
.products-section {
  padding: 0 20px;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.product-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  /* Removed background, padding, shadow for cleaner look */
}

.product-card:active {
  transform: scale(0.98);
}

.product-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background-color: #f5f5f5;
  border-radius: 24px; /* Increased radius */
  margin-bottom: 8px; /* Reduced margin */
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:active .product-image {
  transform: scale(1.05);
}

.product-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cccccc;
}

.favorite-icon {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  background-color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

.favorite-icon:active {
  transform: scale(0.9);
}

.product-info {
  padding: 0 4px; /* Minimal horizontal padding */
}

.product-name {
  font-size: 15px; /* Slightly smaller */
  font-weight: 500;
  color: #000000;
  margin: 0 0 2px 0; /* Tighter spacing */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: -0.2px;
  text-transform: uppercase;
}

.product-color {
  font-size: 13px;
  color: #999999;
  margin: 0 0 4px 0; /* Tighter spacing */
  font-weight: 400;
}

.product-price {
  font-size: 18px; /* Slightly smaller */
  font-weight: 700;
  color: #000000;
  letter-spacing: -0.5px;
  line-height: 1.1;
}

/* 底部导航栏 */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 8px 20px;
  padding-bottom: calc(8px + env(safe-area-inset-bottom));
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #000000; /* Inactive color */
  min-width: 44px;
  justify-content: center;
}

.nav-item.active {
  background-color: #000000; /* Black active background */
  color: #ffffff; /* White text */
  padding: 12px 24px;
  /* Removed flex-grow to keep it compact */
  justify-content: center;
}

.nav-item:active {
  transform: scale(0.95);
}

.nav-item span {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.2px;
  white-space: nowrap;
}
</style>

