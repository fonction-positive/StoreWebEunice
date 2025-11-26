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
        username_or_email = attrs.get('username')  # 可以是用户名或邮箱
        password = attrs.get('password')
        
        # 尝试通过用户名或邮箱查找用户
        user = None
        
        # 判断是否为邮箱格式
        if re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', username_or_email):
            # 邮箱登录
            try:
                user = User.objects.get(email=username_or_email)
            except User.DoesNotExist:
                raise ValidationError({'detail': '邮箱未注册，请先注册'})
        else:
            # 用户名登录
            try:
                user = User.objects.get(username=username_or_email)
            except User.DoesNotExist:
                raise ValidationError({'detail': '用户名不存在，请先注册'})
        
        # 检查密码是否正确
        if not user.check_password(password):
            raise ValidationError({'detail': '密码错误，请重试'})
        
        # 手动设置 user 对象，以便父类可以使用
        attrs['username'] = user.username
        
        # 如果验证通过，调用父类方法获取token
        return super().validate(attrs)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(APIView):
    """注册 - 发送邮箱验证码"""
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not username or not email or not password:
            return Response({'detail': '用户名、邮箱和密码不能为空'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 验证邮箱格式
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
            return Response({'detail': '邮箱格式不正确'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 检查用户名是否已存在
        if User.objects.filter(username=username).exists():
            return Response({'detail': '用户名已存在'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 检查邮箱是否已存在
        if User.objects.filter(email=email).exists():
            return Response({'detail': '邮箱已被注册'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 检查发送频率限制（60秒）
        last_sent_key = f'register_email_sent:{email}'
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
        
        # 将注册信息和验证码存储到Redis（5分钟过期）
        register_data = {
            'username': username,
            'email': email,
            'password': password,
            'code': code
        }
        cache_key = f'register_data:{email}'
        cache.set(cache_key, register_data, timeout=300)
        
        # 发送邮件
        try:
            subject = 'StoreWeb 注册验证码'
            message = f'''您好，

您正在注册 StoreWeb 账户，验证码是：{code}

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


class VerifyRegisterCodeView(APIView):
    """验证注册验证码并创建用户"""
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')
        
        if not email or not code:
            return Response({'detail': '邮箱和验证码不能为空'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 从Redis获取注册数据
        cache_key = f'register_data:{email}'
        register_data = cache.get(cache_key)
        
        if not register_data:
            return Response({'detail': '验证码已过期或不存在，请重新注册'}, status=status.HTTP_400_BAD_REQUEST)
        
        if register_data['code'] != code:
            return Response({'detail': '验证码错误'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 验证通过，删除验证码
        cache.delete(cache_key)
        
        # 创建用户
        try:
            user = User.objects.create_user(
                username=register_data['username'],
                email=register_data['email'],
                password=register_data['password']
            )
            
            # 生成JWT Token
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': '注册成功',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                }
            }, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response(
                {'detail': f'创建用户失败：{str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

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
        
        # 检查邮箱是否已注册
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'detail': '该邮箱未注册，请先注册'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 验证通过，删除验证码
        cache.delete(cache_key)
        
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


class SendResetPasswordCodeView(APIView):
    """发送重置密码验证码"""
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        user = request.user
        email = user.email
        
        # 检查发送频率限制（60秒）
        last_sent_key = f'reset_password_sent:{email}'
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
        cache_key = f'reset_password_code:{email}'
        cache.set(cache_key, code, timeout=300)
        
        # 记录发送时间
        cache.set(last_sent_key, int(time.time()), timeout=60)
        
        # 发送邮件
        try:
            subject = 'StoreWeb 重置密码验证码'
            message = f'''您好 {user.username}，

您正在进行重置密码操作，验证码是：{code}

验证码有效期为5分钟，请尽快使用。

如果这不是您本人的操作，请立即修改密码并联系客服。

---
StoreWeb 团队'''
            
            send_mail(
                subject,
                message,
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )
            
            return Response({'detail': '验证码已发送到您的邮箱'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'detail': f'邮件发送失败: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResetPasswordView(APIView):
    """通过邮箱验证码重置密码"""
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        user = request.user
        email = user.email
        code = request.data.get('code')
        new_password = request.data.get('new_password')
        
        if not code or not new_password:
            return Response({'detail': '验证码和新密码不能为空'}, status=status.HTTP_400_BAD_REQUEST)
        
        if len(new_password) < 6:
            return Response({'detail': '密码长度不能少于6位'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 验证验证码
        cache_key = f'reset_password_code:{email}'
        stored_code = cache.get(cache_key)
        
        if not stored_code:
            return Response({'detail': '验证码已过期或不存在'}, status=status.HTTP_400_BAD_REQUEST)
        
        if stored_code != code:
            return Response({'detail': '验证码错误'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 验证通过，删除验证码
        cache.delete(cache_key)
        
        # 重置密码
        user.set_password(new_password)
        user.save()
        
        return Response({'detail': '密码重置成功'}, status=status.HTTP_200_OK)
