from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Category(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField(unique=True)
    icon = models.ImageField(upload_to='categories/', null=True, blank=True)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.PROTECT)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    # 价格相关
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text='原价（打折前价格）')
    discount_percentage = models.PositiveIntegerField(default=0, help_text='折扣百分比（0-100）')
    
    # 库存和销售
    stock = models.PositiveIntegerField(default=0)
    is_hot_sale = models.BooleanField(default=False, help_text='热销商品标签')
    
    # 评价相关
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=5.0)
    reviews = models.PositiveIntegerField(default=0)
    
    # 商品规格
    color = models.CharField(max_length=50, blank=True, help_text='颜色')
    size = models.CharField(max_length=50, blank=True, help_text='尺寸/型号')
    material = models.CharField(max_length=100, blank=True, help_text='材质')
    weight = models.CharField(max_length=50, blank=True, help_text='重量（如：15g）')
    length = models.CharField(max_length=50, blank=True, help_text='长度/尺寸（如：120cm）')
    compatibility = models.CharField(max_length=100, blank=True, help_text='适用性/兼容性')
    
    # 状态
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
    @property
    def has_discount(self):
        """是否有折扣"""
        return self.discount_percentage > 0 or (self.original_price and self.original_price > self.price)

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/')
    is_main = models.BooleanField(default=False)

    def __str__(self):
        return f"Image for {self.product.name}"

class Favorite(models.Model):
    """用户收藏的商品"""
    user = models.ForeignKey(User, related_name='favorites', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='favorited_by', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')  # 确保同一用户不会重复收藏同一商品
        ordering = ['-created_at']  # 按创建时间倒序排列

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"
