from rest_framework import serializers
from .models import Category, Product, ProductImage, Favorite

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ('id', 'image', 'is_main')

    def get_image(self, obj):
        if obj.image:
            return obj.image.url
        return None

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    main_image = serializers.SerializerMethodField()
    has_discount = serializers.ReadOnlyField()
    is_favorited = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            'id', 'category', 'category_name', 'name', 'description', 
            'price', 'original_price', 'discount_percentage', 'has_discount',
            'stock', 'is_hot_sale',
            'rating', 'reviews', 
            'color', 'size', 'material', 'weight', 'length', 'compatibility',
            'is_active', 'images', 'main_image', 'created_at', 'is_favorited'
        )

    def get_main_image(self, obj):
        main_img = obj.images.filter(is_main=True).first()
        if main_img:
            return ProductImageSerializer(main_img, context=self.context).data
        first_img = obj.images.first()
        if first_img:
            return ProductImageSerializer(first_img, context=self.context).data
        return None

    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Favorite.objects.filter(user=request.user, product=obj).exists()
        return False

class FavoriteSerializer(serializers.ModelSerializer):
    product_detail = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = Favorite
        fields = ('id', 'product', 'product_detail', 'created_at')
        read_only_fields = ('created_at',)
