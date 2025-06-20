# crud/pedido.py
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from models.pedido import Pedido # Importa o modelo ORM Pedido
from schemas.pedido import PedidoCreate, PedidoUpdate

def get_pedido_by_id(db: Session, pedido_id: int) -> Optional[Pedido]:
    """Busca um pedido pelo ID."""
    return db.query(Pedido).filter(Pedido.id == pedido_id).first()

def get_pedidos(db: Session, skip: int = 0, limit: int = 100, status_filter: Optional[str] = None) -> List[Pedido]:
    """Lista todos os pedidos com paginação, opcionalmente filtrando por status."""
    query = db.query(Pedido)
    if status_filter:
        query = query.filter(Pedido.status == status_filter)
    return query.offset(skip).limit(limit).all()

def create_pedido(db: Session, pedido: PedidoCreate) -> Pedido:
    """Cria um novo pedido no banco de dados."""
    db_pedido = Pedido(
        mesa=pedido.mesa,
        n_cracha=pedido.n_cracha,
        nomeatendente=pedido.nomeatendente,
        quantidadepessoas=pedido.quantidadepessoas,  # <-- Certifique-se que está aqui!
        status=pedido.status,
        valortotal=pedido.valortotal,
        datahora=func.now(), # SQLAlchemy define este campo
        itens=pedido.itens,
        observacoes=pedido.observacoes
    )
    db.add(db_pedido)
    db.commit()
    db.refresh(db_pedido)
    return db_pedido

def update_pedido(db: Session, pedido_id: int, pedido_data: PedidoUpdate) -> Optional[Pedido]:
    """Atualiza as informações gerais de um pedido."""
    db_pedido = get_pedido_by_id(db, pedido_id)
    if db_pedido:
        # Excluímos os campos de finalização, pois eles são tratados pela função finalize_pedido
        update_data = pedido_data.model_dump(exclude_unset=True, exclude={'n_cracha_at_finalizador', 'nomeatendentefinalizador', 'datahorafinalizacao'})
        for key, value in update_data.items():
            setattr(db_pedido, key, value)
        db.add(db_pedido)
        db.commit()
        db.refresh(db_pedido)
    return db_pedido

def finalize_pedido(db: Session, pedido_id: int, n_cracha_finalizador: int, nome_finalizador: str) -> Optional[Pedido]:
    """Finaliza um pedido, registrando o atendente que o finalizou."""
    db_pedido = get_pedido_by_id(db, pedido_id)
    if db_pedido and db_pedido.status != "Finalizado":
        db_pedido.status = "Finalizado"
        db_pedido.datahorafinalizacao = func.now()
        db_pedido.n_cracha_at_finalizador = n_cracha_finalizador
        db_pedido.nomeatendentefinalizador = nome_finalizador
        db.add(db_pedido)
        db.commit()
        db.refresh(db_pedido)
    return db_pedido

def delete_pedido(db: Session, pedido_id: int) -> bool:
    """Deleta um pedido do banco de dados."""
    db_pedido = get_pedido_by_id(db, pedido_id)
    if db_pedido:
        db.delete(db_pedido)
        db.commit()
        return True
    return False
