from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, generics, viewsets
from rest_framework.response import Response

from app.models import Product, Category, Profile
from app.serializers import ProductSerializer, CategorySerializer, ReviewSerializer, ProfileSerializer


class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.all().order_by('id')

    @swagger_auto_schema(
        tags=["Products"],
        responses={
            200: 'Success',
            400: 'Bad Request'
        },
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class ProductDetailView(generics.RetrieveAPIView):
    """
    API view to retrieve details of a single product.
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    @swagger_auto_schema(
        tags=['Products'],
        responses={
            200: 'Success',
            400: 'Bad Request'
        }
    )
    def get(self, request, *args, **kwargs):
        """
        Retrieve a product by its ID.
        """
        return super().get(request, *args, **kwargs)


class ProductDeleteView(generics.DestroyAPIView):
    queryset = Product.objects.all()

    @swagger_auto_schema(
        tags=["Products"],
        responses={
            204: openapi.Response(description="Product successfully deleted"),
            403: openapi.Response(description="Permission denied"),
        }
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)


class ProductCreateView(generics.CreateAPIView):
    serializer_class = ProductSerializer

    @swagger_auto_schema(
        tags=["Products"],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["name", "price"],
            properties={
                "name": openapi.Schema(type=openapi.TYPE_STRING, description="Name of the product"),
                "category": openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_INTEGER),
                                           description="Categories of the product"),
                'price': openapi.Schema(type=openapi.TYPE_NUMBER, description="Price of the product"),
                'description': openapi.Schema(type=openapi.TYPE_STRING, description="Description of the product"),
            },
        ),
        responses={201: 'Created', 400: 'Bad Request'}
    )
    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ProductRetrieveView(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    @swagger_auto_schema(
        tags=["Products"],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "name": openapi.Schema(type=openapi.TYPE_STRING, description="Name of the product"),
                "category": openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_INTEGER),
                                           description="Categories of the product"),
                'price': openapi.Schema(type=openapi.TYPE_NUMBER, description="Price of the product"),
                'description': openapi.Schema(type=openapi.TYPE_STRING, description="Description of the product"),
            },
        ),
        responses={200: 'Success', 400: 'Bad Request'}
    )
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

    @swagger_auto_schema(tags=['Products'])
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)


class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer

    @swagger_auto_schema(
        tags=["Categories"],
        responses={
            200: 'Success',
            400: 'Bad Request'
        }
    )
    def get_queryset(self):
        return Category.objects.all().order_by('name')


class ProductReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewSerializer

    @swagger_auto_schema(
        tags=["Reviews"],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["text", "product"],
            properties={
                "text": openapi.Schema(type=openapi.TYPE_STRING, description="Text of the review"),
                'product': openapi.Schema(type=openapi.TYPE_INTEGER, description="Product of the review"),
            },
        ),
        responses={201: 'Created', 400: 'Bad Request'}
    )
    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ProfileViewset(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
