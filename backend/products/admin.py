from django.contrib import admin
from .models import Category, Product, ProductImage, Favorite

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'original_price', 'discount_percentage', 'stock', 'is_hot_sale', 'rating', 'is_active', 'created_at')
    list_filter = ('category', 'is_active', 'is_hot_sale')
    search_fields = ('name', 'description')
    inlines = [ProductImageInline]
    fieldsets = (
        ('基本信息', {
            'fields': ('category', 'name', 'description', 'is_active')
        }),
        ('价格与折扣', {
            'fields': ('price', 'original_price', 'discount_percentage')
        }),
        ('库存与销售', {
            'fields': ('stock', 'is_hot_sale')
        }),
        ('评价', {
            'fields': ('rating', 'reviews')
        }),
        ('商品规格', {
            'fields': ('color', 'size', 'material', 'weight', 'length', 'compatibility'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'product__name')
    date_hierarchy = 'created_at'
