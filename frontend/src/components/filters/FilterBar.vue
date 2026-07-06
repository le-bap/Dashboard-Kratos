<script setup>
import { ref } from "vue";

const loja = ref("Todas");
const cliente = ref("Todos");

const lojas = [
  "Todas",
  "Loja A",
  "Loja B",
  "Loja C"
];

const clientes = [
  "Todos",
  "Cliente 1",
  "Cliente 2",
  "Cliente 3"
];

function limparFiltros() {
  loja.value = "Todas";
  cliente.value = "Todos";
}
</script>

<template>
  <div class="filters">

    <div class="filter-group">
      <label>Loja</label>
      <select v-model="loja">
        <option
          v-for="item in lojas"
          :key="item"
          :value="item"
        >
          {{ item }}
        </option>
      </select>
    </div>

    <div class="filter-group">
      <label>Cliente</label>
      <select v-model="cliente">
        <option
          v-for="item in clientes"
          :key="item"
          :value="item"
        >
          {{ item }}
        </option>
      </select>
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
</style>