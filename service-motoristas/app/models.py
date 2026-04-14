from pydantic import BaseModel
from typing import List, Optional

class MotoristaBase(BaseModel):
    nome: str
    cnh: str
    telefone: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    disponivel: Optional[bool] = True
    avaliacao: Optional[float] = 5.0

class MotoristaCreate(MotoristaBase):
    pass

class Motorista(MotoristaBase):
    id: int
    
    class Config:
        from_attributes = True

class MotoristasProximos(BaseModel):
    motorista_id: int
    latitude: float
    longitude: float
    distancia: float
    tempo_minutos: int
    avaliacao: float
    nome: str
