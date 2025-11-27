<template>
  <div class="products-page">
    <!-- Navigation Bar -->
    <NavBar />

    <!-- Main Content -->
    <main class="main-content">
      <div class="container">
        <!-- Search Results Header -->
        <div v-if="searchQuery" class="search-header">
          <p class="search-count">{{ $t('product.found') }} {{ filteredProducts.length }} {{ $t('product.items') }}</p>
        </div>

        <!-- Category Tabs -->
        <div class="category-tabs">
          <button 
            :class="['category-tab', { active: activeCategory === 'all' }]"
            @click="activeCategory = 'all'"
          >
            {{ $t('product.all') }}
          </button>
          <button 
            v-for="category in categories" 
            :key="category.id"
            :class="['category-tab', { active: activeCategory === category.id.toString() }]"
            @click="activeCategory = category.id.toString()"
          >
            {{ category.name }}
          </button>
        </div>

        <!-- Products Grid -->
        <div v-loading="productStore.loading" class="products-grid">
          <div 
            v-for="product in filteredProducts" 
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
              <p class="product-category">{{ product.category_name }}</p>
              <p class="product-price">¥{{ product.price }}</p>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <el-empty 
          v-if="!productStore.loading && filteredProducts.length === 0" 
          :description="$t('product.noProducts')"
          :image-size="120"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import NavBar from '../../components/NavBar.vue';
import { ref, computed, onMounted, watch } from 'vue';
import { useProductStore } from '../../stores/product';
import { useRouter, useRoute } from 'vue-router';
import { Picture } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const productStore = useProductStore();
const router = useRouter();
const route = useRoute();
const activeCategory = ref('all');
const searchQuery = ref('');

// Get unique categories from products
const categories = computed(() => {
  const categoryMap = new Map();
  productStore.products.forEach(product => {
    if (product.category && !categoryMap.has(product.category)) {
      categoryMap.set(product.category, {
        id: product.category,
        name: product.category_name
      });
    }
  });
  return Array.from(categoryMap.values());
});

// Filter products by category and search query
const filteredProducts = computed(() => {
  let products = productStore.products;
  
  // Filter by category
  if (activeCategory.value !== 'all') {
    products = products.filter(
      product => product.category.toString() === activeCategory.value
    );
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    products = products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      (product.description && product.description.toLowerCase().includes(query)) ||
      (product.category_name && product.category_name.toLowerCase().includes(query))
    );
  }
  
  return products;
});

const handleCategoryChange = (categoryId) => {
  activeCategory.value = categoryId;
};

const goToDetail = (id) => {
  router.push(`/product/${id}`);
};

onMounted(() => {
  productStore.fetchProducts();
  
  // Get search query from URL
  if (route.query.search) {
    searchQuery.value = route.query.search;
  }
});

// Watch for route query changes
watch(() => route.query.search, (newSearch) => {
  searchQuery.value = newSearch || '';
});
</script>

<style scoped>
.products-page {
  min-height: 100vh;
  background-color: var(--bg-color);
  transition: background-color 0.3s ease;
}

.main-content {
  padding-top: calc(6rem + var(--spacing-xl));
  padding-bottom: var(--spacing-2xl);
}

.search-header {
  margin-bottom: var(--spacing-xl);
}

.page-title {
  font-family: var(--font-serif);
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: var(--spacing-sm);
  color: var(--text-color);
}

.search-count {
  font-size: 1rem;
  color: var(--secondary-color);
  margin: 0;
}


.category-tabs {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-2xl);
  flex-wrap: wrap;
}

.category-tab {
  font-family: var(--font-sans);
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-color);
  background-color: transparent;
  border: none;
  border-radius: var(--radius-base);
  padding: var(--spacing-sm) var(--spacing-lg);
  cursor: pointer;
  transition: all 0.3s ease;
  transform: scale(1);
  outline: none;
}

.category-tab:hover {
  transform: scale(1.05);
}

.category-tab.active {
  background-color: var(--primary-color);
  color: var(--primary-text);
  transform: scale(1.1);
}


.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--spacing-xl);
}

/* Product Card */
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
  margin-bottom: var(--spacing-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-category {
  font-size: 0.875rem;
  color: var(--secondary-color);
  margin-bottom: var(--spacing-sm);
}

.product-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--accent-color);
}

/* Responsive */
@media (max-width: 1024px) {


  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: var(--spacing-lg);
  }
}

@media (max-width: 768px) {


  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--spacing-md);
  }

  .product-image-wrapper {
    height: 200px;
  }
}
</style>
