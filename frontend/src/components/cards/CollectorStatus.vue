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
        <button ><span class="spin-icon">🔄</span> Atualizar</button>
      </div>

</div>

</template>

<style scoped>

.card{
    padding:15px;
    max-width: 900px;
    display:flex;
    align-items:center;
    gap:20px;
    background-color: #1E3A5F;
    margin-bottom: 15px;
}

.icon{
    font-size:18px;
    color: white;
}

.content h3{
    margin:0;
    font-size: 14px;
    color:white;
}

.content p{
    margin:4px 0 0;
    font-size:18px;
    font-weight:bold;
    color: white;
}

</style>