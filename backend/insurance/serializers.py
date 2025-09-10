from rest_framework import serializers
from .models import AdminUser, ClaimCheck

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for registering a new AdminUser.
    """
    password = serializers.CharField(write_only=True)

    class Meta:
        model = AdminUser
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = AdminUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class ClaimCheckSerializer(serializers.ModelSerializer):
    """
    Serializer for ClaimCheck model.
    """
    class Meta:
        model = ClaimCheck
        fields = '__all__'