from rest_framework import generics, permissions, status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.core.mail import send_mail
from django.conf import settings
from .serializers import UserSerializer, RegisterSerializer, ChangePasswordSerializer
import random
import re
import time

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        # 检查用户是否存在
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise ValidationError({'detail': '用户不存在，请先注册'})
        
        # 检查密码是否正确
        if not user.check_password(password):
            raise ValidationError({'detail': '密码错误，请重试'})
        
        # 如果验证通过，调用父类方法获取token
        return super().validate(attrs)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self, queryset=None):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            
            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SendEmailCodeView(APIView):
    """发送邮箱验证码"""
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        
        # 验证邮箱格式
        if not email or not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
            return Response({'detail': '邮箱格式不正确'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 检查发送频率限制（60秒）
        last_sent_key = f'email_sent:{email}'
        last_sent = cache.get(last_sent_key)
        if last_sent:
            remaining = 60 - int(time.time() - last_sent)
            if remaining > 0:
                return Response(
                    {'detail': f'请等待{remaining}秒后再试'}, 
                    status=status.HTTP_429_TOO_MANY_REQUESTS
                )
        
        # 生成6位随机验证码
        code = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        
        # 存储验证码到Redis（5分钟过期）
        cache_key = f'email_code:{email}'
        cache.set(cache_key, code, timeout=300)
        
        # 发送邮件
        try:
            subject = 'StoreWeb 登录验证码'
            message = f'''您好，

您的登录验证码是：{code}

验证码有效期为5分钟，请尽快使用。

如果这不是您本人的操作，请忽略此邮件。

---
StoreWeb 团队'''
            
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
            
            # 记录发送时间
            cache.set(last_sent_key, int(time.time()), timeout=60)
            
            return Response({'message': '验证码已发送到您的邮箱'}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(
                {'detail': f'发送邮件失败：{str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class EmailLoginView(APIView):
    """邮箱验证码登录"""
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')
        
        if not email or not code:
            return Response({'detail': '邮箱和验证码不能为空'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 验证邮箱格式
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
            return Response({'detail': '邮箱格式不正确'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 从Redis获取验证码
        cache_key = f'email_code:{email}'
        stored_code = cache.get(cache_key)
        
        if not stored_code:
            return Response({'detail': '验证码已过期或不存在'}, status=status.HTTP_400_BAD_REQUEST)
        
        if stored_code != code:
            return Response({'detail': '验证码错误'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 验证通过，删除验证码
        cache.delete(cache_key)
        
        # 查找或创建用户
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # 自动注册新用户
            username = email.split('@')[0]
            # 确保用户名唯一
            base_username = username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            
            # 生成随机密码并创建用户
            import secrets
            import string
            random_password = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(12))
            
            user = User.objects.create_user(
                username=username,
                email=email,
                password=random_password
            )
        
        # 生成JWT Token
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
            }
        }, status=status.HTTP_200_OK)
