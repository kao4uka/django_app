from django.db.models.signals import post_save
from django.dispatch import receiver
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from app.models import Notification, Product


@receiver(post_save, sender=Product)
def create_new_product(sender, instance=None, created=False, **kwargs):
    if created:
        Notification.objects.create(message='New product has been added.')

        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            "notification",
            {
                "type": "notification_message",
                "message": f"New product added: {instance.name}"
            }
        )
