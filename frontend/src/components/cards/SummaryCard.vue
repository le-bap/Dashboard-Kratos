<script setup>

// o que irá receber de informação
defineProps({
    title:String,
    value:Number,
    icon:String
})

</script>

<template>

<div class="card">

    <div class="icon">
        {{ icon }}
    </div>

    <div class="content">
        <h3>{{ title }}</h3>
        <p>{{ value }}</p>
    </div>

</div>

</template>

<style scoped>

.card{
    background:white;
    border-radius:12px;
    padding:20px;
    display:flex;
    align-items:center;
    gap:18px;
    box-shadow:0px 4px 10px rgba(0,0,0,.08);
}

.icon{
    font-size:40px;
}

.content{
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
}

.content h3{
    margin:0;
    color:#666;
}

.content p{
    margin:4px 0 0;
    font-size:34px;
    font-weight:bold;

}

</style>