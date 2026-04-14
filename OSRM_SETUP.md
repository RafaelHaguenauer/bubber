# 🗺️ OpenStreetMap Setup - Bubber

Este guia explica como configurar o OSRM (OpenStreetMap Routing Machine) com dados reais para o Bubber.

## 📥 Download de Dados

### Opção 1: Download Automático (Recomendado para Brasil inteiro)

```bash
# Criar pasta para dados
mkdir -p osrm-data

# Download do Brasil (~400MB)
cd osrm-data
wget https://download.geofabrik.de/south-america/brazil-latest.osm.pbf

# Voltar para raiz
cd ..
```

### Opção 2: Regiões Específicas

**São Paulo State:**
```bash
mkdir -p osrm-data
cd osrm-data
wget https://download.geofabrik.de/south-america/brazil/sao-paulo-latest.osm.pbf
cd ..
```

**Rio de Janeiro:**
```bash
mkdir -p osrm-data
cd osrm-data
wget https://download.geofabrik.de/south-america/brazil/rio-de-janeiro-latest.osm.pbf
cd ..
```

**Minas Gerais:**
```bash
mkdir -p osrm-data
cd osrm-data
wget https://download.geofabrik.de/south-america/brazil/minas-gerais-latest.osm.pbf
cd ..
```

**Distrito Federal (Brasília):**
```bash
mkdir -p osrm-data
cd osrm-data
wget https://download.geofabrik.de/south-america/brazil/distrito-federal-latest.osm.pbf
cd ..
```

### Opção 3: Mapa Real-Time (últimas atualizações)

O Overpass API permite baixar dados OSM em tempo real para uma área específica.

**Bounding Box São Paulo:**
```bash
# Coordenadas: [minLat, minLon, maxLat, maxLon]
# São Paulo (aprox): [-23.81, -46.85, -23.34, -46.25]

curl -L "https://overpass-api.de/api/map?bbox=-46.85,-23.81,-46.25,-23.34" \
  --output osrm-data/sao-paulo-overpass.osm
```

## 🔧 Processamento de Dados com OSRM

> ⚠️ **Aviso:** Este processo é intensivo em CPU e memória. Pode levar 30+ minutos para Brasil inteiro.

### Pré-requisito

Primeiro, inicie apenas o container OSRM:

```bash
cd osrm-data
docker-compose up -d osrm
```

### Passos de Processamento

```bash
# 1. Extract (Extrair dados OSM)
docker-compose exec osrm osrm-extract -p /usr/share/osrm/profiles/car.lua \
  /data/brazil-latest.osm.pbf

# Saída esperada: brazil-latest.osrm (vários GB)
# Tempo estimado: 15-30 minutos para Brasil

# 2. Partition (Particionar dados)
docker-compose exec osrm osrm-partition /data/brazil-latest.osrm

# Tempo estimado: 10-15 minutos

# 3. Customize (Calcular pesos das arestas)
docker-compose exec osrm osrm-customize /data/brazil-latest.osrm

# Tempo estimado: 10-15 minutos
```

### Verificar Processamento

```bash
# Listar arquivos gerados
ls -lh osrm-data/

# Deve haver:
# brazil-latest.osrm
# brazil-latest.osrm.partition
# brazil-latest.osrm.customization
# brazil-latest.osrm.cnbg
# brazil-latest.osrm.properties
```

### Iniciar OSRM com Dados Processados

```bash
# Parar e remover container anterior
docker-compose down osrm

# Iniciar OSRM com dados processados
docker-compose up -d --profile osrm osrm

# Verificar status
curl http://localhost:5000/status
# Deve retornar: {"status":0,"data":"running"}
```

## 🚗 Perfis de Roteamento

O OSRM suporta diferentes perfis (car, bike, foot). No Bubber usamos **car** por padrão.

Para usar outro perfil:

```bash
# Bike
docker-compose exec osrm osrm-extract -p /usr/share/osrm/profiles/bike.lua \
  /data/brazil-latest.osm.pbf
docker-compose exec osrm osrm-partition /data/brazil-latest.osrm
docker-compose exec osrm osrm-customize /data/brazil-latest.osrm

# Foot
docker-compose exec osrm osrm-extract -p /usr/share/osrm/profiles/foot.lua \
  /data/brazil-latest.osm.pbf
docker-compose exec osrm osrm-partition /data/brazil-latest.osrm
docker-compose exec osrm osrm-customize /data/brazil-latest.osrm
```

## 📊 Otimização de Espaço

Se o espaço em disco for limitado, considere usar dados regionais:

```bash
# Opção 1: São Paulo (menor, mais rápido)
cd osrm-data
rm -f brazil-latest.*
wget https://download.geofabrik.de/south-america/brazil/sao-paulo-latest.osm.pbf
mv sao-paulo-latest.osm.pbf data.osm.pbf
cd ..

# Processar como "data"
docker-compose exec osrm osrm-extract -p /usr/share/osrm/profiles/car.lua \
  /data/data.osm.pbf
docker-compose exec osrm osrm-partition /data/data.osrm
docker-compose exec osrm osrm-customize /data/data.osrm

# Adicionar ao docker-compose.yml:
# command: osrm-routed --algorithm=MLD /data/data.osrm
```

## 🧪 Testar OSRM

```bash
# Teste básico
curl "http://localhost:5000/route/v1/driving/-46.6333,-23.5505;-46.6760,-23.5890"

# Resultado esperado:
{
  "code": "Ok",
  "routes": [
    {
      "geometry": "icx{E|esjVa@mAa@sAe@yA...",
      "legs": [...],
      "distance": 8541.5,
      "duration": 603.9
    }
  ],
  "waypoints": [...]
}

# Teste com instruções turn-by-turn
curl "http://localhost:5000/route/v1/driving/-46.6333,-23.5505;-46.6760,-23.5890?steps=true&annotations=distance,duration"
```

## 📈 Escalonamento

Para ambientes com muito tráfego:

```yaml
# docker-compose.yml
services:
  osrm:
    image: osrm/osrm-backend:v5.28.0
    # Aumentar recursos
    environment:
      - OSRM_THREADS=8  # Usar 8 cores da CPU
      - OSRM_MEMORY_LIMIT=16G  # Limitar a memória
    # ...
```

## 🆘 Troubleshooting

### "No such file or directory: /data/brazil-latest.osm.pbf"

```bash
# Verificar se o arquivo está em osrm-data/
ls -lh osrm-data/

# Deve haver: brazil-latest.osm.pbf (baixado)
```

### "Cannot allocate memory" durante processing

O OSRM precisa de muita RAM. Para máquinas com RAM limitada:

- Use dados regionais menores (ex: São Paulo)
- Ou processe fora do Docker e mova os arquivos `.osrm`

```bash
# Em máquina local com mais RAM
osrm-extract -p /path/to/car.lua /path/to/brazil-latest.osm.pbf
osrm-partition /path/to/brazil-latest.osrm
osrm-customize /path/to/brazil-latest.osrm

# Depois copiar para osrm-data/
```

### OSRM retorna "code": "NoRoute"

Significa que não há rota entre os dois pontos. Possíveis causas:

- Coordenadas fora da região dos dados
- Pontos não conectados (ex: ilha isolada)
- Dados não processados ("status": 1)

```bash
# Verificar status
curl http://localhost:5000/status

# Deve retornar status: 0 (OK)
```

## 📚 Recursos Adicionais

- **OSRM Documentation:** http://project-osrm.org/docs/v5.28.0/api/
- **Geofabrik Downloads:** https://download.geofabrik.de/
- **Overpass Turbo:** https://overpass-turbo.eu/
- **OSM Wiki:** https://wiki.openstreetmap.org/

## ⏱️ Tempos Estimados

| Dados | Extract | Partition | Customize | Total |
|-------|---------|-----------|-----------|-------|
| Brasil | 30 min | 15 min | 15 min | ~60 min |
| SP | 10 min | 5 min | 5 min | ~20 min |
| RJ | 8 min | 4 min | 4 min | ~16 min |

## 💾 Requisitos de Espaço

| Dados | OSM | OSRM | Total |
|-------|-----|------|-------|
| Brasil | 400 MB | 4.5 GB | 4.9 GB |
| São Paulo | 150 MB | 1.8 GB | 1.95 GB |
| Rio de Janeiro | 120 MB | 1.5 GB | 1.62 GB |

---

**Última atualização:** Janeiro 2024
