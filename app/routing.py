from django.urls import path
from app.consumers import NotificationConsumer

websocket_urlpatterns = [
    path("ws/notify/", NotificationConsumer.as_asgi()),
]
