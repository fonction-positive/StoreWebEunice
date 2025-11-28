from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db import transaction
from .models import Address, Cart, CartItem, Order, OrderItem
from products.models import Product
from .serializers import (
    AddressSerializer, CartSerializer, CartItemSerializer,
    OrderSerializer, CreateOrderSerializer
)

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CartViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        """获取购物车"""
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """添加商品到购物车"""
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        try:
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response({'error': '商品不存在'}, status=status.HTTP_404_NOT_FOUND)

        if product.stock < quantity:
            return Response({'error': '库存不足'}, status=status.HTTP_400_BAD_REQUEST)

        cart, created = Cart.objects.get_or_create(user=request.user)
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )

        if not created:
            # 商品已存在，增加数量
            cart_item.quantity += quantity
            if cart_item.quantity > product.stock:
                return Response({'error': '库存不足'}, status=status.HTTP_400_BAD_REQUEST)
            cart_item.save()

        return Response({'message': '添加成功'}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['put'], url_path='update_item/(?P<item_id>[^/.]+)')
    def update_item(self, request, item_id=None):
        """更新购物车商品数量"""
        quantity = request.data.get('quantity', 1)

        try:
            cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({'error': '购物车项不存在'}, status=status.HTTP_404_NOT_FOUND)

        if quantity <= 0:
            cart_item.delete()
            return Response({'message': '已删除'}, status=status.HTTP_204_NO_CONTENT)

        if cart_item.product.stock < quantity:
            return Response({'error': '库存不足'}, status=status.HTTP_400_BAD_REQUEST)

        cart_item.quantity = quantity
        cart_item.save()
        return Response({'message': '更新成功'})

    @action(detail=False, methods=['delete'], url_path='remove_item/(?P<item_id>[^/.]+)')
    def remove_item(self, request, item_id=None):
        """删除购物车商品"""
        try:
            cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
            cart_item.delete()
            return Response({'message': '删除成功'}, status=status.HTTP_204_NO_CONTENT)
        except CartItem.DoesNotExist:
            return Response({'error': '购物车项不存在'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def clear(self, request):
        """清空购物车"""
        cart = get_object_or_404(Cart, user=request.user)
        cart.items.all().delete()
        return Response({'message': '购物车已清空'})

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Order.objects.filter(user=self.request.user)
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset

    @transaction.atomic
    def create(self, request):
        """创建订单"""
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        address_id = serializer.validated_data['address_id']
        items_data = serializer.validated_data['items']

        # 获取地址
        try:
            address = Address.objects.get(id=address_id, user=request.user)
        except Address.DoesNotExist:
            return Response({'error': '地址不存在'}, status=status.HTTP_404_NOT_FOUND)

        # 计算总价并验证库存
        total_amount = 0
        order_items = []

        for item_data in items_data:
            product_id = item_data['product_id']
            quantity = item_data['quantity']

            try:
                product = Product.objects.select_for_update().get(id=product_id, is_active=True)
            except Product.DoesNotExist:
                return Response({'error': f'商品 {product_id} 不存在'}, status=status.HTTP_404_NOT_FOUND)

            if product.stock < quantity:
                return Response({'error': f'商品 {product.name} 库存不足'}, status=status.HTTP_400_BAD_REQUEST)

            total_amount += product.price * quantity
            order_items.append({
                'product': product,
                'quantity': quantity,
                'price': product.price
            })

        # 创建订单
        order = Order.objects.create(
            user=request.user,
            total_amount=total_amount,
            shipping_name=address.recipient_name,
            shipping_phone=address.phone,
            shipping_province=address.province,
            shipping_city=address.city,
            shipping_district=address.district,
            shipping_address=address.address,
        )

        # 创建订单项并扣减库存
        for item in order_items:
            OrderItem.objects.create(
                order=order,
                product=item['product'],
                product_name=item['product'].name,
                price=item['price'],
                quantity=item['quantity']
            )
            # 扣减库存
            item['product'].stock -= item['quantity']
            item['product'].save()

        # 清空购物车中的已下单商品
        cart = Cart.objects.filter(user=request.user).first()
        if cart:
            product_ids = [item['product'].id for item in order_items]
            cart.items.filter(product_id__in=product_ids).delete()

        return Response(OrderSerializer(order, context={'request': request}).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def pay(self, request, pk=None):
        """模拟支付"""
        order = self.get_object()
        if order.status != 'pending':
            return Response({'error': '订单状态不正确'}, status=status.HTTP_400_BAD_REQUEST)

        order.status = 'paid'
        order.paid_at = timezone.now()
        order.save()
        return Response({'message': '支付成功'})

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """取消订单"""
        order = self.get_object()
        if order.status not in ['pending', 'paid']:
            return Response({'error': '该订单无法取消'}, status=status.HTTP_400_BAD_REQUEST)

        # 恢复库存
        for item in order.items.all():
            if item.product:
                item.product.stock += item.quantity
                item.product.save()

        order.status = 'cancelled'
        order.save()
        return Response({'message': '订单已取消'})

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """确认收货"""
        order = self.get_object()
        if order.status != 'shipped':
            return Response({'error': '订单状态不正确'}, status=status.HTTP_400_BAD_REQUEST)

        order.status = 'completed'
        order.completed_at = timezone.now()
        order.save()
        return Response({'message': '确认收货成功'})

class AdminOrderViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        queryset = Order.objects.all()
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset

    @action(detail=True, methods=['post'])
    def ship(self, request, pk=None):
        """发货"""
        order = self.get_object()
        if order.status != 'paid':
            return Response({'error': '只能对已支付订单发货'}, status=status.HTTP_400_BAD_REQUEST)

        tracking_no = request.data.get('tracking_no', '')
        order.status = 'shipped'
        order.tracking_no = tracking_no
        order.shipped_at = timezone.now()
        order.save()
        return Response({'message': '发货成功'})

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """管理员取消订单"""
        order = self.get_object()
        if order.status in ['completed', 'cancelled']:
            return Response({'error': '该订单无法取消'}, status=status.HTTP_400_BAD_REQUEST)

        # 恢复库存
        for item in order.items.all():
            if item.product:
                item.product.stock += item.quantity
                item.product.save()

        order.status = 'cancelled'
        order.save()
        return Response({'message': '订单已取消'})
