<script setup>
import { computed } from "vue"
import { formatDateTime } from "../../utils/formatters"

const props = defineProps({
  jobs: { type: Array, default: () => [] }
})

const emit = defineEmits(["refresh"])
function refresh() {
  emit("refresh")
}

const isRunning = computed(() =>
  props.jobs.some((job) => job.status === "RUNNING")
)

const statusIcons = {
  SUCCESS: "✅",
  ERROR: "❌",
  RUNNING: "🔄"
}
</script>

<template>
  <div class="card">
    <div v-for="job in jobs" :key="job.jobName" class="job">
      <div class="icon">{{ statusIcons[job.status] || "❔" }}</div>
      <div class="content">
        <p>{{ job.jobName }}</p>
        <h3>Última tentativa: {{ formatDateTime(job.lastAttempt) }}</h3>
        <h3>Última atualização: {{ formatDateTime(job.lastSuccess) }}</h3>
      </div>
    </div>

    <button @click="refresh" :disabled="isRunning">
      <span class="spin-icon">🔄</span>
      {{ isRunning ? "Coletando..." : "Atualizar" }}
    </button>
  </div>
</template>

<style scoped>
.card {
  padding: 15px;
  max-width: 900px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  background-color: #215DD1;
  margin-bottom: 15px;
}
.job {
  display: flex;
  align-items: center;
  gap: 10px;
}
.icon { font-size: 18px; color: white; }
.content h3 { margin: 0; font-size: 14px; color: white; }
.content p { margin: 4px 0 0; font-size: 16px; font-weight: bold; color: white; }
</style>