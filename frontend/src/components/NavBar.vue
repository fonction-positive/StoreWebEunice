<template>
  <div>
    <nav class="navbar">
      <div class="navbar-content">
        <!-- Logo -->
        <div class="logo" @click="$router.push('/')">
          <div class="logo-icon">S</div>
          <span class="logo-text">StoreWeb</span>
        </div>

        <!-- 搜索框 - 桌面端 -->
        <div class="search-container desktop-search">
          <el-input 
            v-model="searchQuery" 
            placeholder="搜索商品..." 
            @keyup.enter="handleSearchClick"
            clearable
            size="large"
            class="search-input"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
            <template #suffix>
              <el-button 
                :icon="Search" 
                circle 
                size="small"
                @click="handleSearchClick"
                class="search-btn"
              />
            </template>
          </el-input>
        </div>

        <!-- 右侧操作区 -->
        <div class="navbar-actions">
          <!-- 搜索按钮 - 移动端 -->
          <div class="icon-button mobile-search-btn" @click="showMobileSearch = true">
            <el-icon :size="22"><Search /></el-icon>
          </div>

          <!-- 购物车 -->
          <el-badge :value="cartStore.totalCount" :hidden="cartStore.totalCount === 0" class="cart-badge">
            <div class="icon-button" @click="$router.push('/cart')">
              <el-icon :size="22"><ShoppingCart /></el-icon>
            </div>
          </el-badge>

          <!-- 用户菜单 -->
          <el-dropdown v-if="userStore.isAuthenticated" trigger="click" class="user-dropdown">
            <div class="user-menu-trigger">
              <el-icon :size="22"><User /></el-icon>
              <span class="user-name">{{ userStore.user?.username }}</span>
              <el-icon :size="14"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="$router.push('/user/profile')">
                  <el-icon><User /></el-icon>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item @click="$router.push('/user/orders')">
                  <el-icon><List /></el-icon>
                  我的订单
                </el-dropdown-item>
                <el-dropdown-item v-if="userStore.isAdmin" divided @click="$router.push('/admin/dashboard')">
                  <el-icon><DataAnalysis /></el-icon>
                  数据统计
                </el-dropdown-item>
                <el-dropdown-item v-if="userStore.isAdmin" @click="$router.push('/admin/products')">
                  <el-icon><Goods /></el-icon>
                  商品管理
                </el-dropdown-item>
                <el-dropdown-item v-if="userStore.isAdmin" @click="$router.push('/admin/orders')">
                  <el-icon><Document /></el-icon>
                  订单管理
                </el-dropdown-item>
                <el-dropdown-item v-if="userStore.isAdmin" @click="$router.push('/admin/users')">
                  <el-icon><User /></el-icon>
                  用户管理
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button v-else text @click="$router.push('/login')" class="login-button">登录</el-button>

          <!-- 主题切换 -->
          <div class="icon-button theme-toggle" @click="themeStore.toggleTheme">
            <svg v-if="themeStore.isDark" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </div>
        </div>
      </div>
    </nav>

    <!-- 移动端搜索对话框 -->
    <el-dialog 
      v-model="showMobileSearch" 
      title="搜索商品"
      :width="'90%'"
      :show-close="true"
      class="mobile-search-dialog"
    >
      <el-input 
        v-model="searchQuery" 
        placeholder="搜索商品..." 
        @keyup.enter="handleSearchClick"
        clearable
        size="large"
        autofocus
        class="mobile-search-input"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
        <template #suffix>
          <el-button 
            :icon="Search" 
            circle 
            size="small"
            @click="handleSearchClick"
            class="search-btn"
          />
        </template>
      </el-input>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useProductStore } from '../stores/product';
import { useUserStore } from '../stores/user';
import { useCartStore } from '../stores/cart';
import { useThemeStore } from '../stores/theme';
import { useRouter, useRoute } from 'vue-router';
import { 
  Search, 
  ShoppingCart, 
  User, 
  ArrowDown, 
  List, 
  SwitchButton, 
  DataAnalysis, 
  Goods, 
  Document
} from '@element-plus/icons-vue';

const productStore = useProductStore();
const userStore = useUserStore();
const cartStore = useCartStore();
const themeStore = useThemeStore();
const router = useRouter();
const route = useRoute();
const searchQuery = ref('');
const showMobileSearch = ref(false);

// Initialize search query from URL on mount
onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search;
  }
});

// Watch route changes to sync search query
watch(() => route.query.search, (newSearch) => {
  searchQuery.value = newSearch || '';
});

const handleSearchClick = () => {
  if (!searchQuery.value.trim()) {
    return;
  }
  
  // 关闭移动端搜索对话框
  showMobileSearch.value = false;
  
  // 跳转到 ProductList 页面并传递搜索参数
  router.push({
    path: '/products',
    query: { search: searchQuery.value }
  });
};

const handleLogout = () => {
  userStore.logout();
  router.push('/');
};
</script>

<style scoped>
/* 固定悬浮导航栏 */
.navbar {
  position: fixed;
  top: var(--spacing-md);
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - var(--spacing-xl) * 2);
  max-width: 1400px;
  z-index: 1000;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 2.5rem;
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(20px);
  transition: var(--transition);
}

.navbar-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  padding: var(--spacing-md) var(--spacing-xl);
  position: relative;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  transition: var(--transition);
}

.logo:hover {
  opacity: 0.8;
}

.logo-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-full);
  background-color: hsl(0, 0%, 18%);
  color: hsl(36, 44%, 96%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  transition: var(--transition);
}

.dark .logo-icon {
  background-color: hsl(36, 44%, 96%);
  color: hsl(0, 0%, 18%);
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
}

/* 搜索框 */
.search-container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 600px;
  z-index: 1;
}

.mobile-search-btn {
  display: none !important;
}

.search-input {
  --el-input-border-radius: var(--radius-base);
  --el-input-bg-color: var(--muted-color);
  --el-input-border-color: var(--border-color);
}

.search-input :deep(.el-input__wrapper) {
  background-color: var(--muted-color);
  border-color: var(--border-color);
}

.search-input :deep(.el-input__wrapper:hover) {
  border-color: var(--secondary-color);
}

.search-btn {
  margin-right: var(--spacing-xs);
}

/* 导航栏操作区 */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  margin-left: auto;
}

.icon-button {
  width: auto;
  height: auto;
  border-radius: 0;
  background-color: transparent;
  border: none;
  color: var(--text-color);
  transition: var(--transition);
  padding: var(--spacing-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.icon-button:hover {
  opacity: 0.7;
  transform: scale(1.1);
}

.user-menu-trigger {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  padding: 0;
  border-radius: 0;
  transition: var(--transition);
  color: var(--text-color);
}

.user-menu-trigger:hover {
  opacity: 0.7;
}

.user-name {
  font-weight: 500;
  color: var(--text-color);
}

.login-button {
  color: var(--text-color);
}

.theme-toggle {
  margin-left: 0;
}

/* 移动端搜索对话框 */
.mobile-search-dialog :deep(.el-dialog) {
  border-radius: var(--radius-lg);
}

.mobile-search-dialog :deep(.el-dialog__header) {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.mobile-search-dialog :deep(.el-dialog__body) {
  padding: var(--spacing-lg);
}

.mobile-search-input {
  --el-input-border-radius: var(--radius-base);
}

@media (max-width: 768px) {
  .navbar {
    width: calc(100% - var(--spacing-md) * 2);
    top: var(--spacing-sm);
    border-radius: 2rem;
  }

  .navbar-content {
    padding: var(--spacing-sm) var(--spacing-md);
    gap: var(--spacing-md);
  }

  /* 隐藏桌面端搜索框 */
  .desktop-search {
    display: none;
  }

  /* 显示移动端搜索按钮 */
  .mobile-search-btn {
    display: flex !important;
  }

  /* 隐藏用户名文字 */
  .user-name {
    display: none;
  }

  .navbar-actions {
    gap: var(--spacing-md);
  }
}
</style>
