
import requests
import json
import os

# URLs da API
URL_PIZZA = "http://localhost:8000/api/cadastrar-pizza/"
URL_ESFIHA = "http://localhost:8000/api/cadastrar-esfiha/"

# Caminho base para as imagens (ajuste conforme necessário)
BASE_MEDIA_PATH = "media/"

def enviar_pizzas():
    with open("pizzas.json", "r", encoding="utf-8") as f:
        pizzas = json.load(f)

    for pizza in pizzas:
        imagem_path = pizza.get("imagem", "")
        files = {}
        if imagem_path and os.path.exists(imagem_path):
            files["imagem"] = open(imagem_path, "rb")
        
        response = requests.post(URL_PIZZA, data=pizza, files=files)
        print("Pizza:", pizza["nome"], "-", response.status_code, response.text)

def enviar_esfihas():
    with open("esfihas.json", "r", encoding="utf-8") as f:
        esfihas = json.load(f)

    for esfiha in esfihas:
        imagem_path = esfiha.get("imagem", "")
        files = {}
        if imagem_path and os.path.exists(imagem_path):
            files["imagem"] = open(imagem_path, "rb")
        
        response = requests.post(URL_ESFIHA, data=esfiha, files=files)
        print("Esfiha:", esfiha["nome"], "-", response.status_code, response.text)

if __name__ == "__main__":
    enviar_pizzas()
    enviar_esfihas()
