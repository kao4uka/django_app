from django.urls import path, include
from drf_yasg import openapi
from drf_yasg.generators import OpenAPISchemaGenerator
from drf_yasg.views import get_schema_view
from rest_framework import permissions, routers

from app.views import (
    ProductReviewCreateView,
    ProductRetrieveView,
    ProductCreateView,
    ProductDetailView,
    ProductDeleteView,
    CategoryListView,
    ProductListView,
    ProfileViewset
)

router = routers.DefaultRouter()
router.register(r'profile', ProfileViewset, basename="user-profile")


class ProductAPISchemeGenerator(OpenAPISchemaGenerator):
    def get_schema(self, request=None, public=False):
        schema = super().get_schema(request, public)
        schema.base_path = "/api/core/"
        schema.schemes = ["http", "https"]
        return schema


urlpatterns = [
    path('create/', ProductCreateView.as_view(), name='create-product'),
    path('retrieve/<int:pk>/', ProductRetrieveView.as_view(), name='retrieve-product'),
    path('list/', ProductListView.as_view(), name='list-of-product'),
    path('product/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('delete/<int:pk>/', ProductDeleteView.as_view(), name='delete-product'),
    path('category/', CategoryListView.as_view(), name='list-of-category'),
    path('review/create/', ProductReviewCreateView.as_view(), name='create-review'),
    path('', include(router.urls)),

    path(
        "swagger-ui/",
        get_schema_view(
            info=openapi.Info(
                title="TestAPI",
                default_version="v1",
            ),
            public=True,
            permission_classes=[permissions.AllowAny],
            generator_class=ProductAPISchemeGenerator,
        ).with_ui("swagger"),
    ),
    path(
        "redoc/",
        get_schema_view(
            info=openapi.Info(
                title="TestAPI",
                default_version="v1",
            ),
            public=True,
            permission_classes=[permissions.AllowAny],
            generator_class=ProductAPISchemeGenerator,
        ).with_ui("redoc"),
    ),
]
