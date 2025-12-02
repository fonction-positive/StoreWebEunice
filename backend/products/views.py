from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from .models import Category, Product, Favorite
from .serializers import CategorySerializer, ProductSerializer, FavoriteSerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny] # Public read, Admin write handled below
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'category__name']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'rating', 'created_at']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        if self.request.user.is_staff and self.request.path.startswith('/api/v1/admin/'):
             return Product.objects.all()
        return Product.objects.filter(is_active=True)

class AdminProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAdminUser]

class FavoriteViewSet(viewsets.ViewSet):
    """用户收藏夹管理"""
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        """获取用户的收藏列表"""
        favorites = Favorite.objects.filter(user=request.user).select_related('product')
        serializer = FavoriteSerializer(favorites, many=True, context={'request': request})
        return Response(serializer.data)

    def create(self, request):
        """添加商品到收藏夹"""
        product_id = request.data.get('product_id')
        
        if not product_id:
            return Response({'error': '商品ID不能为空'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response({'error': '商品不存在'}, status=status.HTTP_404_NOT_FOUND)
        
        # 检查是否已经收藏
        favorite, created = Favorite.objects.get_or_create(
            user=request.user,
            product=product
        )
        
        if created:
            serializer = FavoriteSerializer(favorite, context={'request': request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': '该商品已在收藏夹中'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['delete'], url_path='remove/(?P<product_id>[^/.]+)')
    def remove(self, request, product_id=None):
        """从收藏夹移除商品"""
        try:
            favorite = Favorite.objects.get(user=request.user, product_id=product_id)
            favorite.delete()
            return Response({'message': '已取消收藏'}, status=status.HTTP_204_NO_CONTENT)
        except Favorite.DoesNotExist:
            return Response({'error': '该商品不在收藏夹中'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def toggle(self, request):
        """切换收藏状态（收藏/取消收藏）"""
        product_id = request.data.get('product_id')
        
        if not product_id:
            return Response({'error': '商品ID不能为空'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response({'error': '商品不存在'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            favorite = Favorite.objects.get(user=request.user, product=product)
            favorite.delete()
            return Response({'message': '已取消收藏', 'is_favorited': False}, status=status.HTTP_200_OK)
        except Favorite.DoesNotExist:
            favorite = Favorite.objects.create(user=request.user, product=product)
            return Response({'message': '已添加到收藏夹', 'is_favorited': True}, status=status.HTTP_201_CREATED)
