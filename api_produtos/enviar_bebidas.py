import requests
import json
import os

# URL da API para cadastrar bebidas
URL_BEBIDA = "http://127.0.0.1:8000/api/cadastrar-bebida/"

# Caminho base para as imagens (ajuste conforme necessário)
BASE_MEDIA_PATH = "media/"

def enviar_bebidas():
    with open("bebidas.json", "r", encoding="utf-8") as f:
        bebidas = json.load(f)

    for bebida in bebidas:
        imagem_path = bebida.get("imagem", "")
        files = {}
        if imagem_path and os.path.exists(imagem_path):
            files["imagem"] = open(imagem_path, "rb")

        response = requests.post(URL_BEBIDA, data=bebida, files=files)
        print("Bebida:", bebida["nome"], "-", response.status_code, response.text)

if __name__ == "__main__":
    enviar_bebidas()