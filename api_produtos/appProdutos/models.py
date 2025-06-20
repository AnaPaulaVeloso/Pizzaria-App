from django.db import models

# Create your models here.
class Pizza(models.Model):
    nome = models.CharField(max_length=100)
    preco = models.DecimalField(max_digits=6, decimal_places=2)
    ingredientes = models.TextField(blank=True)
    imagem = models.ImageField(upload_to='pizzas/', blank=True, null=True)

class Esfiha(models.Model):
    TIPO_CHOICES = [
        ('simples', 'Simples'),
        ('tradicional', 'Tradicional'),
        ('especiais', 'Especiais'),
        ('premium', 'Premium'),
        ('doces_gourmet', 'Doces Gourmet'),
    ]

    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    nome = models.CharField(max_length=100)
    preco = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    ingredientes = models.TextField(blank=True)
    imagem = models.ImageField(upload_to='esfihas/', blank=True, null=True)


class Bebida(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField(blank=True)
    preco = models.DecimalField(max_digits=5, decimal_places=2)
    imagem = models.ImageField(upload_to='bebidas/', blank=True, null=True)

    def __str__(self):
        return self.nome
