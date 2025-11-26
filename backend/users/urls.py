from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, UserDetailView, CustomTokenObtainPairView, 
    ChangePasswordView, SendEmailCodeView, EmailLoginView,
    VerifyRegisterCodeView, SendResetPasswordCodeView, ResetPasswordView
)
from .admin_views import AdminUserViewSet, AdminStatsViewSet
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'admin/users', AdminUserViewSet, basename='admin-users')
router.register(r'admin/stats', AdminStatsViewSet, basename='admin-stats')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/verify_register/', VerifyRegisterCodeView.as_view(), name='verify_register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', UserDetailView.as_view(), name='user_detail'),
    path('auth/password_change/', ChangePasswordView.as_view(), name='change_password'),
    path('auth/send_email_code/', SendEmailCodeView.as_view(), name='send_email_code'),
    path('auth/email_login/', EmailLoginView.as_view(), name='email_login'),
    path('auth/send_reset_code/', SendResetPasswordCodeView.as_view(), name='send_reset_code'),
    path('auth/reset_password/', ResetPasswordView.as_view(), name='reset_password'),
]
