from rest_framework import serializers
from .models import Pizza, Esfiha, Bebida

class PizzaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pizza
        fields = '__all__'

class EsfihaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Esfiha
        fields = '__all__'

class BebidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bebida
        fields = '__all__'
