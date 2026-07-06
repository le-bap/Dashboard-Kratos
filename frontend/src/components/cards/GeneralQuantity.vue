<script setup>

// o que irá receber de informação
defineProps({
    title:String,
    value:Number,
})

</script>

<template>

<div class="card">

    <div class="content">
        <h3>{{ title }}</h3>
        <p>{{ value }}</p>
    </div>

</div>

</template>

<style scoped>

.card{
    border-radius:12px;
    padding:20px;
    display:flex;
    align-items:center;
    gap:18px;
}

.content h3{
    margin:0;
    color: white
}

.content p{
    color: white;
    margin:4px 0 0;
    font-size:44px;
    font-weight:bold;

}

</style>