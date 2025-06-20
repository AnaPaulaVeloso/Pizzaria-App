# database/conection.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# Pega a URL do banco de dados das variáveis de ambiente
DATABASE_URL = os.getenv("DATABASE_URL")

# Se a DATABASE_URL não estiver definida (ex: em um ambiente de teste ou dev sem Docker)
# você pode definir um valor padrão para SQLite, ou levantar um erro.
if not DATABASE_URL:
    # Para desenvolvimento local sem Docker, ou para garantir que não falhe se a variável não estiver presente
    # mas esta linha não será usada em Docker Compose se DATABASE_URL estiver no .env ou docker-compose.yml
    DATABASE_URL = "postgresql://user:password@host:port/dbname" # Ajuste para um valor padrão se precisar

# Cria o objeto engine
engine = create_engine(DATABASE_URL, echo=True)

# Cria uma instância de SessionLocal que será usada para sessões de banco de dados
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Cria a classe Base para os modelos declarativos
Base = declarative_base()


# Função para obter uma sessão de banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

