from database.conection import Base
from sqlalchemy import Column, Integer, String, DateTime

class Atendente(Base):
    __tablename__ = "atendentes"
    
    nome = Column(String, index=True)
    n_cracha = Column(Integer, primary_key=True, unique=True, index=True) 
    senha = Column(String) # Senha (hash)
    foto = Column(String, nullable=True) 