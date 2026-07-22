<script setup>
import { ref, watch } from "vue"

import Multiselect from "vue-multiselect"
import "vue-multiselect/dist/vue-multiselect.css"

const store = ref(null)
const robot = ref(null)

const props = defineProps({
  robotList:Array,
  storeList:Array
})

function limparFiltros() {
  store.value = null
  robot.value = null
}

// emitir um evento que um filtro foi mudado
const emit = defineEmits(["filter-change"])
watch([store, robot], () => {
  emit("filter-change", {
    store: store.value?.storeName ?? null,
    robot: robot.value?.robotid ?? null
  })
})
</script>

<template>
  <div class="filters">

    <div class="filter-group">
      <label>Lojas</label>
      <Multiselect
        v-model="robot"
        :options="robotList"
        label="robotid"
        track-by="robotid"
        :searchable="true"
        :allow-empty="true"
        :show-labels="false"
        placeholder="Pesquisar robô"
      />
    </div>

    <div class="filter-group">
      <label>Robôs</label>
      <Multiselect
        v-model="store"
        :options="storeList"
        label="storeName"
        track-by="storeName"
        :searchable="true"
        :allow-empty="true"
        :show-labels="false"
        placeholder="Pesquisar loja"
      />
    </div>

    <button @click="limparFiltros">
      ▽ Limpar filtros
    </button>

  </div>
</template>

<style scoped>
.filters {
  margin-top: 50px;
  display: flex;
  align-items: end;
  gap: 36px;
  padding: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  font-family: Arial, Helvetica, sans-serif;
}

label {
  font-weight: 600;
  margin-bottom: 8px;
  color: white;
}

select {
  width: 300px;
  height: 30px;
  padding: 0 15px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 18px;
  background: white;
}

button {
  margin-left: auto;
  height: 40px;
  padding: 0 24px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
}

button:hover {
  background: #f5f5f5;
}

.multiselect {
  color: black;
  width: 320px;
}

:deep(.multiselect__tags) {
    min-height: 42px;
    border-radius: 12px;
    border: 1px solid #ddd;
    font-size: 16px;
    color: black;
}

:deep(.multiselect__content-wrapper) {
    border-radius: 12px;
}

:deep(.multiselect__option--highlight) {
    background: #69ACEE;
}

:deep(.multiselect__placeholder) {
    color: #999;
}
</style>