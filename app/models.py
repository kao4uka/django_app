from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'


class Product(models.Model):
    name = models.CharField(max_length=100)
    category = models.ManyToManyField(to=Category, related_name='category')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    publish_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Product'
        verbose_name_plural = 'Products'


class Review(models.Model):
    text = models.CharField(max_length=355)
    product = models.ForeignKey(to=Product, on_delete=models.CASCADE, related_name='product_review')
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='user_review')

    class Meta:
        verbose_name = 'Review'
        verbose_name_plural = 'Reviews'


class Notification(models.Model):
    message = models.CharField(max_length=355)

    def __str__(self):
        return self.message

    class Meta:
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'


class Profile(models.Model):
    user = models.OneToOneField(to=User, on_delete=models.CASCADE)
    image = models.ImageField(default='default.jpg', upload_to='profile_pics')

    def __str__(self):
        return f'{self.user.username} Profile'

    class Meta:
        verbose_name = 'Profile'
        verbose_name_plural = 'Profiles'
