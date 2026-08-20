<script setup>
import Header from "../components/layout/Header.vue";
import SummaryCard from "../components/cards/SummaryCard.vue";
import CollectorStatus from "../components/cards/CollectorStatus.vue";
import FilterBar from "../components/filters/FilterBar.vue";
import RobotTable from "../components/tables/RobotTable.vue";
import AboutIndicators from "../components/layout/AboutIndicators.vue";
import GeneralQuantity from "../components/cards/GeneralQuantity.vue";
import { getDashboardData, getFullTable } from "../services/robotService"
import { getCollectorStatus, triggerCollectorRefresh } from "../services/collectorService"
import { useRouter } from "vue-router"
import { ref, onMounted, onUnmounted, watch } from "vue"
import { exportDashboardReport } from "../services/reportService"
import { getMaintenanceAlerts } from "../services/maitenanceService"

const filters = ref({
  store: null,
  robot: null
})

const dashboard = ref(null)
const collectorJobs = ref([])
const loading = ref(true)
const errorMessage = ref(null)
const refreshError = ref(null)
const maintenance = ref(null)

const router = useRouter()

async function loadDashboard() {
  try {
    dashboard.value = await getDashboardData(filters.value)
    errorMessage.value = null
  } catch (error) {
    console.error(error)
    errorMessage.value = "Não foi possível carregar os dados do painel. Tente novamente em instantes."
  }
}

async function loadCollectorStatus() {
  try {
    collectorJobs.value = await getCollectorStatus()
  } catch (error) {
    console.error(error)
    // erro no status do collector não deve travar o resto do dashboard
  }
}

let pollingInterval = null

async function refreshCollector() {
  refreshError.value = null
  try {
    await triggerCollectorRefresh()
    await loadCollectorStatus() // já deve mostrar "RUNNING" na hora
    startPolling()
  } catch (error) {
    refreshError.value = error.response?.data?.error || "Não foi possível iniciar a atualização agora."
  }
}

function startPolling() {
  if (pollingInterval) return // já está checando, não duplica

  pollingInterval = setInterval(async () => {
    await loadCollectorStatus()
    const aindaRodando = collectorJobs.value.some((job) => job.status === "RUNNING")

    if (!aindaRodando) {
      clearInterval(pollingInterval)
      pollingInterval = null
      await loadDashboard() // só recarrega os dados quando a coleta realmente terminou
    }
  }, 5000) // confere a cada 5 segundos
}

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval)
})

onMounted(async () => {
  loading.value = true
  await Promise.all([loadDashboard(), loadCollectorStatus(), loadMaintenance()])
  loading.value = false
})

watch(filters, () => {
  loadDashboard()
}, { deep: true })

function updateFilters(newFilters) {
  filters.value = newFilters
}

function abrirListaCompleta(tableId) {
  router.push({ path: `/table/${tableId}`, query: filters.value })
}

async function exportReport() {
  const [battery, inactive, failed, offline] = await Promise.all([
    getFullTable("battery", filters.value),
    getFullTable("inactive", filters.value),
    getFullTable("failed", filters.value),
    getFullTable("offline", filters.value),
  ])

  exportDashboardReport({ tables: { battery, inactive, failed, offline } }, filters.value)
}

async function loadMaintenance() {
  try {
    maintenance.value = await getMaintenanceAlerts()
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <Header/>
  <main>
    <p v-if="errorMessage" class="error-banner">{{ errorMessage }}</p>

    <div v-if="loading">Carregando...</div>

    <template v-else-if="dashboard">
      <CollectorStatus 
        :jobs="collectorJobs" 
        :refreshing="refreshing" 
        @refresh="refreshCollector" />
        <p v-if="refreshError" class="error-banner">{{ refreshError }}</p>
      <div class="cards">
        <GeneralQuantity
          title="Total de robôs"
          :value="dashboard.summary.totalRobots"
        />
        <GeneralQuantity
          title="Total de lojas criadas"
          :value="dashboard.summary.totalStores"
        />
      </div>
      <br>
      <div class="cards">
        <SummaryCard title="Pouca bateria" :value="dashboard.summary.lowBattery" icon="🔋" />
        <SummaryCard title="Robôs inativos" :value="dashboard.summary.inactive" icon="😴" />
        <SummaryCard title="Alta taxa de falha" :value="dashboard.summary.failed" icon="❌" />
        <SummaryCard title="Offline" :value="dashboard.summary.offline" icon="🌐" />
      </div>
      <div class="filter-and-report">
        <FilterBar
          :robotList="dashboard.filterBar.robotList"
          :storeList="dashboard.filterBar.storeList"
          @filter-change="updateFilters"
        />
        <button @click="exportReport">Exportar<br>pesquisa</button>
      </div>
      <div class="tables">
        <RobotTable
          title="Robôs com bateria abaixo ou igual a 10%"
          :columns="dashboard.tables.battery.columns"
          :rows="dashboard.tables.battery.rows"
          :totalRows="dashboard.tables.battery.totalRows"
          tableId="battery" fontColor="red" :maxRows="5"
          @view-all="abrirListaCompleta"
        />
        <RobotTable
          title="Robôs (online) que não realizam tarefas a mais de 72 horas"
          :columns="dashboard.tables.inactive.columns"
          :rows="dashboard.tables.inactive.rows"
          :totalRows="dashboard.tables.inactive.totalRows"
          tableId="inactive" fontColor="green" :maxRows="5"
          @view-all="abrirListaCompleta"
        />
        <RobotTable
          title="Robôs (online) com alta taxa de falha na entrega"
          :columns="dashboard.tables.failed.columns"
          :rows="dashboard.tables.failed.rows"
          :totalRows="dashboard.tables.failed.totalRows"
          tableId="failed" fontColor="orange" :maxRows="5"
          @view-all="abrirListaCompleta"
        />
        <RobotTable
          title="Robôs offline"
          :columns="dashboard.tables.offline.columns"
          :rows="dashboard.tables.offline.rows"
          :totalRows="dashboard.tables.offline.totalRows"
          tableId="offline" fontColor="#FF00FF" :maxRows="5"
          @view-all="abrirListaCompleta"
        />
      </div>

      <section v-if="maintenance" class="maintenance-section">
        <RobotTable
          :title="maintenance.title"
          :columns="maintenance.columns"
          :rows="maintenance.rows"
          tableId="maintenance"
          fontColor="#FFA500"
          :showFooter="false"
        />
      </section>

      <AboutIndicators />
    </template>
  </main>
</template>

<style scoped>
.error-banner {
  background: #ffdddd;
  color: #a30000;
  padding: 10px 20px;
  border-radius: 8px;
  margin: 10px;
}

main {
  background-color: #215DD1;
  display: flex;
  flex-direction: column;
  align-items: center; /* centraliza horizontalmente */
}

.cards {
  display: flex;
  gap: 20px;
  justify-content: center; /* garante centralização dos cards */
  flex-wrap: wrap; /* opcional: quebra em telas menores */
}

.filter-and-report {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 36px;
  padding: 20px;
}

button {
  margin-left: auto;
  height: 40px;
  padding: 0 20px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
}

.tables {
  display: flex;
  background-color: #215DD1;
  flex-wrap: wrap;
  gap: 30px;
  align-items: flex-start;
}
</style>