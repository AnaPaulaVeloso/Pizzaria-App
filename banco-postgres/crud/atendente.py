# crud/atendente.py
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from models.atendente import Atendente # Importa o modelo ORM Atendente
from schemas.atendente import AtendenteCreate, AtendenteUpdate

def get_atendente_by_n_cracha(db: Session, n_cracha: int) -> Optional[Atendente]:
    """Busca um atendente pelo número do crachá."""
    return db.query(Atendente).filter(Atendente.n_cracha == n_cracha).first()

def get_atendentes(db: Session, skip: int = 0, limit: int = 100) -> List[Atendente]:
    """Lista todos os atendentes com paginação."""
    return db.query(Atendente).offset(skip).limit(limit).all()

def create_atendente(db: Session, atendente: AtendenteCreate) -> Atendente:
    """Cria um novo atendente no banco de dados."""
    # Em um cenário real, a senha seria hashed aqui antes de salvar
    # hashed_password = auth_utils.hash_password(atendente.senha)
    db_atendente = Atendente(
        nome=atendente.nome,
        n_cracha=atendente.n_cracha,
        senha=atendente.senha, # Lembre-se de fazer hash em produção
        foto=atendente.foto
    )
    db.add(db_atendente)
    db.commit()
    db.refresh(db_atendente)
    return db_atendente

def update_atendente(db: Session, n_cracha: int, atendente_data: AtendenteUpdate) -> Optional[Atendente]:
    """Atualiza as informações de um atendente existente."""
    db_atendente = get_atendente_by_n_cracha(db, n_cracha)
    if db_atendente:
        update_data = atendente_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            # Lidar com hash de senha se for o caso
            # if key == "senha":
            #    value = auth_utils.hash_password(value)
            setattr(db_atendente, key, value)
        db.add(db_atendente) # Garante que o SQLAlchemy "sabe" da alteração
        db.commit()
        db.refresh(db_atendente)
    return db_atendente

def delete_atendente(db: Session, n_cracha: int) -> bool:
    """Deleta um atendente do banco de dados."""
    db_atendente = get_atendente_by_n_cracha(db, n_cracha)
    if db_atendente:
        db.delete(db_atendente)
        db.commit()
        return True
    return False