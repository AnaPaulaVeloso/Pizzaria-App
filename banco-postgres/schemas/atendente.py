from pydantic import BaseModel, Field
from typing import Optional

class AtendenteBase(BaseModel):
    nome: str = Field(..., description="Nome completo do atendente.")
    n_cracha: int = Field(..., description="Número do crachá do atendente, único e identificador.")
    foto: Optional[str] = Field(None, description="URL ou caminho para a foto do atendente (opcional).")

    class Config:
        from_attributes = True 

class AtendenteCreate(AtendenteBase):
    senha: str = Field(..., min_length=4, description="Senha do atendente (será hashed antes de salvar).")


class Atendente(AtendenteBase):
    pass


class AtendenteUpdate(BaseModel):
    nome: Optional[str] = Field(None, description="Novo nome do atendente.")
    foto: Optional[str] = Field(None, description="Nova URL ou caminho para a foto do atendente.")
    senha: Optional[str] = Field(None, min_length=4, description="Nova senha do atendente (será hashed antes de salvar).")

    class Config:
        from_attributes = True