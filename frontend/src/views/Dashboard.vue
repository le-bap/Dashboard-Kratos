<script setup>
import Header from "../components/layout/Header.vue";
import SummaryCard from "../components/cards/SummaryCard.vue";
import CollectorStatus from "../components/cards/CollectorStatus.vue"
import FilterBar from "../components/filters/FilterBar.vue"
import RobotTable from "../components/tables/RobotTable.vue";
import AboutIndicators from "../components/layout/AboutIndicators.vue";

const columns_battery = [
  { label: "Robô", key: "robot" },
  { label: "Loja", key: "store" },
  { label: "Bateria", key: "battery" },
  { label: "Carregando?", key: "is_charging" },
];

const columns_inactives = [
  { label: "Robô", key: "robot" },
  { label: "Loja", key: "store" },
];

const columns_failed = [
  { label: "Robô", key: "robot" },
  { label: "Loja", key: "store" },
  { label: "Num. tasks Completadas", key: "num_tasks_success" },
  { label: "Num. tasks Falhadas", key: "num_tasks_failed" }
];

const rows = [
  {
    robot: "C4:3C:B0:AA:F7:2D",
    store: "INSIGN - Kratos Robotics",
    is_charging: "Sim",
    battery: "8%",
    num_tasks_success: 200,
    num_tasks_failed: 100,
  },
  {
    robot: "C4:3C:B0:AA:F7:2D",
    store: "Loja C",
    is_charging: "Sim",
    battery: "5%",
    num_tasks_success: 130,
    num_tasks_failed: 70,
  },
  {
    robot: "C4:3C:B0:AA:F7:2D",
    store: "Loja B",
    is_charging: "Não",
    battery: "9%",
    num_tasks_success: 10,
    num_tasks_failed: 5,
  }
];

function abrirListaCompleta(){
    console.log("Abrir página completa");
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
        <SummaryCard
            title="Pouca bateria"
            :value="3"
            icon="🔋"
        />
        <SummaryCard
            title="Robôs inativos"
            :value="5"
            icon="😴"
        />
        <SummaryCard
            title="Alta taxa de falha"
            :value="2"
            icon="❌"
        />

        <SummaryCard
            title="Offline"
            :value="7"
            icon="🌐"
        />
    </div>
    <FilterBar/>

    <div class="tables">
      <RobotTable
        title="Robôs com bateria abaixo de 10%"
        :columns="columns_battery"
        :rows="rows"
        @view-all="abrirListaCompleta"
        fontColor="red"
      />

      <RobotTable
        title="Robôs que não realizam tarefas a mais de 3 dias"
        :columns="columns_inactives"
        :rows="rows"
        @view-all="abrirListaCompleta"
        fontColor="green"
      />

      <RobotTable
        title="Robôs com alta taxa de falha na entrega"
        :columns="columns_failed"
        :rows="rows"
        @view-all="abrirListaCompleta"
        fontColor="orange"
      />

      <RobotTable
        title="Robôs offline"
        :columns="columns_inactives"
        :rows="rows"
        @view-all="abrirListaCompleta"
        fontColor="#FF00FF"
      />
    </div>

    <AboutIndicators />
  </main>

</template>

<style scoped>
main {
  background-color: #1E3A5F;
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
  background-color: #1E3A5F;
  flex-wrap: wrap;
  gap: 30px;
  align-items: flex-start;
}
</style>