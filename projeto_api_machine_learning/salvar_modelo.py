import pickle
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import matplotlib.pyplot as plt

# Carregando os dados
base_pedidos = pd.read_csv('pedidos_1000.csv', sep=";", encoding='utf-8')

# Limpando dados problemáticos
for col in base_pedidos.columns:
    if base_pedidos[col].dtype == 'object':
        base_pedidos[col] = base_pedidos[col].apply(lambda x: str(x).split(';')[0] if ';' in str(x) else x)

# Convertendo colunas numéricas
base_pedidos['Quantidade de Pessoas'] = pd.to_numeric(base_pedidos['Quantidade de Pessoas'], errors='coerce')
base_pedidos['Quantidade de Bebidas'] = pd.to_numeric(base_pedidos['Quantidade de Bebidas'], errors='coerce')

# Removendo linhas com valores nulos
base_pedidos = base_pedidos.dropna()

# Preparando os dados
X = base_pedidos[['Quantidade de Pessoas']].values
y_tipo = base_pedidos['Tipo de Pedido'].values
y_sabor = base_pedidos['Sabor'].values

# Dividindo os dados em treinamento e teste
from sklearn.model_selection import train_test_split
X_treinamento, X_teste, y_tipo_treinamento, y_tipo_teste, y_sabor_treinamento, y_sabor_teste = train_test_split(
    X, y_tipo, y_sabor, test_size=0.15, random_state=42
)

# Treinando o modelo para tipo de pedido
modelo_tipo = RandomForestClassifier(n_estimators=100, random_state=42)
modelo_tipo.fit(X_treinamento, y_tipo_treinamento)

# Treinando o modelo para sabor
modelo_sabor = RandomForestClassifier(n_estimators=100, random_state=42)
modelo_sabor.fit(X_treinamento, y_sabor_treinamento)

# Avaliando os modelos
previsoes_tipo = modelo_tipo.predict(X_teste)
previsoes_sabor = modelo_sabor.predict(X_teste)

print("\nAcurácia do modelo de tipo:", accuracy_score(y_tipo_teste, previsoes_tipo))
print("\nAcurácia do modelo de sabor:", accuracy_score(y_sabor_teste, previsoes_sabor))

print("\nRelatório de classificação - Tipo:")
print(classification_report(y_tipo_teste, previsoes_tipo))
print("\nRelatório de classificação - Sabor:")
print(classification_report(y_sabor_teste, previsoes_sabor))

# Salvando os modelos treinados
with open('modelo_tipo.pkl', 'wb') as f:
    pickle.dump(modelo_tipo, f)

with open('modelo_sabor.pkl', 'wb') as f:
    pickle.dump(modelo_sabor, f)

print("\nModelos salvos com sucesso!") 