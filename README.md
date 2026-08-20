# Painel de Controle Kratos Robotics

Painel de monitoramento para acompanhar o estado operacional da frota de robôs da Kratos Robotics, identificando situações que demandam atenção da equipe técnica e comercial — bateria baixa, robôs inativos, alta taxa de falha em entregas, robôs offline, e manutenções preventivas vencidas ou próximas do vencimento.

## Arquitetura

O sistema é dividido em 5 módulos independentes:

```
[API Keenon]                         [API Pipefy]
     │                                     │
     │ (auth + dados dos robôs)            │ (consulta ao vivo)
     ▼                                     │
[Collector] ──upsert──▶ [Supabase] ◀──consulta── [Backend] ◀────────────┘
     ▲                    (Postgres)          │
     │                                        │ REST API
     └──dispara sob demanda───────────────────┤
                                               ▼
                                          [Frontend]
                                            (Vue)
```

- **Collector** — processo Node que roda de forma contínua. Autentica na Keenon, renova token automaticamente, busca lojas/cenas/robôs/status/entregas e grava no Supabase. Roda em agenda fixa (cron) e também expõe um endpoint HTTP interno para disparo manual.
- **Supabase (Postgres)** — armazena o estado dos robôs e o histórico de entregas. As regras de negócio (bateria baixa, inatividade, taxa de falha) são implementadas como **views SQL**, não em código de aplicação.
- **Backend (Express)** — serve os dados já processados para o frontend, aplicando filtros (loja/robô) e consultando o Pipefy ao vivo para o indicador de manutenção preventiva.
- **Frontend (Vue)** — dashboard visual com cards de resumo, tabelas filtráveis, exportação em PDF e status da última coleta.
- **Pipefy** — fonte externa de dados de manutenção preventiva, consultada ao vivo pelo backend (não sincronizada em banco, pois muda a qualquer momento por ação humana).

## Estrutura de pastas

```
/collector   → serviço que coleta dados da API Keenon e grava no Supabase
/backend     → API que serve os dados ao frontend
/frontend    → aplicação Vue (dashboard)
/docs        → documentação e planejamento original do projeto
```

## Modelo de dados (Supabase)

| Tabela | Descrição |
|---|---|
| `store` | Lojas/clientes da Kratos |
| `scene` | Cenas (mapas) cadastradas na Keenon, vinculadas a uma loja |
| `robot` | Robôs — bateria, status de carga, online/offline, cena vinculada |
| `deliverytask` | Histórico de entregas (chave primária composta: `robotid` + `starttime`) |
| `collectorstatus` | Status da última execução de cada job do collector (por `job_name`) |

Views de negócio: `v_low_battery_robots`, `v_inactive_robots`, `v_high_failure_rate_robots`, `v_offline_robots`.

## Regras de negócio implementadas

| Indicador | Regra | Janela |
|---|---|---|
| Bateria baixa | `battery <= 10` | instantâneo |
| Robô inativo | Online, sem nenhuma tarefa concluída | últimas 72h |
| Alta taxa de falha |Online, ≥ 3 tarefas, com ≥ 40% de falha | últimas 24h |
| Offline | `onlinestatus = false` | instantâneo |
| Manutenção preventiva | Cards do Pipefy em fases técnicas específicas, por `Data de Vencimento` | vencidos + próximos 7 dias |

Um robô sem `scenecode` (sem cena/loja vinculada) é automaticamente excluído de todos os indicadores, por design do `JOIN` usado nas views.

## Frequência de atualização

| Job | Frequência | O que faz |
|---|---|---|
| `robot_status` | 30 min | Lojas → cenas → robôs → status de bateria/online/carga |
| `delivery_tasks` | A cada 3h | Busca entregas desde a última coleta bem-sucedida (janela dinâmica, com fallback de 72h na primeira execução) |
| Manutenção (Pipefy) | Ao vivo | Consultado a cada carregamento do dashboard, sem cache |

O botão "Atualizar" no dashboard dispara uma coleta manual imediata (Collector → Keenon), sem esperar o próximo ciclo agendado. Como o job pode levar mais de 2 minutos, o botão libera a tela na hora e o frontend consulta o status a cada 5 segundos até a coleta terminar.

## Configuração

Cada módulo (`collector/`, `backend/`) precisa de um arquivo `.env` próprio (nunca versionado):

**`collector/.env`**
```
KEENON_BASE_URL=...
KEENON_CLIENT_ID=...
KEENON_CLIENT_SECRET=...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
INTERNAL_API_KEY=...
COLLECTOR_PORT=4000
```

**`backend/.env`**
```
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
PORT=3000
COLLECTOR_URL=http://localhost:4000
COLLECTOR_INTERNAL_KEY=...
PIPEFY_API_TOKEN=...
PIPEFY_MAINTENANCE_PIPE_ID=...
```

**`frontend/.env`**
```
VITE_API_URL=http://localhost:3000/api
```

## Rodando localmente

```bash
# Backend
cd backend
npm install
npm run dev

# Collector
cd collector
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## Decisões de arquitetura relevantes

- **Regras de negócio em SQL (views), não em código** — mais performático conforme a frota cresce, e centraliza a lógica num único lugar.
- **Collector e Backend são processos independentes** — podem ser hospedados/escalados separadamente no futuro.
- **`collected_at`/`endtime` como timestamp real, não aproximado** — a API da Keenon fornece `startTime`/`endTime` reais por tarefa, usados diretamente nas regras de negócio.
- **Chave primária composta em `deliverytask`** (`robotid` + `starttime`) — a Keenon não fornece um ID único por tarefa.
- **Fuso horário fixo em `America/Sao_Paulo`** — os robôs são configurados manualmente pela Kratos, todos no mesmo fuso; é uma responsabilidade operacional, não uma garantia técnica.
- **Pipefy não sincronizado em banco** — consultado ao vivo, pois os dados mudam por ação humana e o volume de acesso ao dashboard é baixo.
