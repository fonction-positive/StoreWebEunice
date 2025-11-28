<template>
  <div class="admin-page">
    <!-- Header -->
    <header class="admin-header">
      <div class="header-content">
        <div class="title-row">
          <el-button text @click="$router.back()" class="back-button">
            <el-icon><ArrowLeft /></el-icon>
            返回
          </el-button>
          <h1 class="page-title">商品管理</h1>
        </div>
        <el-button type="primary" @click="$router.push('/manage/products/new')" size="large">
          <el-icon><Plus /></el-icon>
          添加商品
        </el-button>
      </div>
    </header>

    <!-- Table -->
    <div class="table-container">
      <el-table 
        :data="productStore.products" 
        style="width: 100%" 
        v-loading="productStore.loading"
        :header-cell-style="{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)', fontWeight: '600', fontSize: '13px' }"
      >
        <el-table-column prop="id" label="ID" width="80" />
        
        <el-table-column label="图片" width="100">
          <template #default="scope">
            <div class="product-thumbnail">
              <img 
                v-if="scope.row.main_image" 
                :src="scope.row.main_image.image" 
                alt="product"
              />
              <div v-else class="thumbnail-placeholder">
                <el-icon><Picture /></el-icon>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="name" label="名称" min-width="200" />
        <el-table-column prop="category_name" label="分类" width="120" />
        <el-table-column prop="price" label="价格" width="120">
          <template #default="scope">
            <span class="price-text">¥{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag 
              :type="scope.row.is_active ? 'success' : 'danger'"
              size="small"
              effect="plain"
            >
              {{ scope.row.is_active ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button 
              size="small" 
              text
              @click="$router.push(`/manage/products/${scope.row.id}`)"
            >
              编辑
            </el-button>
            <el-button 
              size="small" 
              type="danger"
              text
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useProductStore } from '../../stores/product';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Picture, ArrowLeft } from '@element-plus/icons-vue';

const productStore = useProductStore();

onMounted(() => {
  productStore.fetchAllProducts();
});

const handleDelete = (product) => {
  ElMessageBox.confirm(
    `确定要删除商品"${product.name}"吗？`,
    '删除确认',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        await productStore.deleteProduct(product.id);
        ElMessage.success('删除成功');
        productStore.fetchAllProducts();
      } catch (error) {
        ElMessage.error('删除失败');
      }
    })
    .catch(() => {});
};
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background-color: var(--color-bg-secondary);
  padding: var(--spacing-xl);
}

.admin-header {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
  margin: 0;
}

.back-button {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-primary);
}

.table-container {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.product-thumbnail {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background-color: var(--color-bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-placeholder {
  color: var(--color-text-secondary);
}

.price-text {
  color: var(--color-price);
  font-weight: 600;
}

@media (max-width: 768px) {
  .admin-page {
    padding: var(--spacing-md);
  }
  
  .admin-header {
    padding: var(--spacing-lg);
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .header-content {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: flex-start;
  }
}
</style>
