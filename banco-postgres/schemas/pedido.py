from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime
import json

# ---
## Base Schema
# ---

class PedidoBase(BaseModel):
    """
    Schema base para os dados de um pedido.
    Define os campos comuns para criação, leitura e atualização.
    """
    mesa: int = Field(..., description="Número da mesa associada ao pedido.")
    n_cracha: int = Field(..., description="Número do crachá do atendente que iniciou o pedido.")
    nomeatendente: str = Field(..., description="Nome do atendente que iniciou o pedido.")
    quantidadepessoas: int
    status: str = Field(..., description="Status atual do pedido (ex: 'Em Aberto', 'Finalizado', 'Cancelado').")
    valortotal: float = Field(..., ge=0, description="Valor total do pedido.") # Usamos float para Numeric(10,2)
    itens: str = Field(..., description="Itens do pedido em formato JSON (string).")
    observacoes: Optional[str] = Field(None, description="Observações adicionais sobre o pedido.")

    @validator('itens', pre=True)
    def itens_to_str(cls, v):
        if isinstance(v, list):
            return json.dumps(v)
        return v

    class Config:
        from_attributes = True # Permite mapear de objetos SQLAlchemy para Pydantic

# ---
## Schema para Criação
# ---

class PedidoCreate(PedidoBase):
    pass
# ---
## Schema para Leitura
# ---

class Pedido(PedidoBase):
    """
    Schema para retornar os dados completos de um pedido, incluindo IDs e timestamps.
    """
    id: int = Field(..., description="ID único do pedido.")
    datahora: datetime = Field(..., description="Data e hora de criação do pedido.")
    datahorafinalizacao: Optional[datetime] = Field(None, description="Data e hora de finalização do pedido.")
    n_cracha_at_finalizador: Optional[int] = Field(None, description="Número do crachá do atendente que finalizou o pedido (se finalizado).")
    nomeatendentefinalizador: Optional[str] = Field(None, description="Nome do atendente que finalizou o pedido (se finalizado).")

    # Exemplo de validador/converter para itens (opcional, mas útil se 'itens' for um JSON string)
    class Config:
        json_loads = lambda s: json.loads(s) if isinstance(s, str) else s
        json_dumps = lambda o: json.dumps(o)

# ---
## Schema para Atualização/Finalização
# ---

class PedidoUpdate(BaseModel):
    """
    Schema para atualizar (parcialmente) ou finalizar um pedido.
    Todos os campos são opcionais, permitindo atualizações parciais.
    """
    mesa: Optional[int] = Field(None, description="Novo número da mesa do pedido.")
    status: Optional[str] = Field(None, description="Novo status do pedido.")
    valortotal: Optional[float] = Field(None, ge=0, description="Novo valor total do pedido.")
    itens: Optional[str] = Field(None, description="Novos itens do pedido em formato JSON (string).")
    observacoes: Optional[str] = Field(None, description="Novas observações sobre o pedido.")

    # Campos específicos para finalização
    n_cracha_at_finalizador: Optional[int] = Field(None, description="Número do crachá do atendente que está finalizando o pedido.")
    nomeatendentefinalizador: Optional[str] = Field(None, description="Nome do atendente que está finalizando o pedido.")
    datahorafinalizacao: Optional[datetime] = Field(None, description="Data e hora de finalização do pedido.")

    class Config:
        from_attributes = True
