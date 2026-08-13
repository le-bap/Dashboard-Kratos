<script setup>
import { computed } from "vue"
import { formatCellValue } from "../../utils/formatters"

const props = defineProps({
  title: String,
  columns: Array,
  rows: Array,
  tableId: {
    type: String,
    required: true
  },
  buttonText: {
    type: String,
    default: "Ver todos"
  },
  fontColor: String,
  maxRows: {
    type: Number,
    default: null
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  totalRows: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(["view-all"])

const displayedRows = computed(() => {
  if (props.maxRows === null) {
    return props.rows
  }
  return props.rows.slice(0, props.maxRows)
})

const showViewAll = computed(() => {
  if (!props.showFooter) return false
  if (props.totalRows === null) return false
  return props.totalRows > props.rows.length
})

function cellClass(row, column) {
  const value = row[column.key]

  if (typeof value === "boolean") {
    return value ? "cell-positive" : "cell-negative"
  }

  return ""
}
</script>

<template>
  <div class="table-card" :style="{ '--title-color': fontColor }" >

    <div class="header">
      <h2>{{ title }}</h2>
    </div>

    <table>
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key">
            {{ column.label }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(row, index) in displayedRows" :key="index">
          <td v-for="column in columns" :key="column.key" :class="cellClass(row, column)">
            {{ formatCellValue(row, column) }}
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showViewAll" class="footer" @click="$emit('view-all', tableId)">
      {{ buttonText }} ({{ totalRows }})
    </div>

  </div>
</template>

<style scoped>
.table-card {
    width: 100%;
    max-width: 500px;
    background: #fff;
    border-radius: 22px;
    overflow: hidden;
    box-shadow: 0 6px 20px rgba(0,0,0,.12);
    margin: 20px auto;
    text-align: center;
}

.header {
    padding: 10px 10px;
    border-bottom: 1px solid #e8e8e8;
}

.header h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: var(--title-color);
}

table {
    width: 100%;
    border-collapse: collapse;
}

thead {
    background: white;
}

th {
    padding: 12px 10px;
    text-align: left;
    font-size: 18px;
    font-weight: 700;
    color: #5d6673;
    border-bottom: 1px solid #ececec;
    text-align: center;
}

td {
    padding: 10px 8px;
    font-size: 16px;
    color: #263238;
    border-bottom: 1px solid #f0f0f0;
}

.cell-positive {
  color: #1a9c4b;
  font-weight: 600;
}

.cell-negative {
  color: #d92d2d;
  font-weight: 600;
}

tbody tr:hover {
    background: #fafafa;
}

.footer {
    padding: 10px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: var(--title-color);
    cursor: pointer;
    transition: .2s;
}

.footer:hover {
    background: #fafafa;
}
</style>