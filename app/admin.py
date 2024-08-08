from django.contrib import admin
from app.models import Category, Profile, Product, Review, Notification


class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'publish_on')
    ordering = ('-publish_on',)
    readonly_fields = ('publish_on',)


class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'image')


admin.site.register(Category)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Review)
admin.site.register(Notification)
