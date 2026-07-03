<script setup>
import Header from "../components/layout/Header.vue";
import SummaryCard from "../components/cards/SummaryCard.vue";
import CollectorStatus from "../components/cards/CollectorStatus.vue"
import FilterBar from "../components/filters/FilterBar.vue"
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
    </div>
    <FilterBar/>
  </main>

</template>

<style scoped>
main {
  padding: 30px;
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
</style>