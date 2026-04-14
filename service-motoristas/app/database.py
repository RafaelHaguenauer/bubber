from sqlalchemy import Column, Integer, String, Float, Boolean, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Configurar banco de dados
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@postgres:5432/bubber")

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class MotoristaORM(Base):
    __tablename__ = "Motorista"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    cnh = Column(String, unique=True, index=True)
    telefone = Column(String)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    disponivel = Column(Boolean, default=True)
    avaliacao = Column(Float, default=5.0)

# Criar tabelas se não existirem
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
