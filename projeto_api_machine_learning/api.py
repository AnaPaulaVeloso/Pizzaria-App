from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pickle
import numpy as np
from typing import List

app = FastAPI(title="API de Previsão de Pedidos de Pizza")

# Configurando CORS para permitir acesso do React Native Web
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Origem específica do React Native Web
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Métodos permitidos
    allow_headers=["*"],  # Headers permitidos
    expose_headers=["*"],  # Headers expostos
)

# Carregando os modelos treinados
with open('modelo_tipo.pkl', 'rb') as f:
    modelo_tipo = pickle.load(f)

with open('modelo_sabor.pkl', 'rb') as f:
    modelo_sabor = pickle.load(f)

@app.get("/")
async def root():
    return {"message": "Bem-vindo à API de previsão de pedidos de pizza!"}

@app.get("/prever/{quantidade_pessoas}")
async def prever_pedido(quantidade_pessoas: int):
    try:
        # Criando o array de entrada com a quantidade de pessoas
        X = np.array([[quantidade_pessoas]])
        
        # Fazendo as previsões
        tipo_predito = modelo_tipo.predict(X)[0]
        sabor_predito = modelo_sabor.predict(X)[0]
        
        # Obtendo as probabilidades
        prob_tipo = np.max(modelo_tipo.predict_proba(X))
        prob_sabor = np.max(modelo_sabor.predict_proba(X))
        
        return {
            "quantidade_pessoas": quantidade_pessoas,
            "tipo_predito": tipo_predito,
            "sabor_predito": sabor_predito,
            "probabilidade_tipo": float(prob_tipo),
            "probabilidade_sabor": float(prob_sabor)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
