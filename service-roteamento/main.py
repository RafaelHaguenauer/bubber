import grpc
from concurrent import futures
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "grpc_stubs"))

from app.services import RoteamentoService
import roteamento_pb2
import roteamento_pb2_grpc

roteamento_service = RoteamentoService(osrm_url=os.getenv("OSRM_URL", "http://osrm:5000"))

class RoteamentoServicer(roteamento_pb2_grpc.RoteamentoServiceServicer):
    """Implementação do serviço de roteamento gRPC"""
    
    def CalcularRota(self, request, context):
        """Calcular rota entre dois pontos"""
        
        try:
            resultado = roteamento_service.calcular_rota(
                request.origem_lat,
                request.origem_lon,
                request.destino_lat,
                request.destino_lon
            )
            
            passos = [
                roteamento_pb2.Passo(
                    instrucao=p["instrucao"],
                    distancia_metros=p["distancia_metros"],
                    duracao_segundos=p["duracao_segundos"],
                    nome_rua=p["nome_rua"]
                )
                for p in resultado.get("passos", [])
            ]
            
            return roteamento_pb2.CalcularRotaResponse(
                distancia_metros=resultado["distancia_metros"],
                duracao_segundos=resultado["duracao_segundos"],
                passos=passos
            )
        
        except Exception as e:
            context.set_details(f"Erro ao calcular rota: {str(e)}")
            context.set_code(grpc.StatusCode.INTERNAL)
            return roteamento_pb2.CalcularRotaResponse()
    
    def CalcularDistancia(self, request, context):
        """Calcular distância entre dois pontos"""
        
        try:
            resultado = roteamento_service.calcular_distancia(
                request.origem_lat,
                request.origem_lon,
                request.destino_lat,
                request.destino_lon
            )
            
            return roteamento_pb2.CalcularDistanciaResponse(
                distancia_metros=resultado["distancia_metros"],
                duracao_segundos=resultado["duracao_segundos"]
            )
        
        except Exception as e:
            context.set_details(f"Erro ao calcular distância: {str(e)}")
            context.set_code(grpc.StatusCode.INTERNAL)
            return roteamento_pb2.CalcularDistanciaResponse()
    
    def OtimizarRota(self, request, context):
        """Otimizar rota com múltiplas paradas"""
        
        try:
            coordenadas_paradas = [
                (p.latitude, p.longitude)
                for p in request.paradas
            ]
            
            resultado = roteamento_service.otimizar_rota(
                request.origem.latitude,
                request.origem.longitude,
                request.destino.latitude,
                request.destino.longitude,
                coordenadas_paradas
            )
            
            return roteamento_pb2.OtimizarRotaResponse(
                distancia_metros=resultado["distancia_metros"],
                duracao_segundos=resultado["duracao_segundos"]
            )
        
        except Exception as e:
            context.set_details(f"Erro ao otimizar rota: {str(e)}")
            context.set_code(grpc.StatusCode.INTERNAL)
            return roteamento_pb2.OtimizarRotaResponse()


def serve():
    """Iniciar servidor gRPC"""
    
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    roteamento_pb2_grpc.add_RoteamentoServiceServicer_to_server(
        RoteamentoServicer(), server
    )
    
    port = os.getenv("ROTEAMENTO_SERVICE_PORT", "50052")
    server.add_insecure_port(f"0.0.0.0:{port}")
    
    print(f"🚀 Servidor de Roteamento rodando na porta {port}")
    server.start()
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
