import grpc
from concurrent import futures
import sys
import os

# Adicionar proto_stubs ao path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "grpc_stubs"))

from app.services import MotoristaService
from app.database import SessionLocal
import motoristas_pb2
import motoristas_pb2_grpc

class MotoristaServicer(motoristas_pb2_grpc.MotoristaServiceServicer):
    """Implementação do serviço de motoristas gRPC"""
    
    def EncontrarMotoristasProximos(self, request, context):
        """Encontrar motoristas próximos"""
        
        db = SessionLocal()
        try:
            motoristas = MotoristaService.encontrar_motoristas_proximos(
                db,
                request.latitude,
                request.longitude,
                request.raio_km or 5
            )
            
            response_motoristas = [
                motoristas_pb2.MotoristaProximo(
                    motorista_id=m["motorista_id"],
                    latitude=m["latitude"],
                    longitude=m["longitude"],
                    distancia=m["distancia"],
                    tempo_minutos=m["tempo_minutos"],
                    avaliacao=m["avaliacao"],
                    nome=m["nome"]
                )
                for m in motoristas
            ]
            
            return motoristas_pb2.EncontrarMotoristasResponse(
                motoristas=response_motoristas
            )
        
        except Exception as e:
            context.set_details(f"Erro ao buscar motoristas: {str(e)}")
            context.set_code(grpc.StatusCode.INTERNAL)
            return motoristas_pb2.EncontrarMotoristasResponse()
        
        finally:
            db.close()
    
    def AtualizarLocalizacao(self, request, context):
        """Atualizar localização do motorista"""
        
        db = SessionLocal()
        try:
            sucesso = MotoristaService.atualizar_localizacao(
                db,
                request.motorista_id,
                request.latitude,
                request.longitude
            )
            
            return motoristas_pb2.AtualizarLocalizacaoResponse(
                sucesso=sucesso,
                mensagem="Localização atualizada com sucesso" if sucesso else "Motorista não encontrado"
            )
        
        except Exception as e:
            context.set_details(f"Erro ao atualizar localização: {str(e)}")
            context.set_code(grpc.StatusCode.INTERNAL)
            return motoristas_pb2.AtualizarLocalizacaoResponse(sucesso=False, mensagem=str(e))
        
        finally:
            db.close()
    
    def ObterMotorista(self, request, context):
        """Obter detalhes de um motorista"""
        
        db = SessionLocal()
        try:
            motorista = MotoristaService.obter_motorista(db, request.motorista_id)
            
            if motorista:
                return motoristas_pb2.MotoristaDetalhes(
                    id=motorista.id,
                    nome=motorista.nome,
                    cnh=motorista.cnh,
                    telefone=motorista.telefone,
                    latitude=motorista.latitude or 0,
                    longitude=motorista.longitude or 0,
                    disponivel=motorista.disponivel,
                    avaliacao=motorista.avaliacao
                )
            else:
                context.set_details("Motorista não encontrado")
                context.set_code(grpc.StatusCode.NOT_FOUND)
                return motoristas_pb2.MotoristaDetalhes()
        
        except Exception as e:
            context.set_details(f"Erro ao obter motorista: {str(e)}")
            context.set_code(grpc.StatusCode.INTERNAL)
            return motoristas_pb2.MotoristaDetalhes()
        
        finally:
            db.close()
    
    def ListarDisponibilizados(self, request, context):
        """Listar motoristas disponíveis"""
        
        db = SessionLocal()
        try:
            motoristas = MotoristaService.listar_disponibilizados(db)
            
            response_motoristas = [
                motoristas_pb2.MotoristaDetalhes(
                    id=m.id,
                    nome=m.nome,
                    cnh=m.cnh,
                    telefone=m.telefone,
                    latitude=m.latitude or 0,
                    longitude=m.longitude or 0,
                    disponivel=m.disponivel,
                    avaliacao=m.avaliacao
                )
                for m in motoristas
            ]
            
            return motoristas_pb2.ListarDisponibilizadosResponse(
                motoristas=response_motoristas
            )
        
        except Exception as e:
            context.set_details(f"Erro ao listar motoristas: {str(e)}")
            context.set_code(grpc.StatusCode.INTERNAL)
            return motoristas_pb2.ListarDisponibilizadosResponse()
        
        finally:
            db.close()


def serve():
    """Iniciar servidor gRPC"""
    
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    motoristas_pb2_grpc.add_MotoristaServiceServicer_to_server(
        MotoristaServicer(), server
    )
    
    port = os.getenv("MOTORISTAS_SERVICE_PORT", "50051")
    server.add_insecure_port(f"0.0.0.0:{port}")
    
    print(f"🚀 Servidor de Motoristas rodando na porta {port}")
    server.start()
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
