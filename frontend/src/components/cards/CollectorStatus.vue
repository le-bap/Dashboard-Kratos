<script setup>

defineProps({
    status:String,
    lastUpdate:String,
    lastAttempt:String
})

</script>

<template>

<div class="card">

    <div class="icon">
        {{ status}}
    </div>

    <div class="content">
        <p>Última tentativa</p>
        <h3>{{ lastAttempt }}</h3>
    </div>

    <div class="content">
        <p>Última atualização</p>
        <h3>{{ lastUpdate}}</h3>
    </div>

    <div class="content">
        <p id="nowLabel">📅 06/07/2026 14:22</p>
        <button class="refresh-btn" id="refreshBtn"><span class="spin-icon">🔄</span> Atualizar</button>
      </div>

</div>

</template>

<style scoped>

.card{
    padding:15px;
    display:flex;
    align-items:center;
    gap:20px;
    background-color: #1E3A5F;
}

.icon{
    font-size:20px;
    color: white;
}

.content h3{
    margin:0;
    font-size: 15px;
    color:white;
}

.content p{
    margin:4px 0 0;
    font-size:20px;
    font-weight:bold;
    color: white;
}

</style>