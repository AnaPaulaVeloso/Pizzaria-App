from sqlalchemy import Column, String, Integer, DateTime, Text, Numeric, ForeignKey
from sqlalchemy.sql import func
from database.conection import Base

class Pedido(Base):
    __tablename__ = "pedidos"

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    mesa = Column(Integer, nullable=False)
    n_cracha = Column(Integer, ForeignKey("atendentes.n_cracha"), nullable=False) # Atendente que iniciou o pedido
    nomeatendente = Column(String, nullable=False)
    quantidadepessoas = Column(Integer, nullable=False)
    status = Column(String, nullable=False)
    valortotal = Column(Numeric(10, 2), nullable=False)
    datahora = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    datahorafinalizacao = Column(DateTime(timezone=True), nullable=True)
    n_cracha_at_finalizador = Column(Integer, ForeignKey("atendentes.n_cracha"), nullable=True) # Atendente que finalizou o pedido
    nomeatendentefinalizador = Column(String, nullable=True) 
    itens = Column(Text, nullable=False)
    observacoes = Column(Text, nullable=True)
