from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from database.conection import Base, engine, get_db
from models.atendente import Atendente
from models.pedido import Pedido
from schemas.atendente import Atendente as AtendenteSchema, AtendenteCreate, AtendenteUpdate
from schemas.pedido import Pedido as PedidoSchema, PedidoCreate, PedidoUpdate

app = FastAPI(
    title="API de Gerenciamento de Pedidos e Atendentes",
    description="API para gerenciar pedidos de um restaurante e informações de atendentes.",
    version="1.0.0"
)

# --- Configuração CORS ---
# Permite comunicação entre domínios diferentes (seu frontend, outros apps, etc.)
# origins = [
#     "http://localhost",
#     "http://localhost:8000",
#     "http://localhost:3000", # Exemplo de frontend React/Vue
#     "http://127.0.0.1:8000",
#     "https://seusite.com", # Substitua pelo domínio do seu frontend em produção
#     # Adicione outros domínios permitidos aqui
# ]

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique os domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Criar tabelas no banco de dados ---
# Isso cria as tabelas se elas ainda não existirem.
# É bom para desenvolvimento, mas em produção você pode usar migrações (Alembic).
@app.on_event("startup")
def setup_database():
    Base.metadata.create_all(bind=engine)
    print("Tabelas do banco de dados criadas (se não existiam).")

# --- Rotas para Atendentes ---

@app.post("/atendentes/inserir", response_model=AtendenteSchema, status_code=status.HTTP_201_CREATED, summary="Insere um novo atendente")
def inserirAtendente(atendente: AtendenteCreate, db: Session = Depends(get_db)):
    """
    Cria um novo registro de atendente no sistema.
    - **nome**: Nome completo do atendente.
    - **n_cracha**: Número único do crachá do atendente.
    - **senha**: Senha para acesso (será armazenada de forma segura).
    - **foto**: URL ou caminho para a foto do atendente (opcional).
    """
    db_atendente = db.query(Atendente).filter(Atendente.n_cracha == atendente.n_cracha).first()
    if db_atendente:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Atendente com este crachá já existe.")

    # A senha deve ser hashed na vida real (ex: usando passlib/bcrypt)
    # Por simplicidade neste exemplo, apenas armazenaremos como está.
    # Exemplo real: hashed_password = auth_utils.hash_password(atendente.senha)
    
    novo_atendente = Atendente(
        nome=atendente.nome,
        n_cracha=atendente.n_cracha,
        senha=atendente.senha, # Mude para hashed_password em produção
        foto=atendente.foto
    )
    db.add(novo_atendente)
    db.commit()
    db.refresh(novo_atendente)
    return novo_atendente


@app.post("/atendentes/login")
def login_atendente(credentials: dict, db: Session = Depends(get_db)):
    """
    Realiza o login de um atendente.
    - **n_cracha**: Número do crachá do atendente
    - **senha**: Senha do atendente
    """
    n_cracha = credentials.get("n_cracha")
    senha = credentials.get("senha")

    if not n_cracha or not senha:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Número do crachá e senha são obrigatórios"
        )

    atendente = db.query(Atendente).filter(Atendente.n_cracha == n_cracha).first()
    
    if not atendente:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas"
        )

    # Em produção, você deve usar hash de senha
    if atendente.senha != senha:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas"
        )

    # Retorna os dados do atendente no formato correto
    return {
        "atendente": {
            "nome": atendente.nome,
            "n_cracha": atendente.n_cracha,
            "foto": atendente.foto
        }
    }  

@app.get("/atendentes/listar", response_model=List[AtendenteSchema], summary="Lista todos os atendentes")
def listarAtendentes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retorna uma lista de todos os atendentes registrados.
    - **skip**: Número de registros a pular.
    - **limit**: Número máximo de registros a retornar.
    """
    atendentes = db.query(Atendente).offset(skip).limit(limit).all()
    return atendentes

@app.get("/atendentes/{n_cracha}", response_model=AtendenteSchema, summary="Busca um atendente por número de crachá")
def buscarAtendentePorCracha(n_cracha: int, db: Session = Depends(get_db)):
    """
    Busca e retorna os detalhes de um atendente específico pelo seu número de crachá.
    - **n_cracha**: O número do crachá do atendente.
    """
    atendente = db.query(Atendente).filter(Atendente.n_cracha == n_cracha).first()
    if not atendente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Atendente não encontrado.")
    return atendente

@app.put("/atendentes/atualizar/{n_cracha}", response_model=AtendenteSchema, summary="Atualiza um atendente existente")
def atualizarAtendente(n_cracha: int, atendente_data: AtendenteUpdate, db: Session = Depends(get_db)):
    """
    Atualiza as informações de um atendente existente.
    - **n_cracha**: O número do crachá do atendente a ser atualizado.
    - **atendente_data**: Dados do atendente para atualização (nome, foto, senha).
    """
    db_atendente = db.query(Atendente).filter(Atendente.n_cracha == n_cracha).first()
    if not db_atendente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Atendente não encontrado.")

    # Atualiza apenas os campos fornecidos
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

@app.delete("/atendentes/deletar/{n_cracha}", status_code=status.HTTP_204_NO_CONTENT, summary="Deleta um atendente")
def deletarAtendente(n_cracha: int, db: Session = Depends(get_db)):
    """
    Deleta um atendente do sistema pelo seu número de crachá.
    - **n_cracha**: O número do crachá do atendente a ser deletado.
    """
    db_atendente = db.query(Atendente).filter(Atendente.n_cracha == n_cracha).first()
    if not db_atendente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Atendente não encontrado.")
    db.delete(db_atendente)
    db.commit()
    return {"message": "Atendente deletado com sucesso."}

# --- Rotas para Pedidos ---

@app.post("/pedidos/iniciar", response_model=PedidoSchema, status_code=status.HTTP_201_CREATED, summary="Inicia um novo pedido")
def iniciarPedido(pedido: PedidoCreate, db: Session = Depends(get_db)):
    """
    Cria um novo pedido com os dados do atendente que o iniciou.
    - **mesa**: Número da mesa.
    - **n_cracha**: Número do crachá do atendente que inicia o pedido.
    - **nomeatendente**: Nome do atendente que inicia o pedido.
    - **status**: Status inicial do pedido (ex: "Em Preparo").
    - **valortotal**: Valor inicial do pedido.
    - **itens**: Itens do pedido em formato JSON (string).
    - **observacoes**: Observações opcionais.
    """
    # Verifica se o atendente que inicia o pedido existe
    atendente_existente = db.query(Atendente).filter(Atendente.n_cracha == pedido.n_cracha).first()
    if not atendente_existente:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Atendente inicializador não encontrado.")

    novo_pedido = Pedido(
        mesa=pedido.mesa,
        n_cracha=pedido.n_cracha,
        nomeatendente=pedido.nomeatendente,
        quantidadepessoas=pedido.quantidadepessoas, 
        status=pedido.status,
        valortotal=pedido.valortotal,
        datahora=func.now(), # Gerado automaticamente
        itens=pedido.itens,
        observacoes=pedido.observacoes
    )
    db.add(novo_pedido)
    db.commit()
    db.refresh(novo_pedido)
    return novo_pedido

@app.get("/pedidos/listar", response_model=List[PedidoSchema], summary="Lista todos os pedidos")
def listarPedidos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), status_filter: Optional[str] = None):
    """
    Retorna uma lista de todos os pedidos, com opção de filtrar por status.
    - **skip**: Número de registros a pular.
    - **limit**: Número máximo de registros a retornar.
    - **status_filter**: (Opcional) Filtra pedidos por um status específico (ex: "Em Preparo", "Finalizado").
    """
    query = db.query(Pedido)
    if status_filter:
        query = query.filter(Pedido.status == status_filter)
    pedidos = query.offset(skip).limit(limit).all()
    return pedidos

@app.get("/pedidos/{pedido_id}", response_model=PedidoSchema, summary="Busca um pedido por ID")
def buscarPedidoPorId(pedido_id: int, db: Session = Depends(get_db)):
    """
    Busca e retorna os detalhes de um pedido específico pelo seu ID.
    - **pedido_id**: O ID do pedido.
    """
    pedido = db.query(Pedido).filter(Pedido.id == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido não encontrado.")
    return pedido

@app.put("/pedidos/atualizar/{pedido_id}", response_model=PedidoSchema, summary="Atualiza dados de um pedido")
def atualizarPedido(pedido_id: int, pedido_data: PedidoUpdate, db: Session = Depends(get_db)):
    """
    Atualiza informações gerais de um pedido (mesa, status, valor, itens, observações).
    Não é para finalização completa, mas para edições durante o processo.
    - **pedido_id**: O ID do pedido a ser atualizado.
    - **pedido_data**: Dados do pedido para atualização (mesa, status, valortotal, itens, observacoes).
    """
    db_pedido = db.query(Pedido).filter(Pedido.id == pedido_id).first()
    if not db_pedido:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido não encontrado.")

    # Atualiza apenas os campos fornecidos, excluindo os campos de finalização aqui
    update_data = pedido_data.model_dump(exclude_unset=True, exclude={'n_cracha_at_finalizador', 'nomeatendentefinalizador', 'datahorafinalizacao'})
    for key, value in update_data.items():
        setattr(db_pedido, key, value)
    
    db.add(db_pedido)
    db.commit()
    db.refresh(db_pedido)
    return db_pedido

@app.put("/pedidos/finalizar/{pedido_id}", response_model=PedidoSchema, summary="Finaliza um pedido")
def finalizarPedido(
    pedido_id: int,
    atendente_finalizador_cracha: int,
    atendente_finalizador_nome: str,
    db: Session = Depends(get_db)
):
    """
    Finaliza um pedido, registrando o atendente que o finalizou e a data/hora da finalização.
    - **pedido_id**: O ID do pedido a ser finalizado.
    - **atendente_finalizador_cracha**: Número do crachá do atendente que está finalizando.
    - **atendente_finalizador_nome**: Nome do atendente que está finalizando.
    """
    db_pedido = db.query(Pedido).filter(Pedido.id == pedido_id).first()
    if not db_pedido:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido não encontrado.")

    if db_pedido.status == "Finalizado":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Pedido já está finalizado.")

    # Verifica se o atendente finalizador existe
    atendente_existente = db.query(Atendente).filter(Atendente.n_cracha == atendente_finalizador_cracha).first()
    if not atendente_existente:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Atendente finalizador não encontrado.")

    db_pedido.status = "Finalizado"
    db_pedido.datahorafinalizacao = func.now()
    db_pedido.n_cracha_at_finalizador = atendente_finalizador_cracha
    db_pedido.nomeatendentefinalizador = atendente_finalizador_nome
    
    db.add(db_pedido)
    db.commit()
    db.refresh(db_pedido)
    return db_pedido

@app.delete("/pedidos/cancelar/{pedido_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Cancela um pedido")
def cancelarPedido(pedido_id: int, db: Session = Depends(get_db)):
    """
    Cancela um pedido, removendo-o do sistema.
    - **pedido_id**: O ID do pedido a ser cancelado.
    """
    db_pedido = db.query(Pedido).filter(Pedido.id == pedido_id).first()
    if not db_pedido:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido não encontrado.")
    
    db.delete(db_pedido)
    db.commit()
    return {"message": "Pedido cancelado com sucesso."}


# --- Rodar a API ---
# Para rodar, salve este arquivo como main.py e execute no terminal:
# uvicorn main:app --reload
