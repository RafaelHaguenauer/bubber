@echo off
REM Script para iniciar o Bubber com Docker Compose no Windows

echo ========================================
echo      BUBBER - Sistema de Ridesharing
echo ========================================
echo.

set /p INCLUDE_OSRM="Deseja incluir OSRM? (s/n) [default: s]: " || set INCLUDE_OSRM=s

echo.
echo Iniciando containers...
echo.

if /i "%INCLUDE_OSRM%"=="s" (
    echo [+] Iniciando com OSRM (roteamento)
    docker-compose --profile osrm up -d
) else (
    echo [+] Iniciando sem OSRM
    docker-compose up -d
)

echo.
echo Aguardando inicialização dos containers...
timeout /t 5

echo.
echo ========================================
echo        Containers em Execução
echo ========================================
docker-compose ps

echo.
echo ========================================
echo          Informações de Acesso
echo ========================================
echo.
echo API GraphQL:
echo   URL: http://localhost:4000
echo   Sandbox: http://localhost:4000/graphql
echo.
echo PostgreSQL:
echo   Host: localhost
echo   Porta: 5432
echo   Usuario: bubber_user
echo   Senha: bubber_pass
echo   Banco: bubber
echo.
echo Microsserviço de Motoristas (gRPC):
echo   Host: localhost
echo   Porta: 50051
echo.
echo Microsserviço de Roteamento (gRPC):
echo   Host: localhost
echo   Porta: 50052
echo.
if /i "%INCLUDE_OSRM%"=="s" (
    echo OSRM:
    echo   URL: http://localhost:5000
    echo.
)
echo ========================================
echo.
echo Para ver logs: docker-compose logs -f
echo Para parar: docker-compose down
echo.
pause
