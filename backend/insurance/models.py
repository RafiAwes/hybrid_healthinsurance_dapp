from django.db import models
from django.contrib.auth.models import AbstractUser

class AdminUser(AbstractUser):
    # optional: extra fields if you want
    pass

class ClaimCheck(models.Model):
    name = models.CharField(max_length=255)
    nid = models.CharField(max_length=20)
    transaction_id = models.CharField(max_length=100)
    status = models.CharField(max_length=20, default='pending')  # approved / rejected
