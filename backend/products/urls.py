from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet, AdminProductViewSet, FavoriteViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'favorites', FavoriteViewSet, basename='favorites')
router.register(r'admin/products', AdminProductViewSet, basename='admin-products')

urlpatterns = [
    path('', include(router.urls)),
]
