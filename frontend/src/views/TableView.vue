<script setup>
import { useRoute } from "vue-router"
import { ref, onMounted } from "vue"
import RobotTable from "../components/tables/RobotTable.vue"
import { getFullTable } from "../services/robotService"

const route = useRoute()
const table = ref(null)
const loading = ref(true)
const errorMessage = ref(null)

onMounted(async () => {
  try {
    table.value = await getFullTable(route.params.type, {
      store: route.query.store,
      robot: route.query.robot,
    })
  } catch (error) {
    console.error(error)
    errorMessage.value = "Não foi possível carregar a tabela."
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="page">
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <div v-else-if="loading">Carregando...</div>
    <RobotTable
      v-else-if="table"
      :title="table.title"
      :columns="table.columns"
      :rows="table.rows"
      :showFooter="false"
      fontColor="red"
    />
  </div>
</template>

<style scoped>
.page {
  background-color: #215DD1;
  display: flex;
  flex-direction: column;
  padding-bottom: 200px;
}
</style>