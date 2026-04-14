from geopy.distance import geodesic
from sqlalchemy.orm import Session
from .models import Motorista as MotoristaModel
from app.database import MotoristaORM
import math

class MotoristaService:
    @staticmethod
    def encontrar_motoristas_proximos(
        db: Session, 
        latitude: float, 
        longitude: float, 
        raio_km: float = 5
    ) -> list:
        """Encontrar motoristas dentro do raio especificado"""
        
        motoristas: list[MotoristaORM] = db.query(MotoristaORM).filter(
            MotoristaORM.disponivel == True
        ).all()
        
        motoristas_proximos = []
        
        for motorista in motoristas:
            if motorista.latitude is None or motorista.longitude is None:
                continue
                
            # Calcular distância usando Haversine
            ponto_atual = (latitude, longitude)
            ponto_motorista = (motorista.latitude, motorista.longitude)
            
            distancia_km = geodesic(ponto_atual, ponto_motorista).kilometers
            
            if distancia_km <= raio_km:
                # Estimar tempo em minutos (assumindo velocidade média de 40 km/h em áreas urbanas)
                tempo_minutos = max(1, int((distancia_km / 40) * 60))
                
                motoristas_proximos.append({
                    "motorista_id": motorista.id,
                    "latitude": motorista.latitude,
                    "longitude": motorista.longitude,
                    "distancia": round(distancia_km, 2),
                    "tempo_minutos": tempo_minutos,
                    "avaliacao": motorista.avaliacao,
                    "nome": motorista.nome
                })
        
        # Ordenar por distância
        motoristas_proximos.sort(key=lambda x: x["distancia"])
        
        return motoristas_proximos
    
    @staticmethod
    def atualizar_localizacao(
        db: Session,
        motorista_id: int,
        latitude: float,
        longitude: float
    ) -> bool:
        """Atualizar localização do motorista"""
        
        motorista = db.query(MotoristaORM).filter(
            MotoristaORM.id == motorista_id
        ).first()
        
        if motorista:
            motorista.latitude = latitude
            motorista.longitude = longitude
            db.commit()
            return True
        
        return False
    
    @staticmethod
    def obter_motorista(db: Session, motorista_id: int) -> MotoristaORM:
        """Buscar um motorista específico"""
        
        return db.query(MotoristaORM).filter(
            MotoristaORM.id == motorista_id
        ).first()
    
    @staticmethod
    def listar_disponibilizados(db: Session) -> list[MotoristaORM]:
        """Listar todos os motoristas disponíveis"""
        
        return db.query(MotoristaORM).filter(
            MotoristaORM.disponivel == True
        ).all()
