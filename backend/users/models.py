from django.contrib.auth.models import AbstractUser
from django.db import models

def user_avatar_path(instance, filename):
    # 文件将被上传到 MEDIA_ROOT/users/<id>/avatar/<filename>
    return f'users/{instance.id}/avatar/{filename}'

class User(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    avatar = models.ImageField(upload_to=user_avatar_path, null=True, blank=True)

    def __str__(self):
        return self.username
