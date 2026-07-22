<script setup>
import Header from "../components/layout/Header.vue";
import SummaryCard from "../components/cards/SummaryCard.vue";
import CollectorStatus from "../components/cards/CollectorStatus.vue";
import FilterBar from "../components/filters/FilterBar.vue";
import RobotTable from "../components/tables/RobotTable.vue";
import AboutIndicators from "../components/layout/AboutIndicators.vue";
import GeneralQuantity from "../components/cards/GeneralQuantity.vue";
import { getDashboardData } from "../services/robotService"
import { useRouter } from "vue-router"
import { ref, computed } from "vue"

const filters = ref({
  store: null,
  robot: null
})

const dashboard = computed(() =>
  getDashboardData(filters.value)
)

const router = useRouter()

function updateFilters(newFilters) {
  console.log(newFilters)
  filters.value = newFilters
}

function abrirListaCompleta(tableId){
  router.push(`/table/${tableId}`)
}

</script>

<template>

  <Header/>
  <main>
    <CollectorStatus
      status="Dados atualizado com sucesso:"
      lastAttempt="01/07/2026 10:00"
      lastUpdate="01/07/2026 10:00"
    />
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
        <SummaryCard
            title="Pouca bateria"
            :value="dashboard.summary.lowBattery"
            icon="🔋"
        />
        <SummaryCard
            title="Robôs inativos"
            :value="dashboard.summary.inactive"
            icon="😴"
        />
        <SummaryCard
            title="Alta taxa de falha"
            :value="dashboard.summary.failed"
            icon="❌"
        />

        <SummaryCard
            title="Offline"
            :value="dashboard.summary.offline"
            icon="🌐"
        />
    </div>
    <FilterBar
      :robotList="dashboard.filterBar.robotList"
      :storeList="dashboard.filterBar.storeList"
      @filter-change="updateFilters"
    />

    <div class="tables">
      <RobotTable
        title="Robôs com bateria abaixo de 10%"
        :columns="dashboard.tables.battery.columns"
        :rows="dashboard.tables.battery.rows"
        :totalRows="dashboard.tables.battery.totalRows"
        tableId="battery"
        fontColor="red"
        :maxRows="5"
        @view-all="abrirListaCompleta"
      />

      <RobotTable
        title="Robôs que não realizam tarefas a mais de 3 dias"
        :columns="dashboard.tables.inactive.columns"
        :rows="dashboard.tables.inactive.rows"
        :totalRows="dashboard.tables.inactive.totalRows"
        tableId="inactive"
        fontColor="green"
        :maxRows="5"
        @view-all="abrirListaCompleta"
      />

      <RobotTable
        title="Robôs com alta taxa de falha na entrega"
        :columns="dashboard.tables.failed.columns"
        :rows="dashboard.tables.failed.rows"
        :totalRows="dashboard.tables.failed.totalRows"
        tableId="failed"
        fontColor="orange"
        :maxRows="5"
        @view-all="abrirListaCompleta"
      />

      <RobotTable
        title="Robôs offline"
        :columns="dashboard.tables.offline.columns"
        :rows="dashboard.tables.offline.rows"
        :totalRows="dashboard.tables.offline.totalRows"
        tableId="offline"
        fontColor="#FF00FF"
        :maxRows="5"
        @view-all="abrirListaCompleta"
      />
    </div>

    <AboutIndicators />
  </main>

</template>

<style scoped>
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

.tables {
  display: flex;
  background-color: #215DD1;
  flex-wrap: wrap;
  gap: 30px;
  align-items: flex-start;
}
</style>