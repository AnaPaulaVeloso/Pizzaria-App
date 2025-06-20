from django.urls import path
from . import views

urlpatterns = [
    # Pizzas
    path('cadastrar-pizza/', views.cadastrar_pizza),
    path('pizza/<int:id>/', views.pizza_detail),

    # Esfihas
    path('cadastrar-esfiha/', views.cadastrar_esfiha),
    path('esfiha/<int:id>/', views.esfiha_detail),

    # Bebidas
    path('cadastrar-bebida/', views.cadastrar_bebida),
    path('bebida/<int:id>/', views.bebida_detail),

    # Listagem geral
    path('listar-pizzas/', views.listar_pizzas),
    path('listar-pizzas/<int:id>/', views.listar_pizzas),
    path('listar-esfihas/', views.listar_esfihas),
    path('listar-esfihas/<int:id>/', views.listar_esfihas),
    path('listar-bebidas/', views.listar_bebidas),
    path('listar-bebidas/<int:id>/', views.listar_bebidas),
]
