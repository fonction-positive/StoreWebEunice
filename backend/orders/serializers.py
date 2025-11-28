from rest_framework import serializers
from .models import Address, Cart, CartItem, Order, OrderItem
from products.serializers import ProductSerializer

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'
        read_only_fields = ('user',)

class CartItemSerializer(serializers.ModelSerializer):
    product_detail = ProductSerializer(source='product', read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ('id', 'product', 'product_detail', 'quantity', 'subtotal', 'created_at')
        read_only_fields = ('cart',)

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()
    total_count = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ('id', 'items', 'total_price', 'total_count', 'created_at', 'updated_at')

    def get_total_price(self, obj):
        return sum(item.subtotal for item in obj.items.all())

    def get_total_count(self, obj):
        return sum(item.quantity for item in obj.items.all())

class OrderItemSerializer(serializers.ModelSerializer):
    product_image = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_name', 'product_image', 'price', 'quantity', 'subtotal')
    
    def get_product_image(self, obj):
        if obj.product:
            # 获取主图
            main_img = obj.product.images.filter(is_main=True).first()
            if not main_img:
                main_img = obj.product.images.first()
            if main_img and main_img.image:
                return main_img.image.url
        return None

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Order
        fields = ('id', 'order_no', 'total_amount', 'status', 'status_display',
                 'shipping_name', 'shipping_phone', 'shipping_province', 'shipping_city',
                 'shipping_district', 'shipping_address', 'tracking_no',
                 'items', 'created_at', 'paid_at', 'shipped_at', 'completed_at')
        read_only_fields = ('order_no', 'user', 'created_at', 'paid_at', 'shipped_at', 'completed_at')

class CreateOrderSerializer(serializers.Serializer):
    address_id = serializers.IntegerField()
    items = serializers.ListField(
        child=serializers.DictField(child=serializers.IntegerField())
    )
