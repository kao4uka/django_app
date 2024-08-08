from rest_framework import serializers
from app.models import Product, Category, Review, Profile


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ("text", "product", "created_at")


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()
    product_review = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ("id", "name", "category", "product_review", "price", "description")

    def get_category(self, obj):
        category = obj.category.all()
        return [category.name for category in category]


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'
