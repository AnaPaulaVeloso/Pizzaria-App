from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Pizza, Esfiha, Bebida
from .serializers import PizzaSerializer, EsfihaSerializer, BebidaSerializer

# Create your views here.
def home(request):
    return render(request, 'index.html')

@api_view(['GET', 'POST'])
def cadastrar_pizza(request):
    if request.method == 'GET':
        return Response({'mensagem': 'Use POST para cadastrar uma pizza.'})
    
    serializer = PizzaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'mensagem': 'Pizza cadastrada com sucesso!'})
    return Response(serializer.errors, status=400)

@api_view(['GET', 'PUT', 'DELETE'])
def pizza_detail(request, id):
    try:
        pizza = Pizza.objects.get(pk=id)
    except Pizza.DoesNotExist:
        return Response({"erro": "Pizza não encontrada"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PizzaSerializer(pizza)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = PizzaSerializer(pizza, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'mensagem': 'Pizza atualizada com sucesso!'})
        return Response(serializer.errors, status=400)
    elif request.method == 'DELETE':
        pizza.delete()
        return Response({'mensagem': 'Pizza deletada com sucesso!'})


@api_view(['GET', 'POST'])
def cadastrar_esfiha(request):
    if request.method == 'GET':
        return Response({'mensagem': 'Use POST para cadastrar uma esfiha.'})
    
    serializer = EsfihaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'mensagem': 'Esfiha cadastrada com sucesso!'})
    return Response(serializer.errors, status=400)

@api_view(['GET', 'PUT', 'DELETE'])
def esfiha_detail(request, id):
    try:
        esfiha = Esfiha.objects.get(pk=id)
    except Esfiha.DoesNotExist:
        return Response({"erro": "Esfiha não encontrada"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = EsfihaSerializer(esfiha)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = EsfihaSerializer(esfiha, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'mensagem': 'Esfiha atualizada com sucesso!'})
        return Response(serializer.errors, status=400)
    elif request.method == 'DELETE':
        esfiha.delete()
        return Response({'mensagem': 'Esfiha deletada com sucesso!'})

@api_view(['GET'])
def listar_pizzas(request, id=None):
    if id is not None:
        try:
            pizza = Pizza.objects.get(pk=id)
            serializer = PizzaSerializer(pizza)
            return Response(serializer.data)
        except Pizza.DoesNotExist:
            return Response({"erro": "Pizza não encontrada"}, status=status.HTTP_404_NOT_FOUND)
    else:
        pizzas = Pizza.objects.all()
        serializer = PizzaSerializer(pizzas, many=True)
        return Response(serializer.data)
    

@api_view(['GET'])
def listar_esfihas(request, id=None):
    if id is not None:
        try:
            esfiha = Esfiha.objects.get(pk=id)
            serializer = EsfihaSerializer(esfiha)
            return Response(serializer.data)
        except Esfiha.DoesNotExist:
            return Response({"erro": "Esfiha não encontrada"}, status=status.HTTP_404_NOT_FOUND)
    else:
        esfihas = Esfiha.objects.all()
        serializer = EsfihaSerializer(esfihas, many=True)
        return Response(serializer.data)
    
@api_view(['GET', 'POST'])
def cadastrar_bebida(request):
    if request.method == 'GET':
        return Response({'mensagem': 'Use POST para cadastrar uma bebida.'})
    
    serializer = BebidaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'mensagem': 'Bebida cadastrada com sucesso!'})
    return Response(serializer.errors, status=400)

@api_view(['GET', 'PUT', 'DELETE'])
def bebida_detail(request, id):
    try:
        bebida = Bebida.objects.get(pk=id)
    except Bebida.DoesNotExist:
        return Response({"erro": "Bebida não encontrada"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = BebidaSerializer(bebida)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = BebidaSerializer(bebida, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'mensagem': 'Bebida atualizada com sucesso!'})
        return Response(serializer.errors, status=400)
    elif request.method == 'DELETE':
        bebida.delete()
        return Response({'mensagem': 'Bebida deletada com sucesso!'})

@api_view(['GET'])
def listar_bebidas(request, id=None):
    if id is not None:
        try:
            bebida = Bebida.objects.get(pk=id)
            serializer = BebidaSerializer(bebida)
            return Response(serializer.data)
        except Bebida.DoesNotExist:
            return Response({"erro": "Bebida não encontrada"}, status=status.HTTP_404_NOT_FOUND)
    else:
        bebidas = Bebida.objects.all()
        serializer = BebidaSerializer(bebidas, many=True)
        return Response(serializer.data)