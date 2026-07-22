<script setup>
import { useRoute } from "vue-router"

import RobotTable from "../components/tables/RobotTable.vue"
import { getTable } from "../services/robotService"

const route = useRoute()

const table = getTable(route.params.type)
</script>

<template>

<div class="page">

    <RobotTable
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