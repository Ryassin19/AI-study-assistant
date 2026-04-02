from rest_framework import serializers

# This class translates Python data into JSON format
class MessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=200)