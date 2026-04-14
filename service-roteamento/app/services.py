import requests
from typing import List, Tuple

class RoteamentoService:
    """Serviço de roteamento usando OSRM"""
    
    def __init__(self, osrm_url: str = "http://osrm:5000"):
        self.osrm_url = osrm_url
    
    def calcular_rota(
        self,
        origem_lat: float,
        origem_lon: float,
        destino_lat: float,
        destino_lon: float
    ) -> dict:
        """
        Calcular rota entre dois pontos usando OSRM
        Retorna distância em metros e duração em segundos
        """
        
        try:
            # URL da API OSRM: /route/v1/driving/lon1,lat1;lon2,lat2
            url = f"{self.osrm_url}/route/v1/driving/{origem_lon},{origem_lat};{destino_lon},{destino_lat}"
            
            params = {
                "alternatives": "false",
                "steps": "true",
                "geometries": "polyline",
                "annotations": "distance,duration",
                "overview": "full"
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get("code") != "Ok" or not data.get("routes"):
                raise Exception(f"OSRM retornou erro: {data.get('message', 'Rota não encontrada')}")
            
            route = data["routes"][0]
            
            passos = []
            for step in route.get("legs", [])[0].get("steps", []):
                passos.append({
                    "instrucao": step.get("name", "Siga"),
                    "distancia_metros": step.get("distance", 0),
                    "duracao_segundos": step.get("duration", 0),
                    "nome_rua": step.get("name", "")
                })
            
            return {
                "distancia_metros": route.get("distance", 0),
                "duracao_segundos": route.get("duration", 0),
                "passos": passos,
                "rota": route.get("geometry", "")
            }
        
        except requests.exceptions.RequestException as e:
            raise Exception(f"Erro ao conectar com OSRM: {str(e)}")
        except Exception as e:
            raise Exception(f"Erro ao calcular rota: {str(e)}")
    
    def calcular_distancia(
        self,
        origem_lat: float,
        origem_lon: float,
        destino_lat: float,
        destino_lon: float
    ) -> dict:
        """
        Calcular apenas a distância entre dois pontos
        (mais leve que calcular a rota completa)
        """
        
        try:
            url = f"{self.osrm_url}/table/v1/driving/{origem_lon},{origem_lat};{destino_lon},{destino_lat}"
            
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get("code") != "Ok":
                raise Exception(f"OSRM retornou erro: {data.get('message', 'Erro ao calcular distância')}")
            
            # matrix[0][1] é a distância do ponto 0 para o ponto 1
            distancia_metros = data["distances"][0][1]
            duracao_segundos = data["durations"][0][1]
            
            return {
                "distancia_metros": distancia_metros,
                "duracao_segundos": duracao_segundos
            }
        
        except requests.exceptions.RequestException as e:
            raise Exception(f"Erro ao conectar com OSRM: {str(e)}")
        except Exception as e:
            raise Exception(f"Erro ao calcular distância: {str(e)}")
    
    def otimizar_rota(
        self,
        origem_lat: float,
        origem_lon: float,
        destino_lat: float,
        destino_lon: float,
        paradas: List[Tuple[float, float]] = None
    ) -> dict:
        """
        Otimizar rota com múltiplas paradas
        """
        
        if not paradas:
            paradas = []
        
        try:
            # Construir coordenadas para o OSRM
            coordenadas = [
                (origem_lon, origem_lat),
                *[(lon, lat) for lat, lon in paradas],
                (destino_lon, destino_lat)
            ]
            
            coords_str = ";".join([f"{lon},{lat}" for lon, lat in coordenadas])
            
            # API OSRM Optimization
            url = f"{self.osrm_url}/trip/v1/driving/{coords_str}"
            
            params = {
                "roundtrip": "false",
                "annotations": "distance,duration",
                "overview": "full"
            }
            
            response = requests.get(url, params=params, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get("code") != "Ok":
                raise Exception(f"OSRM retornou erro: {data.get('message', 'Erro ao otimizar rota')}")
            
            routes = data.get("routes", [])
            if not routes:
                raise Exception("Nenhuma rota encontrada")
            
            rota_otimizada = routes[0]
            
            return {
                "distancia_metros": rota_otimizada.get("distance", 0),
                "duracao_segundos": rota_otimizada.get("duration", 0),
                "ordem_otimizada": data.get("waypoints", [])
            }
        
        except requests.exceptions.RequestException as e:
            raise Exception(f"Erro ao conectar com OSRM: {str(e)}")
        except Exception as e:
            raise Exception(f"Erro ao otimizar rota: {str(e)}")
