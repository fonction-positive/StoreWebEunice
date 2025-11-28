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
          <h1 class="page-title">{{ isEdit ? '编辑商品' : '新增商品' }}</h1>
        </div>
      </div>
    </header>

    <!-- Form -->
    <div class="form-container">
      <el-form :model="form" label-position="top" class="product-form">
        <el-form-item label="分类" required>
          <el-select v-model="form.category" placeholder="选择分类" size="large">
            <el-option 
              v-for="cat in productStore.categories" 
              :key="cat.id" 
              :label="cat.name" 
              :value="cat.id" 
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="商品名称" required>
          <el-input 
            v-model="form.name" 
            placeholder="输入商品名称"
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="商品描述">
          <el-input 
            v-model="form.description" 
            type="textarea" 
            :rows="4"
            placeholder="输入商品描述"
          />
        </el-form-item>
        
        <div class="form-row">
          <el-form-item label="价格（元）" required>
            <el-input-number 
              v-model="form.price" 
              :precision="2" 
              :step="0.1"
              :min="0"
              size="large"
            />
          </el-form-item>
          
          <el-form-item label="库存（件）" required>
            <el-input-number 
              v-model="form.stock" 
              :min="0"
              size="large"
            />
          </el-form-item>
        </div>
        
        <el-form-item label="商品状态">
          <el-switch 
            v-model="form.is_active"
            active-text="上架"
            inactive-text="下架"
            size="large"
          />
        </el-form-item>
        
        <div class="form-actions">
          <el-button @click="$router.back()" size="large">取消</el-button>
          <el-button type="primary" @click="handleSave" size="large">
            保存
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useProductStore } from '../../stores/product';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';

const productStore = useProductStore();
const route = useRoute();
const router = useRouter();

const isEdit = computed(() => route.params.id !== 'new');
const form = ref({
  category: null,
  name: '',
  description: '',
  price: 0,
  stock: 0,
  is_active: true,
});

onMounted(async () => {
  await productStore.fetchCategories();
  if (isEdit.value) {
    await productStore.fetchProduct(route.params.id);
    if (productStore.currentProduct) {
      const p = productStore.currentProduct;
      form.value = {
        category: p.category,
        name: p.name,
        description: p.description,
        price: Number(p.price),
        stock: p.stock,
        is_active: p.is_active,
      };
    }
  }
});

const handleSave = async () => {
  if (!form.value.category || !form.value.name) {
    ElMessage.warning('请填写必填字段');
    return;
  }
  
  try {
    if (isEdit.value) {
      await productStore.updateProduct(route.params.id, form.value);
      ElMessage.success('更新成功');
    } else {
      await productStore.createProduct(form.value);
      ElMessage.success('创建成功');
    }
    router.push('/manage/products');
  } catch (error) {
    ElMessage.error('保存失败');
  }
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

.form-container {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-2xl);
  box-shadow: var(--shadow-sm);
  max-width: 800px;
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}

.form-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--color-border);
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
  
  .form-container {
    padding: var(--spacing-lg);
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
